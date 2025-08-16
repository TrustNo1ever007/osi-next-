// app/book/page.jsx
"use client";

import { useMemo } from "react";

const FALLBACK_URL = "https://calendly.com/admin-oursocialimage/30min";

export default function BookPage() {
  // Read from env if present, otherwise fallback
  const calendlyUrl =
    (typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_CALENDLY_URL) ||
    FALLBACK_URL;

  // Create Calendly embed URL with style params
  const src = useMemo(() => {
    const url = new URL(calendlyUrl);
    // Optional theming
    url.searchParams.set("embed_type", "Inline");
    url.searchParams.set("primary_color", "0f172a");  // slate-900
    url.searchParams.set("text_color", "0f172a");
    url.searchParams.set("background_color", "ffffff");
    return url.toString();
  }, [calendlyUrl]);

  return (
    <section style={{ maxWidth: 1100, margin: "24px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: 32, marginBottom: 10 }}>Book a 30-Minute Call</h1>
      <p style={{ color: "#555", marginBottom: 20 }}>
        Pick a time that works for you. You’ll get a calendar invite automatically.
      </p>

      <div style={{
        border: "1px solid #eee",
        borderRadius: 12,
        overflow: "hidden",
        minHeight: 740
      }}>
        {/* Calendly inline embed */}
        <iframe
          title="Calendly Booking"
          src={src}
          style={{
            width: "100%",
            height: "100%",
            minHeight: 740,
            border: "0",
          }}
        />
      </div>
    </section>
  );
}
