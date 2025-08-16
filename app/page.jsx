// app/book/page.jsx
'use client';
import { useMemo } from 'react';

// If you set NEXT_PUBLIC_CALENDLY_URL in Vercel, we'll use it.
// Otherwise we fall back to the link you sent.
const FALLBACK = 'https://calendly.com/admin-oursocialimage/30min';

export default function BookPage() {
  const url = process.env.NEXT_PUBLIC_CALENDLY_URL || FALLBACK;

  // Add styling/brand + embed_domain for Calendly
  const src = useMemo(() => {
    const host =
      typeof window === 'undefined' ? 'osi-next-app.vercel.app' : window.location.hostname;
    const q = new URLSearchParams({
      embed_domain: host,
      embed_type: 'Inline',
      background_color: 'ffffff',
      primary_color: '0f172a',
      text_color: '0f172a',
      hide_gdpr_banner: '1',
    });
    return `${url}?${q.toString()}`;
  }, [url]);

  return (
    <div className="py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Book a 30‑minute call</h1>
      <p className="mt-2 text-slate-600">
        Pick a time that works for you. We’ll confirm instantly.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 overflow-hidden">
        <iframe
          title="Calendly Scheduling"
          src={src}
          width="100%"
          height="820"
          className="w-full"
          style={{ minHeight: 820 }}
        />
      </div>

      {/* Fallback link for script/iframe blockers */}
      <p className="mt-4 text-sm">
        Having trouble?{' '}
        <a href={url} className="text-slate-900 underline">
          Open Calendly in a new tab
        </a>
        .
      </p>
    </div>
  );
}
