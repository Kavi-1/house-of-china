"use client";

import React, { useEffect, useState } from 'react'
import { useCart } from './CartContext'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useRouter } from 'next/navigation'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CartDrawer() {
  const { cart, isOpen, openCart, closeCart, removeFromCart, updateQuantity, clearCart } = useCart()

  const router = useRouter()

  const total = cart.reduce((s, it) => s + (it.basePrice + (it.optionPrice || 0)) * it.quantity, 0)

  // close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, closeCart])

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      {/* cart button on bottom right */}
      <button
        onClick={() => (isOpen ? closeCart() : openCart())}
        aria-label="Open cart"
        className="hover:cursor-pointer fixed right-6 bottom-6 z-40 rounded-full bg-red-600 text-white p-3 shadow-lg hover:bg-red-700"
      >
        <ShoppingCartIcon />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => closeCart()}
          aria-hidden
        />
      )}

      <div
        className={`font-poppins fixed top-0 right-0 h-full w-full md:w-96 transform bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal={isOpen}
      >
        <div className="flex h-full flex-col">
          <div className="p-4 pt-2 pb-0 pl-1 hover:cursor-pointer flex items-center justify-between">
            <IconButton onClick={closeCart}>
              <CloseIcon fontSize='medium' />
            </IconButton>
          </div>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your cart</h3>
            <div className="flex items-center space-x-2">
              <button className="hover:cursor-pointer hover:bg-gray-50 w-14 h-6 rounded-full font-poppins text-sm text-gray-500" onClick={clearCart}>Clear</button>
            </div>
          </div>

          {(!mounted || cart.length === 0) ? (
            <div className="text-gray-500 flex justify-center items-center h-60">Your cart is empty</div>
          ) : (
            <>
              <div className="p-4 overflow-auto flex-1">
                {cart.map((it, idx) => (
                  <div key={idx} className="flex items-start space-x-3 py-3 border-b">
                    <div className="flex-1">
                      <div className="font-medium">{it.name}</div>
                      {it.optionName && (
                        <div className="text-sm text-gray-500">+ {it.optionName}</div>
                      )}
                      <div className="text-sm text-gray-600">${((it.basePrice + (it.optionPrice || 0)) * it.quantity).toFixed(2)}</div>
                      <div className="mt-2 flex items-center space-x-2">
                        <button className="px-2 py-1 bg-gray-100 rounded hover:cursor-pointer" onClick={() => updateQuantity(idx, Math.max(1, it.quantity - 1))}>-</button>
                        <div className="px-3">{it.quantity}</div>
                        <button className="px-2 py-1 bg-gray-100 rounded hover:cursor-pointer" onClick={() => updateQuantity(idx, it.quantity + 1)}>+</button>
                        <IconButton className="ml-2 text-sm text-red-600" onClick={() => removeFromCart(idx)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                ))
                }
              </div>

              <div className="p-4 pb-8 border-gray-200 border-t">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-gray-600">Total</div>
                  <div className="font-semibold">${total.toFixed(2)}</div>
                </div>
                <button
                  className="w-full bg-red-500 text-white py-2 hover:cursor-pointer rounded-full"
                  onClick={() => {
                    closeCart()
                    router.push('/checkout')
                  }}
                >
                  Continue
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
