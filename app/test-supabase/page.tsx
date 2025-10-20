import { supabase } from '@/lib/supabaseClient'

export default async function TestSupabase() {
    const { data, error } = await supabase.from('menu_items').select('*')

    return (
        <div>
            <h1>Supabase Test</h1>
            <pre>{JSON.stringify({ data, error }, null, 2)}</pre>
        </div>
    )
}
