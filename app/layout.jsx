// app/layout.jsx
export const metadata = {
  title: "Our Social Image",
  description: "The AI-powered growth hub for small businesses & creators",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "ui-sans-serif, system-ui" }}>
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: "1px solid #eee"
        }}>
          <a href="/" style={{ fontWeight: 700, textDecoration: "none", color: "#111" }}>
            Our Social Image
          </a>
          <nav style={{ display: "flex", gap: 14 }}>
            <a href="/" style={{ color: "#111", textDecoration: "none" }}>Home</a>
            <a href="/book" style={{
              color: "white", background: "#111", padding: "8px 12px",
              borderRadius: 8, textDecoration: "none"
            }}>Book a call</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer style={{ borderTop: "1px solid #eee", marginTop: 40, padding: 20, color: "#555" }}>
          © {new Date().getFullYear()} Our Social Image
        </footer>
      </body>
    </html>
  );
}
