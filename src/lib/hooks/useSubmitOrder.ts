import { useCallback } from 'react';
import { Order } from '@/lib/data/mock-data';

export function useSubmitOrder(
  clearCart: () => void,
  setOrderList: (o: Order[]) => void,
  setSubmitted: (b: boolean) => void,
) {
  return useCallback(
    async (newOrder: Order) => {
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder),
        });
        if (!res.ok) throw new Error(await res.text());

        clearCart();
        localStorage.removeItem('orderList');
        localStorage.removeItem('cart');
        setOrderList([]);
        setSubmitted(true);
      } catch (err) {
        console.error('Order submission failed →', err);
        alert('Could not submit order'); // swap for toast if you like
      }
    },
    [clearCart, setOrderList, setSubmitted],
  );
}
// This hook handles the order submission logic, including clearing the cart,
// resetting the order list, and setting the submitted state.
// It uses the Fetch API to send the order data to the server and handles errors gracefully.
