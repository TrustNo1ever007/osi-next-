# Our Social Image — Next.js Deploy

This is a ready-to-deploy Next.js project for the OSI site with:
- Tailwind styling
- AI Wizard, Pricing, Onboarding, Scheduler, Analytics sections
- `/api/schedule` serverless route (stub) for Buffer integration

## Run locally
```bash
npm install
npm run dev
```

## Environment variables (Vercel → Project Settings → Environment)
Public (safe for client):
- NEXT_PUBLIC_STRIPE_STARTER
- NEXT_PUBLIC_STRIPE_PRO
- NEXT_PUBLIC_STRIPE_VIP
- NEXT_PUBLIC_GA4_ID
- NEXT_PUBLIC_CALENDLY_URL
- NEXT_PUBLIC_TIDIO_KEY
- NEXT_PUBLIC_ZAPIER_WEBHOOK_URL

Server-side (secret):
- BUFFER_API_KEY
- BUFFER_PROFILE_IDS  # comma-separated

## Deploy
1. Push this repo to GitHub.
2. Import into Vercel → Framework: Next.js → Deploy.
3. Add env vars above → Redeploy.

## Hooking Buffer
Replace the stub in `app/api/schedule/route.js` with a call to Buffer's API using `process.env.BUFFER_API_KEY`.
