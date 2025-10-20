// "use client";
// import React from 'react';
// import { useRouter } from 'next/navigation';
// import { useCart } from '@/app/components/CartContext';
// import Button from '@mui/material/Button';

// export default function CartPage() {
//   const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
//   const router = useRouter();

//   const total = cart.reduce((s, it) => s + it.total, 0);

//   return (
//     <main className="max-w-4xl mx-auto p-8">
//       <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
//       {cart.length === 0 ? (
//         <div>Your cart is empty.</div>
//       ) : (
//         <div className="space-y-4">
//           {cart.map((item, i) => (
//             <div key={i} className="flex justify-between items-center border p-4 rounded">
//               <div>
//                 <div className="font-semibold">{item.name}</div>
//                 {item.optionName && <div className="text-sm text-gray-500">{item.optionName}</div>}
//               </div>
//               <div className="flex items-center gap-4">
//                 <input type="number" min={1} value={item.quantity} onChange={(e) => updateQuantity(i, Number(e.target.value))} className="w-16 p-1 border rounded" />
//                 <div className="font-semibold">${item.total.toFixed(2)}</div>
//                 <Button variant="outlined" color="error" onClick={() => removeFromCart(i)}>Remove</Button>
//               </div>
//             </div>
//           ))}

//           <div className="text-right font-bold">Total: ${total.toFixed(2)}</div>
//           <div className="flex justify-end gap-2">
//             <Button variant="contained" color="primary" onClick={() => router.push('/checkout')}>Proceed to Checkout</Button>
//             <Button variant="outlined" color="inherit" onClick={() => clearCart()}>Clear</Button>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }
