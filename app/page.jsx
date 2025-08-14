'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Rocket, ShieldCheck, Bot, Megaphone, Workflow, ArrowRight, CheckCircle, Mail, Phone, Globe, Video, Image as ImageIcon, PenTool } from 'lucide-react';

/* ---------- Safe env reader for client ---------- */
const readEnv = (key, fallback = "") => {
  try {
    if (typeof process !== "undefined" && process?.env && key in process.env) return process.env[key] ?? fallback;
  } catch {}
  if (typeof globalThis !== "undefined" && globalThis.__ENV__ && key in globalThis.__ENV__) return globalThis.__ENV__[key] ?? fallback;
  return fallback;
};

/* ---------- Public integrations ---------- */
const INTEGRATIONS = {
  STRIPE: {
    STARTER: readEnv("NEXT_PUBLIC_STRIPE_STARTER", ""),
    PRO:     readEnv("NEXT_PUBLIC_STRIPE_PRO", ""),
    VIP:     readEnv("NEXT_PUBLIC_STRIPE_VIP", ""),
  },
  CALENDLY_URL: readEnv("NEXT_PUBLIC_CALENDLY_URL", ""), // e.g. https://calendly.com/admin-oursocialimage/30min
  GA4_ID:       readEnv("NEXT_PUBLIC_GA4_ID", ""),
  TIDIO_KEY:    readEnv("NEXT_PUBLIC_TIDIO_KEY", ""),
  ZAPIER_WEBHOOK_URL: readEnv("NEXT_PUBLIC_ZAPIER_WEBHOOK_URL", ""),
};

/* ---------- UI helpers ---------- */
const Section = ({ id, className="", children }) => (
  <section id={id} className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</section>
);

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="p-6 rounded-2xl bg-white/70 backdrop-blur shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-xl bg-slate-900 text-white"><Icon size={20}/></div>
      <h3 className="font-semibold text-slate-900 text-lg">{title}</h3>
    </div>
    <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
  </div>
);

const Check = ({ children }) => (
  <li className="flex items-start gap-2 text-slate-700"><CheckCircle className="mt-0.5" size={18}/><span>{children}</span></li>
);

