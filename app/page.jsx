'use client';

import { useMemo } from 'react';
import Script from 'next/script';

// Pull from Vercel env; fallback to your 30‑min link if the env var isn't set
const BASE = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/admin-oursocialimage/30min';

export default function Page() {
  // Build the Calendly URL with nice theme params and (when available) the host
  const calendlyUrl = useMemo(() => {
    const host =
      typeof window !== 'undefined'
        ? window.location.hostname
        : 'osi-next-app.vercel.app'; // harmless SSR fallback

    const params = new URLSearchParams({
      // Styling (hex without #)
      primary_color: '0f172a',    // slate-900
      text_color: '0f172a',
      background_color: 'ffffff',

      // UX
      hide_event_type_details: '1',
      embed_domain: host,        // fine for inline; required for popups
      embed_type: 'Inline',
    });

    // Ensure BASE has no trailing ? before appending
    const sep = BASE.includes('?') ? '&' : '?';
    return `${BASE}${sep}${params.toString()}`;
  }, []);

  return (
    <>
      {/* Calendly assets */}
      <link rel="preconnect" href="https://assets.calendly.com" />
      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />

      {/* Page layout */}
      <main className="w-full flex justify-center px-4 py-10">
        <section className="w-full max-w-5xl">
          <h1 className="text-3xl font-semibold tracking-tight mb-6">
            Book a 30‑Minute Call
          </h1>

          {/* Inline Calendly embed */}
          <div
            className="calendly-inline-widget"
            data-url={calendlyUrl}
            style={{ minWidth: '320px', height: '900px', width: '100%' }}
          />

          {/* Fallback link (in case scripts are blocked) */}
          <p className="mt-4 text-sm">
            If the scheduler doesn’t load,{' '}
            <a
              href={BASE}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              open Calendly in a new tab
            </a>
            .
          </p>
        </section>
      </main>
    </>
  );
}
