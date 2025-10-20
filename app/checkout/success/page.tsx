import React from 'react'
import { supabaseServer } from '@/lib/supabaseServerClient'
import OrderReceiptClient from './OrderReceiptClient'
import Nav from '@/app/components/Nav'

type Props = { searchParams?: { session_id?: string } }

export default async function SuccessPage({ searchParams }: Props) {
  const sessionId = await searchParams?.session_id

  if (!sessionId) {
    return <div className="max-w-3xl mx-auto p-8">No session id provided.</div>
  }

  // server-side fetch the order and its items
  const { data: orderData } = await supabaseServer
    .from('orders')
    .select('id, amount_total, status, stripe_session_id, order_items(*)')
    .eq('stripe_session_id', sessionId)
    .maybeSingle()

  if (!orderData) {
    return <div className="max-w-3xl mx-auto p-8">Order not found.</div>
  }

  return (
    <>
      <Nav />
      <main className="font-poppins max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Thank you — Order receipt</h1>
        <OrderReceiptClient order={orderData} />
      </main>
    </>
  )
}
