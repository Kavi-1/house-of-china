import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client — use your service role key (keep this secret)
export const supabaseServer = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)
