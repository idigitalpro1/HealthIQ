import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = `You are HealthIQ, a knowledgeable and empathetic AI health assistant powered by Google Gemini. Your role is to:

- Provide clear, accurate, and easy-to-understand health information
- Help users understand symptoms, conditions, medications, and wellness practices
- Offer evidence-based lifestyle and preventive health guidance
- Answer questions about nutrition, fitness, mental health, and general well-being
- Always encourage users to consult a qualified healthcare professional for diagnosis, treatment, or medical emergencies

Important guidelines:
- Be compassionate and supportive in your responses
- Clearly state when a situation requires immediate medical attention
- Never diagnose conditions or prescribe treatments
- Use plain language and avoid overly technical jargon unless asked
- If a question is outside health topics, politely redirect the conversation to health-related subjects`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid messages format." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Build history (all messages except the last, which is the new user message)
    const history = messages.slice(0, -1).map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })
    );

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return NextResponse.json({ message: text });
  } catch (err: unknown) {
    console.error("Chat API error:", err);
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
