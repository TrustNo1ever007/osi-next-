'use client';

import React, { useMemo } from 'react';

export default function Page() {
  // Use env var if set, otherwise fall back to your live link
  const CAL_URL =
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
    'https://calendly.com/admin-oursocialimage/30min';

  const embedUrl = useMemo(() => {
    const host =
      typeof window === 'undefined'
        ? 'osi-next-app.vercel.app' // server-side fallback
        : window.location.hostname;

    const params = new URLSearchParams({
      embed_domain: host,
      embed_type: 'inline',
      primary_color: '0f172a',  // dark slate
      text_color: '0f172a',
      background_color: 'ffffff',
      // nice-to-haves (uncomment if you prefer)
      // hide_event_type_details: '1',
      // hide_gdpr_banner: '1',
    });

    return `${CAL_URL}?${params.toString()}`;
  }, [process.env.NEXT_PUBLIC_CALENDLY_URL]);

  return (
    <main
      className="mx-auto max-w-5xl px-4 py-10"
      style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system' }}
    >
      <h1 className="text-3xl font-semibold tracking-tight">Book a 30‑Minute Call</h1>
      <p className="mt-2 text-slate-600">
        Pick a time that works for you. You’ll get a calendar invite and reminder
        automatically.
      </p>

      <div className="mt-8 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <iframe
          src={embedUrl}
          title="Calendly Scheduling"
          width="100%"
          height="780"
          frameBorder="0"
          style={{ minWidth: 320, display: 'block' }}
        />
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Having trouble loading the calendar?{' '}
        <a
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 underline"
        >
          Open Calendly in a new tab
        </a>
        .
      </p>
    </main>
  );
}
