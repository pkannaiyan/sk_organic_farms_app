/**
 * Global State Management using Zustand
 * Manages cart, user, and app state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartMutations, CustomerMutations } from '../services/shopifyApi';

// Types
interface CartItem {
  id: string;
  lineId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  price: number;
  quantity: number;
  image: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
}

interface AppState {
  // Cart State
  cartId: string | null;
  cartItems: CartItem[];
  cartTotal: number;
  cartCount: number;
  
  // User State
  user: User | null;
  isAuthenticated: boolean;
  
  // UI State
  isLoading: boolean;
  
  // Cart Actions
  initializeCart: () => Promise<void>;
  addToCart: (variantId: string, quantity: number, productInfo: any) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  clearCart: () => void;
  
  // User Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  
  // UI Actions
  setLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      cartId: null,
      cartItems: [],
      cartTotal: 0,
      cartCount: 0,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Cart Actions
      initializeCart: async () => {
        try {
          if (!get().cartId) {
            const response: any = await CartMutations.createCart();
            if (response.cartCreate?.cart) {
              set({ cartId: response.cartCreate.cart.id });
            }
          }
        } catch (error) {
          console.error('Error initializing cart:', error);
        }
      },

      addToCart: async (variantId, quantity, productInfo) => {
        set({ isLoading: true });
        try {
          let { cartId } = get();
          
          // Create cart if doesn't exist
          if (!cartId) {
            const createResponse: any = await CartMutations.createCart();
            cartId = createResponse.cartCreate?.cart?.id;
            set({ cartId });
          }

          if (cartId) {
            const response: any = await CartMutations.addToCart(cartId, [
              { merchandiseId: variantId, quantity },
            ]);

            if (response.cartLinesAdd?.cart) {
              const cart = response.cartLinesAdd.cart;
              const items = cart.lines.edges.map((edge: any) => ({
                id: edge.node.id,
                lineId: edge.node.id,
                variantId: edge.node.merchandise.id,
                title: edge.node.merchandise.product.title,
                variantTitle: edge.node.merchandise.title,
                price: parseFloat(edge.node.merchandise.price.amount),
                quantity: edge.node.quantity,
                image: edge.node.merchandise.product.images.edges[0]?.node.url || '',
              }));

              set({
                cartItems: items,
                cartTotal: parseFloat(cart.cost.totalAmount.amount),
                cartCount: items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
              });
            }
          }
        } catch (error) {
          console.error('Error adding to cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (lineId, quantity) => {
        set({ isLoading: true });
        try {
          const { cartId } = get();
          if (cartId) {
            const response: any = await CartMutations.updateCartLine(cartId, lineId, quantity);
            
            if (response.cartLinesUpdate?.cart) {
              const cart = response.cartLinesUpdate.cart;
              const items = cart.lines.edges.map((edge: any) => ({
                id: edge.node.id,
                lineId: edge.node.id,
                variantId: edge.node.merchandise.id,
                title: edge.node.merchandise.product.title,
                variantTitle: edge.node.merchandise.title,
                price: parseFloat(edge.node.merchandise.price.amount),
                quantity: edge.node.quantity,
                image: edge.node.merchandise.product.images.edges[0]?.node.url || '',
              }));

              set({
                cartItems: items,
                cartTotal: parseFloat(cart.cost.totalAmount.amount),
                cartCount: items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
              });
            }
          }
        } catch (error) {
          console.error('Error updating quantity:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      removeFromCart: async (lineId) => {
        set({ isLoading: true });
        try {
          const { cartId } = get();
          if (cartId) {
            const response: any = await CartMutations.removeFromCart(cartId, [lineId]);
            
            if (response.cartLinesRemove?.cart) {
              const cart = response.cartLinesRemove.cart;
              const items = cart.lines.edges.map((edge: any) => ({
                id: edge.node.id,
                lineId: edge.node.id,
                variantId: edge.node.merchandise.id,
                title: edge.node.merchandise.product.title,
                variantTitle: edge.node.merchandise.title,
                price: parseFloat(edge.node.merchandise.price.amount),
                quantity: edge.node.quantity,
                image: edge.node.merchandise.product.images.edges[0]?.node.url || '',
              }));

              set({
                cartItems: items,
                cartTotal: parseFloat(cart.cost.totalAmount.amount),
                cartCount: items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
              });
            }
          }
        } catch (error) {
          console.error('Error removing from cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => {
        set({
          cartId: null,
          cartItems: [],
          cartTotal: 0,
          cartCount: 0,
        });
      },

      // User Actions
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response: any = await CustomerMutations.createAccessToken(email, password);
          
          if (response.customerAccessTokenCreate?.customerAccessToken) {
            const { accessToken } = response.customerAccessTokenCreate.customerAccessToken;
            
            // Get customer details
            const customerResponse: any = await CustomerMutations.getCustomer(accessToken);
            
            if (customerResponse.customer) {
              const customer = customerResponse.customer;
              set({
                user: {
                  id: customer.id,
                  email: customer.email,
                  firstName: customer.firstName,
                  lastName: customer.lastName,
                  accessToken,
                },
                isAuthenticated: true,
              });
              return true;
            }
          }
          return false;
        } catch (error) {
          console.error('Error logging in:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      register: async (email, password, firstName, lastName) => {
        set({ isLoading: true });
        try {
          const response: any = await CustomerMutations.createCustomer(
            email,
            password,
            firstName,
            lastName
          );
          
          if (response.customerCreate?.customer) {
            // Auto-login after registration
            return await get().login(email, password);
          }
          return false;
        } catch (error) {
          console.error('Error registering:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // UI Actions
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'sk-organic-farms-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        cartId: state.cartId,
        cartItems: state.cartItems,
        cartTotal: state.cartTotal,
        cartCount: state.cartCount,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useStore;