const PricingCard = ({ name, price, tagline, features = [], cta = "Get started", highlight = false }) => (
  <div className={`flex flex-col rounded-2xl border ${highlight ? "border-slate-900 shadow-xl" : "border-slate-200 shadow-md"} bg-white/80 backdrop-blur p-6`}>
    <div className="mb-3">
      <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
        {name} {highlight && <span className="text-xs px-2 py-1 rounded-full bg-slate-900 text-white">Best value</span>}
      </h3>
      <p className="text-slate-600 text-sm">{tagline}</p>
    </div>
    <div className="flex items-baseline gap-1 mb-4">
      <span className="text-3xl font-bold text-slate-900">${price}</span>
      <span className="text-slate-500">/mo</span>
    </div>
    <ul className="space-y-2 mb-6">
      {features.map((f,i)=> <Check key={i}>{f}</Check>)}
    </ul>
    <a href="#onboard" className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium ${highlight ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"}`}>
      {cta} <ArrowRight size={18}/>
    </a>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="rounded-2xl bg-white/70 border border-slate-200 p-4 text-center">
    <div className="text-2xl font-bold text-slate-900">{value}</div>
    <div className="text-slate-600 text-sm">{label}</div>
  </div>
);

/* ===================== PAGE ===================== */
export default function OSIHome() {
  /* ---- basic form ---- */
  const [form, setForm] = useState({
    name: "", email: "", phone: "", website: "", niche: "",
    plan: "Pro ($50/mo)", goals: "", loading: false
  });
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ---- optional analytics / chat ---- */
  useEffect(() => {
    if (INTEGRATIONS.GA4_ID) {
      const s1 = document.createElement('script');
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${INTEGRATIONS.GA4_ID}`;
      document.head.appendChild(s1);
      const s2 = document.createElement('script');
      s2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date()); gtag('config', '${INTEGRATIONS.GA4_ID}');
      `;
      document.head.appendChild(s2);
    }
    if (INTEGRATIONS.TIDIO_KEY) {
      const s = document.createElement('script');
      s.src = `https://code.tidio.co/${INTEGRATIONS.TIDIO_KEY}.js`;
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  /* ---- Calendly inline embed (script loader) ---- */
  useEffect(() => {
    if (!INTEGRATIONS.CALENDLY_URL) return;
    // only inject once
    if (document.querySelector('script[data-calendly]')) return;
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.setAttribute('data-calendly','1');
    document.body.appendChild(script);
  }, []);

  /* ---- submit -> optional webhook, then Stripe ---- */
  const submit = async (e) => {
    e.preventDefault();
    setForm((f)=>({...f, loading:true}));
    try {
      if (INTEGRATIONS.ZAPIER_WEBHOOK_URL) {
        await fetch(INTEGRATIONS.ZAPIER_WEBHOOK_URL, {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ ...form, timestamp: new Date().toISOString() })
        });
      }
      const planKey = form.plan.includes('Starter') ? 'STARTER' : form.plan.includes('Pro') ? 'PRO' : 'VIP';
      const checkoutUrl = INTEGRATIONS.STRIPE[planKey];
      if (checkoutUrl) window.location.href = checkoutUrl;
      else alert("Thanks! We'll reach out within 24 hours to finalize payment and onboarding.");
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    } finally {
      setForm((f)=>({...f, loading:false}));
    }
  };

  return (
    <div className="min-h-screen text-slate-900 bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-slate-200">
        <Section className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-900 text-white"><Sparkles size={18}/></div>
            <span className="font-semibold">Our Social Image</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-slate-900 text-slate-600">Features</a>
            <a href="#pricing" className="hover:text-slate-900 text-slate-600">Pricing</a>
            <a href="#onboard" className="hover:text-slate-900 text-slate-600">Onboard</a>
            <a href="#book" className="hover:text-slate-900 text-slate-600">Book a call</a>
          </nav>
          <a href="#onboard" className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm"><Rocket size={16}/> Start now</a>
        </Section>
      </header>

      {/* Hero */}
      <Section className="py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              The AI-powered growth hub for small businesses & creators
            </h1>
            <p className="mt-4 text-slate-600 text-lg">
              Plug-and-play content, chatbots, and automated marketing that attract customers while you sleep.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#pricing" className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl"><Megaphone size={18}/> See pricing</a>
              <a href="#features" className="inline-flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-xl"><Workflow size={18}/> How it works</a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg">
              <Stat label="Avg. setup time" value="48 hrs"/>
              <Stat label="Content/month" value="15–45 posts"/>
              <Stat label="Automation" value="80%+"/>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="grid sm:grid-cols-2 gap-4">
              <Feature icon={Bot} title="24/7 AI chatbot" desc="Capture leads, answer FAQs, book appointments automatically."/>
              <Feature icon={Megaphone} title="Auto content engine" desc="Weekly posts, captions & hashtags created and scheduled."/>
              <Feature icon={Video} title="Short-form video" desc="Clips for Reels/TikTok auto-generated from your footage."/>
              <Feature icon={ShieldCheck} title="Done-for-you setup" desc="We install, brand, and maintain your automations."/>
            </div>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section id="features" className="py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Everything you need to grow — done by AI, guided by humans</h2>
        <div className="grid md:grid-cols-3 gap-5">
          <Feature icon={PenTool} title="Captions & blogs" desc="High-quality copy for offers, launches, and SEO, tailored to your voice."/>
          <Feature icon={ImageIcon} title="Brand graphics" desc="On-brand carousels, flyers, menus, stories from templates."/>
          <Feature icon={Globe} title="Landing & funnels" desc="Lead capture pages + email sequences that nurture and convert."/>
        </div>
      </Section>

      {/* Pricing */}
      <Section id="pricing" className="py-12">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Simple, transparent pricing</h2>
          <p className="text-slate-600">Scale up as you grow. Cancel anytime.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <PricingCard
            name="Starter"
            price={25}
            tagline="DIY with AI templates"
            features={["8 social posts/mo","Caption + hashtag sets","1 brand style kit","Email support"]}
            cta="Try Starter"
          />
          <PricingCard
            name="Pro"
            price={50}
            tagline="Done-with-you growth"
            features={["15 social posts/mo","AI chatbot (FAQs + leads)","1 landing page + email drip","Monthly performance report"]}
            cta="Choose Pro"
            highlight
          />
          <PricingCard
            name="VIP"
            price={100}
            tagline="Done-for-you automation"
            features={["45 posts + 4 videos/mo","Chatbot + bookings + CRM","2 funnels + A/B testing","Quarterly strategy call"]}
            cta="Go VIP"
          />
        </div>
      </Section>

      {/* Onboarding form */}
      <Section id="onboard" className="py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Onboard in minutes</h2>
            <p className="text-slate-600 mb-6">Tell us about your business and pick a plan. We’ll install your chatbot, content calendar, and funnel within 48 hours.</p>
            <ul className="space-y-2">
              <Check>Self-serve intake → instant workspace</Check>
              <Check>Brand kit import (logo, colors, fonts)</Check>
              <Check>Stripe-ready checkout (plug your link)</Check>
              <Check>CRM & scheduling integration (Calendly, Google, etc.)</Check>
            </ul>
          </div>

          <form onSubmit={submit} className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200 p-6 shadow-md">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Business / Creator name</label>
                <input required name="name" value={form.name} onChange={handle} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"/>
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2"><Mail size={14}/> Email</label>
                <input required type="email" name="email" value={form.email} onChange={handle} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"/>
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2"><Phone size={14}/> Phone</label>
                <input name="phone" value={form.phone} onChange={handle} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"/>
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2"><Globe size={14}/> Website / Social</label>
                <input name="website" value={form.website} onChange={handle} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"/>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Choose a plan</label>
                <select name="plan" value={form.plan} onChange={handle} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2">
                  <option>Starter ($25/mo)</option>
                  <option>Pro ($50/mo)</option>
                  <option>VIP ($100/mo)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">What are your top 3 growth goals?</label>
                <textarea name="goals" value={form.goals} onChange={handle} rows={4} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="e.g., more bookings, increase online orders, grow audience"/>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button type="submit" disabled={form.loading} className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl disabled:opacity-60">
                <ShieldCheck size={18}/> {form.loading ? 'Submitting…' : 'Create my workspace'}
              </button>
              <a href="#pricing" className="text-slate-700 underline underline-offset-4">Compare plans</a>
            </div>
          </form>
        </div>
      </Section>

      {/* Calendly — inline, instant booking */}
      {INTEGRATIONS.CALENDLY_URL && (
        <Section id="book" className="py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Prefer to talk first?</h2>
          <p className="text-slate-600 mb-4">Grab a time below. Your plan selection carries over after the call.</p>
          <div
            className="rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm"
            // Calendly looks for this exact class + data-url
          >
            <div
              className="calendly-inline-widget"
              data-url={INTEGRATIONS.CALENDLY_URL}
              style={{ minWidth: '320px', height: '760px' }}
            />
          </div>
        </Section>
      )}

      {/* Footer */}
      <footer className="py-10 border-t border-slate-200">
        <Section className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">© {new Date().getFullYear()} Our Social Image. All rights reserved.</div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <a href="#" className="hover:text-slate-900">Terms</a>
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#onboard" className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm"><Sparkles size={16}/> Join now</a>
          </div>
        </Section>
      </footer>
    </div>
  );
}
