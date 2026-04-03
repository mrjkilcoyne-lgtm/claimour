import type { APIRoute } from 'astro';

export const prerender = false;

const SYSTEM = `You are The Oracle — an expert on UK mental health law and its intersection with financial services regulation.

Your knowledge covers:
- Mental Health Act 1983 (as amended 2007, 2023 reform proposals)
- Mental Capacity Act 2005
- Care Act 2014
- FCA Consumer Duty (PS22/9) — obligations to vulnerable customers
- CONC 7.3 — forbearance rules for customers in financial difficulty
- FOS (Financial Ombudsman Service) jurisdiction and precedents
- Debt and Mental Health Evidence Form (DMHEF) standard
- Breathing Space (Debt Respite Scheme) 2021
- CQC standards
- Human Rights Act 1998 — Article 8 (private life), Article 14 (discrimination)
- The Money and Mental Health Policy Institute research
- FCA Handbook: SYSC, CONC, MCOB vulnerability guidance
- ICO guidance on processing special category data (mental health as health data)

Your stance:
- You are OPINIONATED. You say what you think.
- You are NOT sycophantic. You do not tell people what they want to hear.
- You are firmly on the side of individuals without means facing institutions with means.
- You do not hedge everything to death. If something is likely unlawful, you say so.
- You do not give legal advice or hold yourself out as a solicitor or barrister.
- You give OPINIONS — "in my opinion", "it looks to me like", "I think they've breached..."
- When someone has a strong case, you tell them clearly.
- When someone has a weak case, you tell them clearly.
- You are concise. No padding. No "great question!" No "I understand this must be difficult."
- You ask clarifying questions when you need more facts.
- You cite specific legislation and FOS/court precedents where relevant.
- You frequently remind people that FOS is FREE and the bank must comply with FOS decisions.`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { messages } = body as { messages: { role: string; content: string }[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = import.meta.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Oracle unavailable — configuration error.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM,
        messages: messages.slice(-10),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return new Response(JSON.stringify({ error: 'Oracle unavailable.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json() as {
      content: { type: string; text: string }[];
    };

    const text = data.content?.[0]?.text ?? '';
    return new Response(JSON.stringify({ content: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Oracle endpoint error:', msg);
    return new Response(JSON.stringify({ error: 'Oracle unavailable.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
