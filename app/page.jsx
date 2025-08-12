import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Rocket, Sparkles, ShieldCheck, Bot, Megaphone, Workflow, ArrowRight, CheckCircle, Mail, Phone, Globe, Video, Image as ImageIcon, PenTool } from "lucide-react";

// Integrations config (reads from NEXT_PUBLIC_* env vars on Vercel)
const INTEGRATIONS = {
  STRIPE: {
    STARTER: process.env.NEXT_PUBLIC_STRIPE_STARTER || "", // Stripe Checkout URL for Starter $25/mo
    PRO: process.env.NEXT_PUBLIC_STRIPE_PRO || "",         // Stripe Checkout URL for Pro $50/mo
    VIP: process.env.NEXT_PUBLIC_STRIPE_VIP || "",         // Stripe Checkout URL for VIP $100/mo
  },
  CALENDLY_URL: process.env.NEXT_PUBLIC_CALENDLY_URL || "", // e.g., https://calendly.com/yourname/intro
  ZAPIER_WEBHOOK_URL: process.env.NEXT_PUBLIC_ZAPIER_WEBHOOK_URL || "", // optional webhook to receive form data
  GA4_ID: process.env.NEXT_PUBLIC_GA4_ID || "", // e.g., G-XXXXXXXX
  TIDIO_KEY: process.env.NEXT_PUBLIC_TIDIO_KEY || "", // optional Tidio public key
};

// Simple utility
const Section = ({ id, children, className = "" }) => (
  <section id={id} className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</section>
);

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="p-6 rounded-2xl bg-white/70 backdrop-blur shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-xl bg-slate-900 text-white"><Icon size={20} /></div>
      <h3 className="font-semibold text-slate-900 text-lg">{title}</h3>
    </div>
    <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
  </div>
);

const Check = ({ children }) => (
  <li className="flex items-start gap-2 text-slate-700"><CheckCircle className="mt-0.5" size={18} /> <span>{children}</span></li>
);

const PricingCard = ({ name, price, tagline, features = [], cta = "Get started", highlight = false }) => (
  <div className={`flex flex-col rounded-2xl border ${highlight ? "border-slate-900 shadow-xl" : "border-slate-200 shadow-md"} bg-white/80 backdrop-blur p-6`}>
    <div className="mb-3">
      <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">{name} {highlight && (<span className="text-xs px-2 py-1 rounded-full bg-slate-900 text-white">Best value</span>)}</h3>
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
      {cta} <ArrowRight size={18} />
    </a>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="rounded-2xl bg-white/70 border border-slate-200 p-4 text-center">
    <div className="text-2xl font-bold text-slate-900">{value}</div>
    <div className="text-slate-600 text-sm">{label}</div>
  </div>
);

