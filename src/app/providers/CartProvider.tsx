'use client';
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  numbers?: string[];
}
interface CartState {
  items: CartItem[];
}
type CartAction =
  | { type: 'ADD'; payload: CartItem }
  | { type: 'REMOVE'; payload: { id: number } }
  | { type: 'UPDATE_QTY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD':
      return { items: [...state.items, action.payload] };
    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.payload.id) };
    case 'UPDATE_QTY':
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i,
        ),
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  add: (item: CartItem) => void;
  remove: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clear: () => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      JSON.parse(stored).forEach((item: CartItem) => dispatch({ type: 'ADD', payload: item }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const add = (item: CartItem) => dispatch({ type: 'ADD', payload: item });
  const remove = (id: number) => dispatch({ type: 'REMOVE', payload: { id } });
  const updateQty = (id: number, quantity: number) =>
    dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } });
  const clear = () => dispatch({ type: 'CLEAR' });

  return (
    <CartContext.Provider value={{ state, add, remove, updateQty, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
