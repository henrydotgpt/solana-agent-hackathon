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
    tagline?: string;
    logo?: string;
    links?: Record<string, string>;
    nextState?: "awaiting_description" | "awaiting_products" | "awaiting_extras" | "awaiting_wallet" | "ready_to_build";
  };
}

const SYSTEM_PROMPT = `You are Paygent — an AI payment agent that helps people create professional Solana payment storefronts. You're friendly, concise, and smart.

Your job is to guide users through these steps:
1. Understand their business (what they do, what they sell)
2. Set up their pricing (products/services with prices in SOL or USDC)
3. Collect optional extras: logo URL, website/social links, tagline
4. Get their Solana wallet address

RULES:
- Be conversational and natural. Don't be robotic.
- When they describe their business, understand it correctly. A pillow brand sells pillows. A coffee shop sells coffee.
- When suggesting example pricing, make them RELEVANT to their actual business.
- Accept prices in either SOL or USDC.
- If the user says "same", "yes", "those", etc. after you suggest examples, use your suggested examples as their actual products.
- After products are confirmed, ask: "Want to add a logo, website, or social links to your storefront? Paste a logo image URL and any links — or say 'skip' to finish up."
- If they provide a logo URL, store it. If they provide social links, extract them.
- If they say "skip" or "no" for extras, move to wallet.
- Keep responses SHORT — 2-4 sentences max per message, plus any lists.
- ALWAYS mention the 0.75% platform fee when showing their final product list.
- Write product descriptions that are professional and compelling (1 short sentence each).
- Write a polished businessDescription suitable for a public storefront page.

RESPONSE FORMAT:
You must respond with valid JSON only. No markdown, no code blocks.
{
  "message": "Your conversational response to the user",
  "data": {
    "businessName": "extracted business name or null",
    "businessDescription": "a professional 1-2 sentence description or null",
    "tagline": "a short catchy tagline or null",
    "logo": "URL to their logo image or null",
    "links": {"website": "url", "twitter": "url", "instagram": "url"} or null,
    "products": [{"name": "Product", "description": "brief compelling desc", "price": 25, "currency": "USDC"}] or null,
    "nextState": "awaiting_description" | "awaiting_products" | "awaiting_extras" | "awaiting_wallet" | "ready_to_build"
  }
}

IMPORTANT:
- Set nextState to "awaiting_products" after understanding the business
- Set nextState to "awaiting_extras" after products are confirmed (ask about logo/links)
- Set nextState to "awaiting_wallet" after extras are collected or skipped
- Set nextState to "ready_to_build" after wallet is validated
- If the user provides everything at once, skip ahead
- products should only be set when you've confirmed/parsed actual products
- When user confirms your examples, set the products to your suggested examples
- businessDescription should be polished for display on a public storefront
- A valid Solana address is 32-44 characters, base58 (no 0, O, I, l)`;

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

    // Decode HTML entities in all string fields (GPT sometimes returns &#x27; etc.)
    parsed.message = decodeHtmlEntities(parsed.message);
    if (parsed.data?.businessName) parsed.data.businessName = decodeHtmlEntities(parsed.data.businessName);
    if (parsed.data?.businessDescription) parsed.data.businessDescription = decodeHtmlEntities(parsed.data.businessDescription);
    if (parsed.data?.products) {
      parsed.data.products = parsed.data.products.map((p) => ({
        ...p,
        name: decodeHtmlEntities(p.name),
        description: decodeHtmlEntities(p.description),
      }));
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

/** Decode common HTML entities that GPT sometimes includes in JSON */
function decodeHtmlEntities(text: string): string {
  if (!text) return text;
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&#x22;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));
}
