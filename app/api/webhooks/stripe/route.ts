import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseServer } from '@/lib/supabaseServerClient'

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-09-30.clover' })

  const signature = req.headers.get('stripe-signature')
  const buf = await req.arrayBuffer()
  // Buffer should be available in Node; cast via globalThis if needed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (globalThis as any).Buffer.from(buf)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(raw, signature || '', process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown'
    console.error('Webhook signature verification failed.', message)
    return new Response(`Webhook Error: ${message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.order_id

    try {
      // mark paid
      if (orderId) {
        await supabaseServer.from('orders').update({ status: 'paid', stripe_session_id: session.id }).eq('id', orderId)
      }
    } catch (err) {
      console.error('Webhook processing error', err)
    }
  }

  return NextResponse.json({ received: true })
}
