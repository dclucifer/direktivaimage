# Nano Banana Image Lab

Web app Next.js untuk generate & edit gambar menggunakan **Gemini 2.5 Flash Image** (aka *Nano Banana*) via **@google/genai**.

## Setup Cepat

1. **Install deps**
   ```bash
   npm install
   ```
2. **Env**
   Salin `.env.local.example` menjadi `.env.local` lalu isi `GEMINI_API_KEY` (dari Google AI Studio).
3. **Jalankan lokal**
   ```bash
   npm run dev
   # buka http://localhost:3000
   ```
4. **Deploy ke Vercel**
   - Push repo ke GitHub
   - Import ke Vercel
   - Tambahkan `GEMINI_API_KEY` di Project → Settings → Environment Variables

## Catatan
- Model default: `gemini-2.5-flash-image-preview`
- Semua image output berisi **SynthID** watermark (otomatis by Google).
- Endpoint ada di `/api/generate` (server-side; kunci API tidak bocor ke client).

Lisensi: MIT
