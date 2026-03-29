export const prerender = false;

export async function POST({ request }: { request: Request }) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const eventType = formData.get('event_type') as string;
    const eventDate = formData.get('event_date') as string;
    const message = formData.get('message') as string;

    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Jméno a e-mail jsou povinné.' }), { status: 400 });
    }

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '23cd79bf-496a-4dd3-9e62-10dae4c79dbb',
        subject: `Poptávka: ${name} — ${eventType || 'Obecná'}`,
        from_name: name,
        replyto: email,
        name,
        email,
        phone: phone || '—',
        typ_akce: eventType || '—',
        termin: eventDate || '—',
        zprava: message || '—',
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Web3Forms error:', err);
      return new Response(JSON.stringify({ error: 'Chyba při odesílání.' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('API error:', err);
    return new Response(JSON.stringify({ error: 'Interní chyba serveru.' }), { status: 500 });
  }
}
