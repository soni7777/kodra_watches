import { Playfair_Display, Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kodra Watches",
  description: "Orë luksoze për çdo moment.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="sq"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header
          className="border-b border-[var(--border)] sticky top-0 z-40 backdrop-blur-sm"
          style={{ background: "var(--background-header)" }}
        >
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <div className="w-9" />
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-12 w-12 shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="Kodra Watches"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-xl sm:text-2xl tracking-[0.25em] text-gold-light group-hover:text-gold transition-colors duration-300">
                  KODRA_WATCHES
                </span>
                <span className="text-[10px] tracking-[0.4em] text-foreground-muted uppercase">
                  Shitje Online
                </span>
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex flex-1 flex-col">{children}</main>

        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
