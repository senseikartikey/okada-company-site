// Leasing-assistant chat endpoint.
//
// The original project answered from a Python RAG service (LlamaIndex +
// ChromaDB + MongoDB). This demo keeps the same contract the widget expects
// (POST { message, history } -> { answer }) but answers from a Vercel
// function, so the site runs end to end without a separate Python host.
import { GoogleGenerativeAI } from "@google/generative-ai";
import { listingsAsText } from "./listings.js";

const MODEL = "gemini-2.5-flash";
const MAX_MESSAGE = 600;
const MAX_HISTORY = 8;

// A small, per-instance guard so a public demo key can't be drained in one go.
const RATE_LIMIT = { windowMs: 60_000, max: 12 };
const hits = new Map();

function overRateLimit(key) {
  const now = Date.now();
  const seen = (hits.get(key) ?? []).filter((time) => now - time < RATE_LIMIT.windowMs);
  seen.push(now);
  hits.set(key, seen);
  if (hits.size > 500) hits.clear();
  return seen.length > RATE_LIMIT.max;
}

const systemPrompt = `You are the leasing assistant for Okada & Company, a commercial real-estate demo built by Kartikey Patel for the Okada & Co. hackathon.

Available listings:
${listingsAsText()}

How to answer:
- Be concise and practical: two to five sentences, or a short list when comparing spaces.
- Recommend from the listings above only. Quote the listing id, address, size and asking rent when you name one.
- Ask one clarifying question when the requirement is vague (use, size, neighbourhood, budget, move-in date).
- If someone asks to see a space or book a viewing, collect the preferred date, time and contact email, then confirm that a leasing agent will follow up by email. You cannot actually place calendar invitations in this demo.
- If a question falls outside these listings or commercial leasing, say so briefly and offer to pass it to a human agent.
- This is a portfolio demo: the listings are sample data, not real availabilities. Say that plainly if anyone asks whether a space is really available, or asks for a price quote, a lease document, or legal or financial advice.
- Never invent buildings, tenants, prices, incentives or contract terms.`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message, history = [] } = req.body ?? {};
  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "A message is required." });
  }
  if (message.length > MAX_MESSAGE) {
    return res.status(400).json({ answer: `Could you shorten that to under ${MAX_MESSAGE} characters?` });
  }

  const caller = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";
  if (overRateLimit(caller)) {
    return res.status(429).json({ answer: "That's a lot of questions at once. Give me a minute and try again." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ answer: "The assistant is not configured yet: GEMINI_API_KEY is missing." });
  }

  const transcript = (Array.isArray(history) ? history : [])
    .slice(-MAX_HISTORY)
    .filter((turn) => turn && typeof turn.content === "string")
    .map((turn) => `${turn.role === "user" ? "Visitor" : "Assistant"}: ${turn.content}`)
    .join("\n");

  try {
    const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({ model: MODEL });
    const result = await model.generateContent(
      `${systemPrompt}\n\n${transcript ? `Conversation so far:\n${transcript}\n\n` : ""}Visitor: ${message}\n\nAssistant:`,
    );
    const answer = result.response.text().trim();
    if (!answer) throw new Error("Empty response from the model");
    return res.status(200).json({ answer });
  } catch (error) {
    console.error("[okada-chat]", error?.message ?? error);
    return res.status(502).json({
      answer: "I can't reach the assistant right now. Try again in a moment.",
    });
  }
}
