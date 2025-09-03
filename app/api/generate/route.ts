import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { stripDataURL } from "../../../lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { prompt, images } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server misconfigured: GEMINI_API_KEY or GOOGLE_API_KEY" }, { status: 500 });
    }

    const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image-preview";
    const ai = new GoogleGenAI({ apiKey });

    const parts: any[] = [{ text: prompt }];
    if (Array.isArray(images)) {
      for (const img of images) {
        if (!img?.base64) continue;
        const base64 = stripDataURL(img.base64);
        parts.push({ inlineData: { mimeType: img.mimeType || "image/png", data: base64 } });
      }
    }

    const response = await ai.models.generateContent({ model, contents: parts });
    const out: { base64: string; mimeType: string }[] = [];
    const candidates = (response as any)?.candidates || [];
    if (candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part?.inlineData?.data) {
          out.push({ base64: part.inlineData.data, mimeType: part.inlineData.mimeType || "image/png" });
        }
      }
    }
    if (!out.length) {
      const text = (candidates[0]?.content?.parts || []).find((p: any) => p.text)?.text || "No image output received.";
      return NextResponse.json({ images: [], note: text }, { status: 200 });
    }
    return NextResponse.json({ images: out }, { status: 200 });
  } catch (err: any) {
    console.error("Nano Banana API error", err);
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}
