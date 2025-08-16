// app/layout.jsx
export const metadata = {
  title: "Our Social Image — AI-Powered Growth",
  description:
    "OSÍ helps creators, businesses, and brands grow with AI-powered content, marketing, and automation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-semibold tracking-tight text-slate-900">
              Our Social Image <span className="text-slate-400">· OSÍ</span>
            </a>

            <nav className="flex items-center gap-4">
              <a href="/" className="text-sm text-slate-600 hover:text-slate-900">
                Home
              </a>
              <a href="/book"
                 className="text-sm rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800 transition">
                Book a call
              </a>
            </nav>
          </div>
        </header>

        {/* Page */}
        <main className="mx-auto max-w-6xl px-4">{children}</main>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-200">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
            © {new Date().getFullYear()} Our Social Image. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
