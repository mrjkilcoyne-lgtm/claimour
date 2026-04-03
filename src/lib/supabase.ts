import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_KEY;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export type Subscriber = {
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at?: string;
  ip_address?: string;
  consent_scope?: string;
  download_count?: number;
};
