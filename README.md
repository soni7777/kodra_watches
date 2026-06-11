# Kodra Watches

Faqe për shitje orash, ndërtuar me Next.js (App Router), Tailwind CSS dhe Vercel Blob për ruajtjen e fotove.

## Zhvillim lokal

1. Instalo varësitë:

   ```bash
   npm install
   ```

2. Kopjo `.env.local.example` në `.env.local` dhe plotëso vlerat:

   ```bash
   cp .env.local.example .env.local
   ```

3. Nis serverin e zhvillimit:

   ```bash
   npm run dev
   ```

## Variablat e mjedisit

| Variabël | Përshkrim |
| --- | --- |
| `BLOB_READ_WRITE_TOKEN` | Token për lexim/shkrim në Vercel Blob. |
| `ADMIN_PASSWORD` | Fjalëkalimi për panelin e administrimit (`/admin`). |

**Mos i vendos kurrë këto vlera direkt në kod** — vendosi vetëm te `.env.local` (lokalisht) ose te variablat e mjedisit në Vercel (në prodhim).

## Konfigurimi në Vercel

1. **Lidh repon** me një projekt të ri në [Vercel](https://vercel.com/new).
2. **Krijo një Blob store**: në panelin e projektit shko te skeda **Storage** → **Create Database** → **Blob**. Pasi ta krijosh dhe ta lidhësh me projektin, Vercel do të shtojë automatikisht variablin `BLOB_READ_WRITE_TOKEN`.
3. **Shto variablat e mjedisit**: te **Settings** → **Environment Variables**, shto:
   - `ADMIN_PASSWORD` — zgjidh një fjalëkalim të fortë për panelin e administrimit.
   - (`BLOB_READ_WRITE_TOKEN` zakonisht shtohet automatikisht nga lidhja me Blob store-in; verifiko që ekziston.)
4. **Bëj deploy** (push në degën kryesore ose "Redeploy" nga paneli i Vercel).

## Paneli i administrimit

Faqja `/admin` lejon ngarkimin dhe menaxhimin e fotove për secilën markë (kërkohet fjalëkalimi `ADMIN_PASSWORD`). Funksionon edhe nga telefoni, duke lejuar zgjedhjen e fotove nga galeria ose kamera.
