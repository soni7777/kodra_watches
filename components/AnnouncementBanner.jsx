import { getAnnouncement } from "@/lib/announcement";

export default async function AnnouncementBanner() {
  const data = await getAnnouncement();
  if (!data?.active || !data?.text?.trim()) return null;

  return (
    <div className="w-full border-b border-gold/30 bg-gold/10 px-4 py-2.5 text-center text-sm font-medium text-gold-light">
      {data.text}
    </div>
  );
}
