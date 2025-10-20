"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type OrderItem = {
    id: string | number
    name: string
    quantity: number
    unit_amount: number | string
}

type Order = {
    id: string | number
    amount_total: number | string
    status?: string
    created_at?: string
    order_items?: OrderItem[]
}

export default function OrdersHistoryClient() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        let mounted = true
        const load = async () => {
            setLoading(true)
            try {
                const { data: { session } } = await supabase.auth.getSession()
                const token = session?.access_token
                if (!token) {
                    if (mounted) setOrders([])
                    return
                }
                const res = await fetch('/api/user/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const json = await res.json()
                if (json?.orders && mounted) setOrders(json.orders as Order[])
            } catch (e) {
                console.error('Error loading orders', e)
            } finally {
                if (mounted) setLoading(false)
            }
        }
        load()
        return () => { mounted = false }
    }, [])

    if (loading) return <div>Loading orders…</div>
    if (!orders || orders.length === 0) return <div>No past orders found.</div>

    return (
        <div className="space-y-4">
            {orders.map(o => (
                <div key={o.id} className="p-3 border rounded-lg">
                    <div className="font-semibold">Order #{o.id} — ${Number(o.amount_total).toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Status: {o.status} — {o.created_at ? new Date(o.created_at).toLocaleString() : '—'}</div>
                    {o.order_items && o.order_items.length > 0 && (
                        <ul className="mt-2 text-sm">
                            {o.order_items.map((it) => (
                                <li key={it.id}>{it.quantity} x {it.name}  ${Number(it.unit_amount).toFixed(2)}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    )
}
