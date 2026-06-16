export default function Footer() {
  const phone = "355692486201";
  const message = "Përshëndetje! Jam i interesuar për orët tuaja.";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[#111824]">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col items-center gap-6">
        <p className="text-center text-[var(--foreground-muted)] text-sm tracking-wide">
          Na kontakto direkt për çmime dhe disponueshmëri
        </p>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 px-6 py-4 transition-all duration-300 hover:bg-[#25D366]/20 hover:border-[#25D366]/60 hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#25D366"
            className="h-7 w-7 shrink-0"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.556 4.118 1.528 5.845L.057 23.492a.5.5 0 0 0 .611.611l5.647-1.471A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.694-.504-5.24-1.385l-.376-.217-3.9 1.016 1.016-3.9-.217-.376A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          <div className="flex flex-col">
            <span className="text-[#25D366] font-semibold text-base tracking-wide">
              WhatsApp
            </span>
            <span className="text-white text-sm">+355 69 248 6201</span>
          </div>
        </a>

        <p className="text-[var(--foreground-muted)] text-xs tracking-widest uppercase">
          © {new Date().getFullYear()} Kodra Watches — Të gjitha të drejtat e rezervuara
        </p>
      </div>
    </footer>
  );
}
