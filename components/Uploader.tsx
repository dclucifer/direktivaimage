'use client';
import { Dispatch, SetStateAction, useCallback } from 'react';

export default function Uploader({
  files,
  setFiles,
}: {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
}) {
  const onInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  }, [setFiles]);

  return (
    <div className="space-y-3">
      <label className="block text-sm text-neutral-300">Images (opsional)</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onInput}
        className="block w-full text-sm text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700"
      />
      {!!files.length && (
        <div className="flex flex-wrap gap-3">
          {files.map((f, i) => (
            <div key={i} className="text-xs text-neutral-400 border border-neutral-800 rounded-lg px-3 py-1">
              {f.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