export default function OSIHome() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    niche: "",
    plan: "Pro ($50/mo)",
    goals: "",
    loading: false,
    submitted: false,
  });
  const [wizard, setWizard] = useState(null);
  const [queue, setQueue] = useState([]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Load optional analytics & chat integrations
  useEffect(() => {
    if (INTEGRATIONS.GA4_ID && typeof window !== 'undefined') {
      const s1 = document.createElement('script');
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${INTEGRATIONS.GA4_ID}`;
      document.head.appendChild(s1);
      const s2 = document.createElement('script');
      s2.innerHTML = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${INTEGRATIONS.GA4_ID}');`;
      document.head.appendChild(s2);
    }
    if (INTEGRATIONS.TIDIO_KEY && typeof window !== 'undefined') {
      const s = document.createElement('script');
      s.src = `https://code.tidio.co/${INTEGRATIONS.TIDIO_KEY}.js`;
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setForm((f) => ({ ...f, loading: true }));
    try {
      if (INTEGRATIONS.ZAPIER_WEBHOOK_URL) {
        await fetch(INTEGRATIONS.ZAPIER_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, timestamp: new Date().toISOString() }),
        });
      }
      const planKey = form.plan.includes('Starter') ? 'STARTER' : form.plan.includes('Pro') ? 'PRO' : 'VIP';
      const checkoutUrl = INTEGRATIONS.STRIPE[planKey];
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert("Thanks! We'll reach out within 24 hours to finalize payment and onboarding.");
      }
      setForm((f) => ({ ...f, submitted: true }));
    } catch (err) {
      console.error(err);
      alert('Submission failed. Please try again or contact us.');
    } finally {
      setForm((f) => ({ ...f, loading: false }));
    }
  };

  return (
    <div className="min-h-screen text-slate-900 bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-slate-200">
        <Section className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-900 text-white"><Sparkles size={18} /></div>
            <span className="font-semibold">Our Social Image</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-slate-900 text-slate-600">Features</a>
            <a href="#wizard" className="hover:text-slate-900 text-slate-600">AI Wizard</a>
            <a href="#pricing" className="hover:text-slate-900 text-slate-600">Pricing</a>
            <a href="#onboard" className="hover:text-slate-900 text-slate-600">Onboard</a>
            <a href="#scheduler" className="hover:text-slate-900 text-slate-600">Scheduler</a>
            <a href="#analytics" className="hover:text-slate-900 text-slate-600">Analytics</a>
            <a href="#faq" className="hover:text-slate-900 text-slate-600">FAQ</a>
          </nav>
          <a href="#onboard" className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm"><Rocket size={16}/> Start now</a>
        </Section>
      </header>

      {/* Hero */}
      <Section className="py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              The AI‑powered growth hub for small businesses & creators
            </motion.h1>
            <p className="mt-4 text-slate-600 text-lg">Plug‑and‑play content, chatbots, and automated marketing that attract customers while you sleep. Built for local businesses, artists, and community brands.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#pricing" className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl"><Megaphone size={18}/> See pricing</a>
              <a href="#features" className="inline-flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-xl"><Workflow size={18}/> How it works</a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-lg">
              <Stat label="Avg. setup time" value="48 hrs" />
              <Stat label="Content/month" value="15–45 posts" />
              <Stat label="Automation" value="80%+" />
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-tr from-slate-200 to-white rounded-3xl blur-2xl"/>
            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <div className="grid sm:grid-cols-2 gap-4">
                <Feature icon={Bot} title="24/7 AI chatbot" desc="Capture leads, answer FAQs, book appointments automatically."/>
                <Feature icon={Megaphone} title="Auto content engine" desc="Weekly posts, captions, and hashtags created & scheduled."/>
                <Feature icon={Video} title="Short‑form video" desc="Clips for Reels/TikTok auto‑generated from your footage."/>
                <Feature icon={ShieldCheck} title="Done‑for‑you setup" desc="We install, brand, and maintain your automations."/>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section id="features" className="py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Everything you need to grow — done by AI, guided by humans</h2>
        <div className="grid md:grid-cols-3 gap-5">
          <Feature icon={PenTool} title="Captions & blogs" desc="High‑quality copy for offers, launches, and SEO, tailored to your voice."/>
          <Feature icon={ImageIcon} title="Brand graphics" desc="On‑brand carousels, flyers, menus, and stories built from templates."/>
          <Feature icon={Globe} title="Landing & funnels" desc="Lead capture pages + email sequences that nurture and convert."/>
        </div>
      </Section>

      {/* AI Growth Wizard */}
      <Section id="wizard" className="py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">AI Growth Wizard</h2>
        <p className="text-slate-600 mb-6">Discover your niche, audience, hooks, content plan, and best posting times — auto‑generated from a few inputs.</p>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
            <h3 className="font-semibold mb-2">1) Describe your business</h3>
            <div className="space-y-3">
              <input placeholder="Business type (e.g., barber, bakery)" className="w-full rounded-xl border border-slate-300 px-3 py-2" onChange={(e)=>setForm({...form, niche: e.target.value})} value={form.niche} />
              <textarea placeholder="Who do you serve? What makes you different?" className="w-full rounded-xl border border-slate-300 px-3 py-2" rows={3} onChange={(e)=>setForm({...form, goals: e.target.value})} value={form.goals} />
              <button onClick={()=>{
                const niche = (form.niche || 'local business').toLowerCase();
                const suggestion = {
                  position: `Positioning: The go‑to ${niche} for busy locals who value quality + convenience`,
                  audiences: ['Nearby residents','Office workers','Event planners','Families'],
                  hooks: ['Limited‑time bundle','New client discount','Weekend special'],
                  content: ['Before/after showcase','Customer story','How‑to tip','Behind‑the‑scenes'],
                  bestTimes: { Instagram:'11:00–13:00, 19:00–21:00', TikTok:'18:00–22:00', Facebook:'12:00–14:00', LinkedIn:'Tue–Thu 08:00–10:00', YouTubeShorts:'17:00–20:00' }
                };
                setWizard(suggestion);
              }} className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl">Generate draft</button>
            </div>
          </div>

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
              <h4 className="font-semibold mb-2">Suggested niche & positioning</h4>
              <div className="text-sm text-slate-700 min-h-[84px]">{wizard?.position || 'Run Generate to see your positioning statement'}</div>
              <h4 className="font-semibold mt-4 mb-2">Top audiences</h4>
              <ul className="text-sm list-disc pl-5 text-slate-700 space-y-1">
                {(wizard?.audiences || []).map((a,i)=>(<li key={i}>{a}</li>))}
              </ul>
              <h4 className="font-semibold mt-4 mb-2">Hooks that convert</h4>
              <div className="flex flex-wrap gap-2">
                {(wizard?.hooks || []).map((h,i)=>(<span key={i} className="px-2 py-1 bg-slate-100 rounded-xl text-sm">{h}</span>))}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
              <h4 className="font-semibold mb-2">30‑day content plan</h4>
              <ul className="text-sm list-disc pl-5 text-slate-700 space-y-1">
                {(wizard?.content || []).map((c,i)=>(<li key={i}>{c}</li>))}
              </ul>
              <h4 className="font-semibold mt-4 mb-2">Best times to post (starter heuristic)</h4>
              <ul className="text-sm list-disc pl-5 text-slate-700 space-y-1">
                {wizard ? Object.entries(wizard.bestTimes).map(([k,v])=>(<li key={k}><strong>{k}:</strong> {v}</li>)) : <li>Run Generate to see platform‑specific times.</li>}
              </ul>
              <p className="text-xs text-slate-500 mt-3">Times will auto‑optimize after accounts connect and data flows in.</p>
            </div>
          </div>
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
            features={["8 social posts/mo", "Caption + hashtag sets", "1 brand style kit", "Email support"]}
            cta="Try Starter"
          />
          <PricingCard
            name="Pro"
            price={50}
            tagline="Done‑with‑you growth"
            features={["15 social posts/mo", "AI chatbot (FAQs + leads)", "1 landing page + email drip", "Monthly performance report"]}
            cta="Choose Pro"
            highlight
          />
          <PricingCard
            name="VIP"
            price={100}
            tagline="Done‑for‑you automation"
            features={["45 posts + 4 videos/mo", "Chatbot + bookings + CRM", "2 funnels + A/B testing", "Quarterly strategy call"]}
            cta="Go VIP"
          />
        </div>
      </Section>

      {/* Onboarding */}
      <Section id="onboard" className="py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Onboard in minutes</h2>
            <p className="text-slate-600 mb-6">Tell us about your business and pick a plan. We’ll install your chatbot, content calendar, and funnel within 48 hours.</p>
            <ul className="space-y-2">
              <Check>Self‑serve intake → instant workspace</Check>
              <Check>Brand kit import (logo, colors, fonts)</Check>
              <Check>Stripe‑ready checkout (plug your link)</Check>
              <Check>CRM & scheduling integration (Calendly, Google, etc.)</Check>
            </ul>
          </div>

          <form onSubmit={submit} className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200 p-6 shadow-md">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Business / Creator name</label>
                <input required name="name" value={form.name} onChange={handle} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300" />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2"><Mail size={14}/> Email</label>
                <input required type="email" name="email" value={form.email} onChange={handle} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300" />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2"><Phone size={14}/> Phone</label>
                <input name="phone" value={form.phone} onChange={handle} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300" />
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-2"><Globe size={14}/> Website / Social</label>
                <input name="website" value={form.website} onChange={handle} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">What’s your niche?</label>
                <input name="niche" value={form.niche} onChange={handle} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300" placeholder="e.g., restaurant, barber, fitness coach, artist" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Choose a plan</label>
                <select name="plan" value={form.plan} onChange={handle} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300">
                  <option>Starter ($25/mo)</option>
                  <option>Pro ($50/mo)</option>
                  <option>VIP ($100/mo)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">What are your top 3 growth goals?</label>
                <textarea name="goals" value={form.goals} onChange={handle} rows={4} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300" placeholder="e.g., more bookings, increase online orders, grow audience" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button type="submit" disabled={form.loading} className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl disabled:opacity-60"><ShieldCheck size={18}/> {form.loading ? 'Submitting…' : 'Create my workspace'}</button>
              <a href="#pricing" className="text-slate-700 underline underline-offset-4">Compare plans</a>
            </div>
            <p className="text-xs text-slate-500 mt-3">By continuing you agree to our terms and privacy policy.</p>
          </form>
        </div>
      </Section>

      {/* Scheduler */}
      <Section id="scheduler" className="py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Ad Builder & Auto‑Scheduler</h2>
        <p className="text-slate-600 mb-6">Create ads/content, pick platforms, choose exact times or let AI choose. We’ll queue and post at schedule.</p>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
            <h3 className="font-semibold mb-2">Write your post/ad</h3>
            <textarea id="adText" rows={6} className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Describe your offer. AI will structure Hook → Value → CTA." />
            <div className="flex gap-2 mt-2">
              <button onClick={()=>{
                const el = document.getElementById('adText');
                if (el && 'value' in el) {
                  const base = form.niche || 'local business';
                  el.value = `🔥 ${base.toUpperCase()} SPECIAL

Hook: Limited‑time offer for first 25 customers.
Value: Save time & get premium results.
Proof: 500+ happy locals.
CTA: Book today → link in bio / call now.`;
                }
              }} className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm">AI draft</button>
              <button onClick={()=>{
                const el = document.getElementById('adText');
                if (el && 'value' in el) {
                  el.value += `

Hashtags: #${(form.niche||'local').replace(/\s+/g,'')} #SupportLocal #Deals #Community`;
                }
              }} className="px-3 py-2 rounded-xl bg-slate-100 text-slate-900 text-sm border border-slate-200">Add hashtags</button>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium">Upload image/video (optional)</label>
              <input type="file" className="mt-1 w-full text-sm" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
            <h3 className="font-semibold mb-2">Pick platforms & time</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {['Instagram','Facebook','TikTok','YouTubeShorts','LinkedIn','GoogleBusiness','X','Pinterest'].map(p=> (
                <label key={p} className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked={['Instagram','Facebook','GoogleBusiness'].includes(p)} /> {p}
                </label>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input id="useAI" type="checkbox" defaultChecked /> <span className="text-sm">Use AI‑recommended time</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input id="date" type="date" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              <input id="time" type="time" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <button onClick={()=>{
              const txtEl = document.getElementById('adText');
              const useAIEl = document.getElementById('useAI');
              const dateEl = document.getElementById('date');
              const timeEl = document.getElementById('time');
              const txt = (txtEl && 'value' in txtEl) ? txtEl.value : '';
              const useAI = (useAIEl && 'checked' in useAIEl) ? useAIEl.checked : true;
              const date = (dateEl && 'value' in dateEl) ? dateEl.value : '';
              const time = (timeEl && 'value' in timeEl) ? (timeEl.value || '11:30') : '11:30';
              const when = useAI ? 'AI‑optimized' : `${date} ${time}`;
              const item = { id: Date.now(), content: txt || '(no text)', when, status: 'scheduled'};
              setQueue([item, ...queue]);
              alert('Queued! Check the queue panel.');
            }} className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl">Schedule post</button>
            <p className="text-xs text-slate-500 mt-2">Real posting requires connecting accounts in settings; this UI is ready for Buffer API hookup.</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
            <h3 className="font-semibold mb-2">Queue</h3>
            <div className="space-y-3 max-h-80 overflow-auto">
              {queue.length === 0 && <div className="text-sm text-slate-500">No scheduled posts yet.</div>}
              {queue.map((q)=> (
                <div key={q.id} className="p-3 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">{q.when}</div>
                  <div className="text-sm text-slate-800 line-clamp-3">{q.content}</div>
                  <div className="mt-1 text-xs">Status: <span className="font-medium">{q.status}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4">Posting pipeline: this button will call a serverless endpoint that forwards to the Buffer API using your profile IDs. Keys live in environment variables—never in the browser.</p>
      </Section>

      {/* Book a call (Calendly) */}
      {INTEGRATIONS.CALENDLY_URL && (
        <Section id="book" className="py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Prefer to talk first?</h2>
          <p className="text-slate-600 mb-4">Grab a time below. Your plan selection carries over after the call.</p>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm">
            <iframe title="Book a call" src={INTEGRATIONS.CALENDLY_URL} className="w-full h-[760px] rounded-xl" />
          </div>
        </Section>
      )}

      {/* Social proof */}
      <Section className="py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {["We booked out two weekends in 3 weeks.", "Finally posting consistently without the headache.", "The chatbot now handles 70% of FAQs."].map((quote, i)=> (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
              <p className="text-slate-800">“{quote}”</p>
              <div className="mt-3 text-sm text-slate-500">— Local client</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Analytics */}
      <Section id="analytics" className="py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Performance & Audience Analytics</h2>
        <p className="text-slate-600 mb-6">Once accounts are connected, this dashboard shows reach, clicks, spend, and audience breakdown (gender/age/location) across platforms.</p>
        <div className="grid md:grid-cols-4 gap-4">
          {[['Reach','128,400'],['Impressions','304,980'],['Clicks','7,214'],['Spend','$1,942']].map(([k,v])=> (
            <div key={k} className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-center">
              <div className="text-xs text-slate-500">{k}</div>
              <div className="text-2xl font-bold">{v}</div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
            <h3 className="font-semibold mb-2">Gender split</h3>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex-1"><div className="h-3 bg-slate-200 rounded-full overflow-hidden"><div className="h-full w-[56%] bg-slate-900"></div></div><div className="mt-1 text-xs text-slate-500">56% Female</div></div>
              <div className="flex-1"><div className="h-3 bg-slate-200 rounded-full overflow-hidden"><div className="h-full w-[44%] bg-slate-900"></div></div><div className="mt-1 text-xs text-slate-500">44% Male</div></div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
            <h3 className="font-semibold mb-2">Top locations</h3>
            <ul className="text-sm list-disc pl-5 text-slate-700 space-y-1">
              <li>Indianapolis, IN</li>
              <li>Avon, IN</li>
              <li>Carmel, IN</li>
              <li>Fishers, IN</li>
            </ul>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {[['CTR','2.4%'],['CPC','$0.27'],['Conv. rate','3.1%']].map(([k,v])=> (
            <div key={k} className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-center">
              <div className="text-xs text-slate-500">{k}</div>
              <div className="text-2xl font-bold">{v}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4">Demo data shown. Connect Meta, TikTok, YouTube, Google, LinkedIn to populate live metrics. GA4 + UTM tagging will align clicks and conversions.</p>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">FAQ</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
            <h3 className="font-semibold mb-2">How fast is setup?</h3>
            <p className="text-slate-600">Starter setups go live within 24–48 hours once we receive your brand kit. VIP installs may take 3–5 business days.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
            <h3 className="font-semibold mb-2">Do I need to film content?</h3>
            <p className="text-slate-600">We can repurpose what you already have, use stock, or guide you with a simple monthly content checklist.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
            <h3 className="font-semibold mb-2">What platforms are supported?</h3>
            <p className="text-slate-600">Instagram, Facebook, TikTok, YouTube Shorts, and Google Business. Email via Mailchimp/Klaviyo. Booking via Calendly or your POS.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
            <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
            <p className="text-slate-600">Yes, plans are month‑to‑month. No long‑term contracts.</p>
          </div>
        </div>
      </Section>

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
