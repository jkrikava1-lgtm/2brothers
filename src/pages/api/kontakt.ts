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

    const resendKey = import.meta.env.RESEND_API_KEY;

    const body = [
      `Jméno: ${name}`,
      `E-mail: ${email}`,
      phone ? `Telefon: ${phone}` : null,
      eventType ? `Typ akce: ${eventType}` : null,
      eventDate ? `Termín: ${eventDate}` : null,
      message ? `\nZpráva:\n${message}` : null,
    ].filter(Boolean).join('\n');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'web@2brothers.cz',
        to: '2brothers@2brothers.cz',
        reply_to: email,
        subject: `Poptávka: ${name} — ${eventType || 'Obecná'}`,
        text: body,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return new Response(JSON.stringify({ error: 'Chyba při odesílání.' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('API error:', err);
    return new Response(JSON.stringify({ error: 'Interní chyba serveru.' }), { status: 500 });
  }
}
