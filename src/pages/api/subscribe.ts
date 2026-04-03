import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: { first_name?: string; last_name?: string; email?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { first_name, last_name, email, source } = body;
  if (!email || !first_name || !last_name) {
    return new Response(JSON.stringify({ error: 'Name and email are required.' }), { status: 400 });
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address.' }), { status: 400 });
  }

  const supabaseUrl = import.meta.env.SUPABASE_URL;
  const supabaseKey = import.meta.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Server configuration error.' }), { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase.from('subscribers').upsert(
    {
      email: email.toLowerCase().trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      source: source || 'grimoire',
      subscribed_at: new Date().toISOString(),
    },
    { onConflict: 'email' }
  );

  if (error) {
    console.error('Supabase error:', error);
    return new Response(JSON.stringify({ error: 'Failed to save. Please try again.' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
