export function stripDataURL(dataUrl: string): string {
  return String(dataUrl || '').replace(/^data:[^;]+;base64,/, '');
}
export async function fileToDataURL(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
  return `data:${file.type || 'image/png'};base64,${b64}`;
}
