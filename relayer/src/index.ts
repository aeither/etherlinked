/**
 * Etherlink Fusion+ Relayer Main Entry Point
 */

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { RelayerService } from './services/RelayerService';
import { Logger } from './utils/logger';

// Load environment variables
dotenv.config();

const logger = new Logger('Main');

// Configuration
const PORT = process.env.PORT || 3001;
const NETWORKS = (process.env.NETWORKS || 'etherlinkTestnet,ethereum').split(',');
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const FUSION_API_KEY = process.env.FUSION_API_KEY;

if (!PRIVATE_KEY) {
  logger.error('PRIVATE_KEY environment variable is required');
  process.exit(1);
}

// Initialize services
let relayerService: RelayerService;

/**
 * Setup Express server with API endpoints
 */
function setupExpressServer(): express.Application {
  const app = express();
  
  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  }));
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    const state = relayerService?.getState();
    res.json({
      status: 'ok',
      timestamp: Date.now(),
      relayer: {
        isRunning: state?.isRunning || false,
        networks: state?.connectedNetworks || [],
        activeOrders: state?.activeOrders?.length || 0,
        pendingSwaps: state?.pendingSwaps?.length || 0
      }
    });
  });

  // Get relayer state
  app.get('/api/state', (req, res) => {
    try {
      const state = relayerService.getState();
      res.json(state);
    } catch (error) {
      logger.error('Failed to get relayer state:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get specific order status
  app.get('/api/orders/:orderId', (req, res) => {
    try {
      const { orderId } = req.params;
      const state = relayerService.getState();
      const order = state.activeOrders.find(o => o.orderId === orderId);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      res.json(order);
    } catch (error) {
      logger.error('Failed to get order:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get swap status
  app.get('/api/swaps/:orderId', (req, res) => {
    try {
      const { orderId } = req.params;
      const state = relayerService.getState();
      const swap = state.pendingSwaps.find(s => s.orderId === orderId);
      
      if (!swap) {
        return res.status(404).json({ error: 'Swap not found' });
      }
      
      res.json(swap);
    } catch (error) {
      logger.error('Failed to get swap:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Error handling middleware
  app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Express error:', error);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

/**
 * Setup WebSocket server for real-time updates
 */
function setupWebSocketServer(server: any): WebSocketServer {
  const wss = new WebSocketServer({ server });
  
  wss.on('connection', (ws) => {
    logger.info('WebSocket client connected');
    
    // Send initial state
    const state = relayerService?.getState();
    if (state) {
      ws.send(JSON.stringify({
        type: 'initial_state',
        data: state,
        timestamp: Date.now()
      }));
    }
    
    ws.on('close', () => {
      logger.info('WebSocket client disconnected');
    });
    
    ws.on('error', (error) => {
      logger.error('WebSocket error:', error);
    });
  });

  // Relay service events to all connected clients
  if (relayerService) {
    relayerService.on('escrowEvent', (event) => {
      broadcast(wss, 'escrow_event', event);
    });

    relayerService.on('swapCompleted', (data) => {
      broadcast(wss, 'swap_completed', data);
    });

    relayerService.on('auctionUpdate', (data) => {
      broadcast(wss, 'auction_update', data);
    });
  }

  return wss;
}

/**
 * Broadcast message to all WebSocket clients
 */
function broadcast(wss: WebSocketServer, type: string, data: any): void {
  const message = JSON.stringify({
    type,
    data,
    timestamp: Date.now()
  });

  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}

/**
 * Main application startup
 */
async function main(): Promise<void> {
  try {
    logger.info('🚀 Starting Etherlink Fusion+ Relayer...');
    logger.info(`Configuration:`, {
      networks: NETWORKS,
      port: PORT,
      hasFusionApiKey: !!FUSION_API_KEY
    });

    // Initialize relayer service
    relayerService = new RelayerService(NETWORKS, PRIVATE_KEY, FUSION_API_KEY);

    // Setup Express app
    const app = setupExpressServer();

    // Create HTTP server
    const server = createServer(app);

    // Setup WebSocket server
    const wss = setupWebSocketServer(server);

    // Start relayer service
    await relayerService.start();

    // Start HTTP server
    server.listen(PORT, () => {
      logger.info(`🌐 Server running on http://localhost:${PORT}`);
      logger.info(`📡 WebSocket server ready for real-time updates`);
      logger.info(`✅ Etherlink Fusion+ Relayer is now operational!`);
    });

    // Graceful shutdown handling
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);
      
      // Stop relayer service
      if (relayerService) {
        await relayerService.stop();
      }
      
      // Close WebSocket server
      wss.close();
      
      // Close HTTP server
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start relayer:', error);
    process.exit(1);
  }
}

// Start the application
main().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});