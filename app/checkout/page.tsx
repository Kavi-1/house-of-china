"use client";

import React, { useState } from 'react';
import { useCart } from '@/app/components/CartContext';
import Nav from '@/app/components/Nav';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);


  const total = cart.reduce((s, it) => s + (it.basePrice + (it.optionPrice || 0)) * it.quantity, 0);

  const handlePayNow = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      // associate order with user if logged in 
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }

      const { data: { session } } = await (await import('@/lib/supabaseClient')).supabase.auth.getSession()
      const token = session?.access_token
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers,
        body: JSON.stringify({ items: cart })
      });
      const data = await res.json();
      if (data?.url) {
        // redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error('Failed to create session', data);
        alert('Failed to create checkout session');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error creating checkout session');
      setLoading(false);
    }
  }

  return (
    <>
      <Nav />
      <main className="font-poppins max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        {cart.length === 0 ? (
          <div>Your cart is empty.</div>
        ) : (
          <div className="space-y-4">
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between items-center bg-red-100 border p-4 rounded-lg">
                <div>
                  <div className="font-semibold">{item.name}</div>
                  {item.optionName && <div className="text-sm text-gray-500">{item.optionName}</div>}
                  <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                </div>
                <div className="font-semibold">${((item.basePrice + (item.optionPrice || 0)) * item.quantity).toFixed(2)}</div>
              </div>
            ))}

            <div className="text-right font-bold">Total: ${total.toFixed(2)}</div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-red-500 min-w-28 text-white rounded-full hover:cursor-pointer "
                onClick={handlePayNow}>
                {loading ? 'Processing…' : 'Checkout'}
              </button>
              <button
                className="border-2 border-red-500 text-red-500 hover:cursor-pointer rounded-full px-4 py-2"
                onClick={() => clearCart()}>
                Clear
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
