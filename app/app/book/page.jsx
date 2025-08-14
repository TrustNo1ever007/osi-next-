'use client';

import React, { useMemo } from 'react';
import Script from 'next/script';

const BASE = 'https://calendly.com/admin-oursocialimage/30min';

export default function Page() {
  const embedUrl = useMemo(() => {
    const host = typeof window !== 'undefined'
      ? window.location.hostname
      : 'osi-next-app.vercel.app'; // fallback for server build/testing
    const params = new URLSearchParams({
      embed_domain: host,
      embed_type: 'Inline',
      primary_color: '0f172a',
      text_color: '0f172a',
      background_color: 'ffffff'
    });
    return `${BASE}?${params.toString()}`;
  }, []);

  return (
    <main style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ minWidth: '320px', width: '100%', height: '760px' }}>
        <div
          className="calendly-inline-widget"
          data-url={embedUrl}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
    </main>
  );
}
