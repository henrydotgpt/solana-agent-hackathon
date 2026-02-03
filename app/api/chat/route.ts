import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface AgentResponse {
  message: string;
  data?: {
    businessName?: string;
    businessDescription?: string;
    products?: Array<{
      name: string;
      description: string;
      price: number;
      currency: "SOL" | "USDC";
    }>;
    nextState?: "awaiting_description" | "awaiting_products" | "awaiting_wallet" | "ready_to_build";
  };
}

const SYSTEM_PROMPT = `You are Paygent — an AI payment agent that helps people create Solana payment storefronts. You're friendly, concise, and smart.

Your job is to guide users through 3 steps:
1. Understand their business (what they do, what they sell)
2. Set up their pricing (products/services with prices in SOL or USDC)
3. Get their Solana wallet address

RULES:
- Be conversational and natural. Don't be robotic.
- When they describe their business, understand it correctly. A pillow brand sells pillows. A coffee shop sells coffee. Don't misidentify businesses.
- When suggesting example pricing, make them RELEVANT to their actual business. If they sell pillows, suggest pillow prices. If they do photography, suggest photography prices.
- Accept prices in either SOL or USDC. Common ranges: small items 0.1-1 SOL or 5-50 USDC, medium 1-5 SOL or 50-200 USDC, premium 5+ SOL or 200+ USDC.
- When the user lists their products/prices, parse them and confirm.
- If the user says "same", "yes", "those", "like that", etc. after you suggest examples, use your suggested examples as their actual products.
- Keep responses SHORT — 2-4 sentences max per message, plus any product lists.
- ALWAYS mention the 0.75% platform fee when showing their final product list (before asking for wallet).
- Be encouraging but not fake. No excessive emojis.

RESPONSE FORMAT:
You must respond with valid JSON only. No markdown, no code blocks.
{
  "message": "Your conversational response to the user",
  "data": {
    "businessName": "extracted business name or null",
    "businessDescription": "the full business description or null",
    "products": [{"name": "Product", "description": "brief desc", "price": 25, "currency": "USDC"}] or null,
    "nextState": "awaiting_description" | "awaiting_products" | "awaiting_wallet" | "ready_to_build"
  }
}

IMPORTANT:
- Set nextState to "awaiting_products" after understanding the business (if they didn't include pricing)
- Set nextState to "awaiting_wallet" after products are confirmed
- Set nextState to "ready_to_build" after wallet is validated
- If the user provides everything at once (business + products), skip ahead
- products should only be set when you've confirmed/parsed actual products (not just examples)
- When user confirms your examples (says "yes", "same", etc.), set the products to your previously suggested examples
- A valid Solana address is 32-44 characters, base58 (letters and numbers, no 0, O, I, l)`;

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "AI service not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { messages, currentState } = body as {
      messages: Array<{ role: "user" | "agent"; content: string }>;
      currentState: string;
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: "Messages required" },
        { status: 400 }
      );
    }

    // Build conversation for OpenAI
    const openaiMessages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "system",
        content: `Current conversation state: ${currentState}. Guide the user to the next step.`,
      },
    ];

    for (const msg of messages) {
      openaiMessages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content:
          msg.role === "agent"
            ? // Wrap previous agent messages in the expected JSON format
              JSON.stringify({ message: msg.content, data: {} })
            : msg.content,
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", errorText);
      return NextResponse.json(
        { success: false, error: "AI service error" },
        { status: 502 }
      );
    }

    const completion = await response.json();
    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { success: false, error: "Empty AI response" },
        { status: 502 }
      );
    }

    let parsed: AgentResponse;
    try {
      parsed = JSON.parse(content);
    } catch {
      // If JSON parsing fails, wrap it as a plain message
      parsed = { message: content, data: { nextState: currentState as any } };
    }

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}
