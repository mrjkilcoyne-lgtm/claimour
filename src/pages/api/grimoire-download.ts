import type { APIRoute } from 'astro';

export const prerender = false;

// Map slug → public PDF URL (put your actual PDFs in /public/grimoire/ or an S3/R2 bucket)
const VOLUMES: Record<string, { title: string; file: string }> = {
  'index':       { title: 'Master Index',       file: '/grimoire/vol-00-index.pdf' },
  'automaton':   { title: 'The Automaton',       file: '/grimoire/vol-I-automaton.pdf' },
  'shadow-apis': { title: 'Shadow APIs',         file: '/grimoire/vol-II-shadow-apis.pdf' },
  'invisibility':{ title: 'Invisibility Cloak',  file: '/grimoire/vol-III-invisibility.pdf' },
  'alchemy':     { title: 'Alchemy',             file: '/grimoire/vol-IV-alchemy.pdf' },
  'sigint':      { title: 'SIGINT',              file: '/grimoire/vol-V-sigint.pdf' },
  'commerce':    { title: 'Commerce Engine',     file: '/grimoire/vol-VI-commerce.pdf' },
  'human-layer': { title: 'The Human Layer',     file: '/grimoire/vol-VII-human-layer.pdf' },
  'meta-cheats': { title: 'META-CHEATS',         file: '/grimoire/vol-META-cheats.pdf' },
};

export const GET: APIRoute = async ({ request, url }) => {
  const vol = url.searchParams.get('vol');

  if (!vol || !VOLUMES[vol]) {
    return new Response(JSON.stringify({ error: 'Volume not found.' }), { status: 404 });
  }

  const volume = VOLUMES[vol];

  // Redirect to the PDF — works whether stored in /public or on a CDN
  // The browser will handle the download
  return Response.redirect(new URL(volume.file, url.origin).toString(), 302);
};
