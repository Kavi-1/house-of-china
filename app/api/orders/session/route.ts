import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServerClient'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const sessionId = url.searchParams.get('session_id')
    if (!sessionId) return NextResponse.json({ error: 'missing session_id' }, { status: 400 })

    const { data, error } = await supabaseServer
      .from('orders')
      .select('id, amount_total, status, stripe_session_id, order_items(*)')
      .eq('stripe_session_id', sessionId)
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ order: data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
