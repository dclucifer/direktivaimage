'use client';
export default function Gallery({ images }: { images: { src: string }[] }) {
  if (!images?.length) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((im, i) => (
        <figure key={i} className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={im.src} alt={`Nano Banana output ${i + 1}`} className="w-full h-auto" />
          <figcaption className="flex items-center justify-between px-3 py-2 text-xs text-neutral-400">
            <span>Result {i + 1}</span>
            <a href={im.src} download={`nano-banana-${i + 1}.png`} className="underline hover:no-underline">
              Download
            </a>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
