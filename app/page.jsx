"use client";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const Section = ({ id, children, className = "" }) => (
  <section id={id} className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</section>
);

export default function Page(){
  const [form, setForm] = useState({ niche: "", goals: "" });
  const [wizard, setWizard] = useState(null);
  const [queue, setQueue] = useState([]);
  return (
    <div className="min-h-screen">
      <header className="border-b"><Section className="py-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><div className="p-2 rounded bg-black text-white"><Sparkles size={16}/></div><span>Our Social Image</span></div>
        <nav className="hidden md:flex gap-4 text-sm">
          <a href="#wizard">AI Wizard</a><a href="#scheduler">Scheduler</a>
        </nav>
      </Section></header>

      <Section id="wizard" className="py-10">
        <h2 className="text-2xl font-bold mb-2">AI Growth Wizard</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <input placeholder="Your business (e.g., barber)" className="border px-3 py-2 rounded w-full"
              onChange={(e)=>setForm({...form, niche: e.target.value})}/>
            <textarea placeholder="Goals" className="mt-2 border px-3 py-2 rounded w-full" rows={3}
              onChange={(e)=>setForm({...form, goals: e.target.value})}></textarea>
            <button className="mt-3 px-4 py-2 rounded bg-black text-white" onClick={()=>{
              const niche=(form.niche||"local business").toLowerCase();
              setWizard({position:`Go-to ${niche} for locals`, bestTimes:{Instagram:"11–1, 7–9", TikTok:"6–10pm"}});
            }}>Generate draft</button>
          </div>
          <div className="border rounded p-4 bg-white">
            <div className="font-semibold">Positioning</div>
            <div className="text-sm">{wizard?.position||"Run Generate"}</div>
            <div className="font-semibold mt-3">Best times</div>
            <ul className="text-sm list-disc pl-5">{wizard?Object.entries(wizard.bestTimes).map(([k,v])=>(<li key={k}><b>{k}</b>: {v}</li>)):<li>—</li>}</ul>
          </div>
        </div>
      </Section>

      <Section id="scheduler" className="py-10">
        <h2 className="text-2xl font-bold mb-2">Scheduler</h2>
        <textarea id="adText" rows={5} className="border w-full rounded px-3 py-2" placeholder="Write your post"></textarea>
        <button className="mt-3 px-4 py-2 rounded bg-black text-white" onClick={()=>{
          const el=document.getElementById('adText'); const item={id:Date.now(), content: el?.value||'(no text)', when:'AI-optimized', status:'scheduled'};
          setQueue([item, ...queue]);
        }}>Schedule post</button>
        <div className="mt-4">{queue.map(q=>(<div key={q.id} className="border rounded p-3 mb-2"><div className="text-xs">{q.when}</div><div className="text-sm">{q.content}</div></div>))}</div>
      </Section>
    </div>
  );
}
