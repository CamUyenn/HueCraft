import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function generateWithRetry(message: string, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: message
      });
    } catch (err: any) {
      const isOverloaded = err?.status === 503;
    if (isOverloaded && i < retries) {
      console.log(`⏳ Model quá tải, thử lại lần ${i + 1}...`);
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
      continue;
    }
      throw err;
    }
  }
}

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    const response = await generateWithRetry(message);
    return NextResponse.json({ answer: response?.text });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { answer: "Xin lỗi, AI đang quá tải, vui lòng thử lại sau ít phút." },
      { status: 200 }
    );
  }
}