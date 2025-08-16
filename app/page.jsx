
'use client';
import React, { useEffect, useMemo } from 'react';

export default function Page() {
  // Your Calendly event link (hard-coded so it works immediately)
  const CAL_URL = 'https://calendly.com/admin-oursocialimage/30min';

  // Build the Calendly data-url with the right domain + options
  const embedUrl = useMemo(() => {
    const host = typeof window === 'undefined' ? 'localhost' : window.location.hostname;

    const params = new URLSearchParams({
      embed_domain: host,
      embed_type: 'inline',
      primary_color: '0f172a',
      text_color: '0f172a',
      background_color: 'ffffff',
      hide_gdpr_banner: '1',
    });

    return `${CAL_URL}?${params.toString()}`;
  }, []);

  // Load Calendly’s script once so the inline widget renders
  useEffect(() => {
    const id = 'calendly-widget-js';
    if (!document.getElementById(id)) {
      const s = document.createElement('script');
      s.id = id;
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-3">Book a 30-minute call</h1>
      <p className="text-slate-600 mb-6">
        Pick a time that works for you. We’ll confirm instantly.
      </p>

      {/* Calendly inline widget */}
      <div
        className="calendly-inline-widget rounded-xl border border-slate-200"
        data-url={embedUrl}
        style={{ minWidth: '320px', height: '760px' }}
      />
    </main>
  );
}
