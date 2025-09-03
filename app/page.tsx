'use client';
import { useState } from 'react';
import Uploader from '../components/Uploader';
import Gallery from '../components/Gallery';
import { fileToDataURL } from '../lib/utils';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<{ src: string }[]>([]);
  const [note, setNote] = useState<string | null>(null);

  async function onGenerate() {
    setLoading(true);
    setNote(null);
    try {
      const enc = await Promise.all(
        files.map(async (f) => ({
          base64: await fileToDataURL(f),
          mimeType: f.type || 'image/png',
        }))
      );

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, images: enc }),
      });
      const data = await res.json();

      if (data?.images?.length) {
        setImages(data.images.map((im: any) => ({ src: `data:${im.mimeType || 'image/png'};base64,${im.base64}` })));
      } else {
        setImages([]);
        if (data?.note) setNote(data.note);
      }
    } catch (e: any) {
      alert(e?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="flex items-center gap-3 mb-8">
          <img src="/logo.svg" alt="logo" className="size-8" />
          <h1 className="text-2xl font-semibold tracking-tight">Nano Banana Image Lab</h1>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <label className="block text-sm text-neutral-300">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Jelaskan edit/gambar yang diinginkan (contoh: Ganti background jadi minimalis putih, pertahankan wajah yang sama)"
              className="w-full h-36 rounded-xl bg-neutral-900 border border-neutral-800 p-4 outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Uploader files={files} setFiles={setFiles} />
            <button
              onClick={onGenerate}
              disabled={loading || !prompt.trim()}
              className="rounded-xl bg-amber-500/90 hover:bg-amber-400 active:bg-amber-500 text-neutral-900 font-semibold px-5 py-3 disabled:opacity-50"
            >
              {loading ? 'Generating…' : 'Generate / Edit'}
            </button>
            {note && <p className="text-sm text-neutral-400 mt-2">{note}</p>}
          </div>
          <aside className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <h3 className="font-medium mb-2">Tips cepat</h3>
            <ul className="list-disc ml-5 space-y-1 text-sm text-neutral-300">
              <li>Deskripsikan adegan secara naratif (hindari daftar kata kunci).</li>
              <li>Untuk edit orang: jelaskan bagian yang diubah, <em>pertahankan wajah</em>.</li>
              <li>Upload beberapa gambar untuk <em>fusion</em> (mis. produk + latar).</li>
              <li>Hasil diberi watermark SynthID otomatis oleh Google.</li>
            </ul>
          </aside>
        </section>

        <section className="mt-10">
          <Gallery images={images} />
        </section>

        <footer className="mt-12 text-xs text-neutral-500">
          <p>Demo. Jangan upload konten yang melanggar hak cipta/privasi.</p>
        </footer>
      </div>
    </main>
  );
}
