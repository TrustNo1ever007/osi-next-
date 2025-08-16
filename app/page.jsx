// app/page.jsx
export default function Home() {
  const items = [
    {
      title: "Creator & brand growth",
      desc: "Strategy, content engines, and audience building that compound.",
    },
    {
      title: "Automations that save time",
      desc: "CRM, email, content scheduling, and back-office workflows.",
    },
    {
      title: "Instant storefronts",
      desc: "Shopify integrations, offers, bundles, and upsell flows.",
    },
  ];

  return (
    <div className="py-14">
      {/* Hero */}
      <section className="text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            AI-powered growth for creators, businesses, and brands
          </h1>
          <p className="mt-4 text-slate-600">
            We plan, build, and automate your content + marketing so you can focus on the work only you can do.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <a
              href="/book"
              className="rounded-xl bg-slate-900 text-white px-5 py-3 text-sm hover:bg-slate-800"
            >
              Book a 30‑minute call
            </a>
            <a
              href="#how-it-works"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div key={it.title} className="rounded-2xl border border-slate-200 p-6">
            <h3 className="font-medium">{it.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{it.desc}</p>
          </div>
        ))}
      </section>

      {/* Simple process */}
      <section id="how-it-works" className="mt-16">
        <h2 className="text-xl font-semibold">How it works</h2>
        <ol className="mt-4 space-y-4 text-slate-700">
          <li><span className="font-medium">1) Kickoff call:</span> we clarify goals, audience, offers, and quick wins.</li>
          <li><span className="font-medium">2) Build:</span> we set up content systems, automations, and storefronts.</li>
          <li><span className="font-medium">3) Launch + iterate:</span> dashboard reporting and weekly optimizations.</li>
        </ol>

        <a
          href="/book"
          className="mt-8 inline-block rounded-xl bg-slate-900 text-white px-5 py-3 text-sm hover:bg-slate-800"
        >
          Book your call
        </a>
      </section>
    </div>
  );
}
