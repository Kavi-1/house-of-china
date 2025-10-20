import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServerClient'
import Stripe from 'stripe'

type CartItem = {
    id?: string | number
    name: string
    quantity?: number
    basePrice: number | string
    optionPrice?: number | string
    optionName?: string
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { items } = body

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty or invalid' }, { status: 400 })
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 })
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-09-30.clover' })

        // map cart items to Stripe line items
        const line_items = (items as CartItem[]).map((it) => {
            const quantity = Math.max(1, Number(it.quantity) || 1)
            const unit_amount_cents = Math.max(0, Math.round((Number(it.basePrice) + (Number(it.optionPrice) || 0)) * 100))
            return {
                price_data: {
                    currency: 'usd',
                    product_data: { name: String(it.name) + (it.optionName ? ` (+${it.optionName})` : '') },
                    unit_amount: unit_amount_cents,
                },
                quantity
            }
        })

        // mark pending
        const amountTotalCents = line_items.reduce((s: number, li) => s + (li.price_data.unit_amount * li.quantity), 0)
        const amountTotalDollars = Number((amountTotalCents / 100).toFixed(2))

        // associate order with user if logged in 
        let userId: string | null = null
        try {
            const authHeader = req.headers.get('authorization')
            if (authHeader?.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1]
                const { data: userData } = await supabaseServer.auth.getUser(token)
                const user = userData?.user as { id?: string } | undefined
                userId = user?.id ?? null
            }
        } catch {
            userId = null
        }

        const { data: orderData, error: orderError } = await supabaseServer
            .from('orders')
            .insert({ amount_total: amountTotalDollars, status: 'pending', user_id: userId })
            .select('id')
            .single()

        if (orderError || !orderData) {
            console.error('failed to create order', orderError)
            return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
        }

        const orderId = orderData.id

        // insert order_items
        const itemsToInsert = (items || []).map((it: CartItem) => ({
            order_id: orderId,
            menu_item_id: String(it.id || ''),
            name: it.name,
            unit_amount: Number((Number(it.basePrice) + (Number(it.optionPrice) || 0)).toFixed(2)),
            quantity: Math.max(1, Number(it.quantity) || 1)
        }))

        if (itemsToInsert.length) await supabaseServer.from('order_items').insert(itemsToInsert)

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/checkout/cancel`,
            metadata: {
                cart_size: String(items.length),
                order_id: String(orderId)
            }
        })

        await supabaseServer.from('orders').update({ stripe_session_id: session.id }).eq('id', orderId)

        return NextResponse.json({ url: session.url, id: session.id })
    } catch (err: unknown) {
        console.error('stripe create session error', err)
        const message = err instanceof Error ? err.message : 'unknown'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
