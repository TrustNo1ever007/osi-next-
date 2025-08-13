'use client';
import { useEffect } from 'react';

export default function BookPage() {
  useEffect(() => {
    // Load Calendly's widget script once
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
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Book a call</h1>
      <p className="text-slate-600 mb-4">
        Pick a time that works for you. We’ll confirm instantly.
      </p>

      {/* Calendly inline widget */}
      <div
        className="calendly-inline-widget rounded-xl border border-slate-200"
        data-url="https://calendly.com/oursocialimage/30min?embed_domain=oursocialimage.net&embed_type=Inline&primary_color=0f172a&text_color=0f172a&background_color=ffffff"
        style={{ minWidth: '320px', height: '760px' }}
      />
    </main>
  );
}
