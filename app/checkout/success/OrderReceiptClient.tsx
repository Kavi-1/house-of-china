"use client"
import React, { useEffect, useState } from 'react'
import { useCart } from '@/app/components/CartContext'

type Order = {
  id?: string | number
  amount_total?: number
  status?: string
  stripe_session_id?: string
  order_items?: { id: string | number; name: string; quantity: number; unit_amount: number }[]
}

export default function OrderReceiptClient({ order }: { order: Order }) {
  const { clearCart } = useCart()
  const [currentOrder, setCurrentOrder] = useState<Order | undefined>(order)
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    const checkStatus = async () => {
      if (!currentOrder?.stripe_session_id) return
      try {
        const res = await fetch(`/api/orders/session?session_id=${encodeURIComponent(currentOrder.stripe_session_id)}`)
        const json = await res.json()
        if (json.order) {
          setCurrentOrder(json.order)
          if (json.order.status === 'paid' && interval) {
            clearInterval(interval)
            interval = null
          }
        }
      } catch {
        // ignore errors in aggressive mode
      }
    }

    interval = setInterval(checkStatus, 2000)
    checkStatus()
    return () => { if (interval) clearInterval(interval) }
  }, [currentOrder?.stripe_session_id])

  useEffect(() => {
    if (currentOrder?.status === 'paid' && !cleared) {
      clearCart()
      setCleared(true)
    }
  }, [currentOrder, clearCart, cleared])

  return (
    <section>
      <div className="mb-4">Order #{currentOrder?.id} — {currentOrder?.status}</div>
      <div className="mb-4">Total: ${Number(currentOrder?.amount_total).toFixed(2)}</div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Items</h3>
        <ul>
          {currentOrder?.order_items?.map((it) => (
            <li key={it.id} className="mb-1">{it.name} x{it.quantity}  ${Number(it.unit_amount).toFixed(2)}</li>
          ))}
        </ul>
      </div>
      {cleared ? <div className="text-green-600">Cart cleared.</div> : <div>Processing...</div>}
    </section>
  )
}
