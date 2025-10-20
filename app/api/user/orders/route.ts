import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServerClient'

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Missing token' }, { status: 401 })
        }
        const token = authHeader.split(' ')[1]
        const { data: userData, error: userErr } = await supabaseServer.auth.getUser(token)
        if (userErr || !userData?.user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

        const userId = (userData.user as { id: string }).id

        const { data, error } = await supabaseServer
            .from('orders')
            .select('id, amount_total, status, created_at, order_items(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ orders: data })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'unknown'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
