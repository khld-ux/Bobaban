import {createClient} from 'https://esm.sh/@supabase/supabase-js';

const SUPABASE_URL='https://utppamecgkviepzoumoq.supabase.co';
const SUPABASE_ANON_KEY='REPLACE_WITH_YOUR_KEY';

export const supabase=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
