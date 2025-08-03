import { create } from 'zustand';
import { SwapState, Token, Network, SwapQuote, FusionOrder, DutchAuction } from '../types';

interface SwapStore extends SwapState {
  // Actions
  setFromToken: (token: Token) => void;
  setToToken: (token: Token) => void;
  setFromChain: (chain: Network) => void;
  setToChain: (chain: Network) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  setQuote: (quote: SwapQuote | undefined) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | undefined) => void;
  swapTokens: () => void;
  reset: () => void;
  
  // Fusion+ specific
  activeOrders: FusionOrder[];
  activeAuctions: Record<string, DutchAuction>;
  addOrder: (order: FusionOrder) => void;
  updateOrder: (orderId: string, updates: Partial<FusionOrder>) => void;
  updateAuction: (auction: DutchAuction) => void;
  removeOrder: (orderId: string) => void;
}

const initialState: SwapState = {
  fromAmount: '',
  toAmount: '',
  isLoading: false,
};

export const useSwapStore = create<SwapStore>((set, get) => ({
  ...initialState,
  activeOrders: [],
  activeAuctions: {},

  setFromToken: (token) => set({ fromToken: token }),
  setToToken: (token) => set({ toToken: token }),
  setFromChain: (chain) => set({ fromChain: chain }),
  setToChain: (chain) => set({ toChain: chain }),
  setFromAmount: (amount) => set({ fromAmount: amount }),
  setToAmount: (amount) => set({ toAmount: amount }),
  setQuote: (quote) => set({ quote }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  swapTokens: () => {
    const { fromToken, toToken, fromChain, toChain, fromAmount, toAmount } = get();
    set({
      fromToken: toToken,
      toToken: fromToken,
      fromChain: toChain,
      toChain: fromChain,
      fromAmount: toAmount,
      toAmount: fromAmount,
      quote: undefined,
      error: undefined
    });
  },

  reset: () => set({ ...initialState, activeOrders: [], activeAuctions: {} }),

  // Fusion+ specific actions
  addOrder: (order) => set((state) => ({
    activeOrders: [...state.activeOrders, order]
  })),

  updateOrder: (orderId, updates) => set((state) => ({
    activeOrders: state.activeOrders.map(order =>
      order.orderId === orderId ? { ...order, ...updates } : order
    )
  })),

  updateAuction: (auction) => set((state) => ({
    activeAuctions: {
      ...state.activeAuctions,
      [auction.orderId]: auction
    }
  })),

  removeOrder: (orderId) => set((state) => ({
    activeOrders: state.activeOrders.filter(order => order.orderId !== orderId),
    activeAuctions: Object.fromEntries(
      Object.entries(state.activeAuctions).filter(([id]) => id !== orderId)
    )
  }))
}));