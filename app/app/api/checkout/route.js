// app/api/checkout/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plan = (searchParams.get("plan") || "").toLowerCase();

  // Works with either private STRIPE_* or the NEXT_PUBLIC_* you already have
  const urls = {
    starter: process.env.STRIPE_STARTER_URL || process.env.NEXT_PUBLIC_STRIPE_STARTER,
    pro:     process.env.STRIPE_PRO_URL     || process.env.NEXT_PUBLIC_STRIPE_PRO,
    vip:     process.env.STRIPE_VIP_URL     || process.env.NEXT_PUBLIC_STRIPE_VIP,
  };

  const dest = urls[plan];
  if (!dest) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  return NextResponse.redirect(dest, { status: 302 });
}
