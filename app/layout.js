import { Playfair_Display, Inter } from "next/font/google";
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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="border-b border-gold/20">
          <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-center">
            <h1 className="font-serif text-2xl sm:text-3xl tracking-[0.3em] text-gold-light">
              KODRA WATCHES
            </h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
