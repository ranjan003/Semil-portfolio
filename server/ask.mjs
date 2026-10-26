// Server-side route for the Semil AI assistant (NOT run or tested in this build: needs your key and a host).
// Deploy as a serverless function / Express route and set SEMIL_CONFIG.aiEndpoint to its URL.
// Keys stay here: set ANTHROPIC_API_KEY in the host's environment. Never put it in the website files.
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();               // reads ANTHROPIC_API_KEY
const MODEL = process.env.SEMIL_AI_MODEL;     // set to a current Claude model id from your Anthropic console
const ORIGIN = process.env.SEMIL_ORIGIN;      // e.g. https://www.yourdomain.com
const hits = new Map();                       // naive per-IP rate limit; use Redis or your platform's limiter in production
const SYSTEM = `You are the assistant on the Semil Retail Industries Private Limited website.
Answer only from the CONTEXT passages. If the answer is not in them, say you do not have confirmed information and suggest the contact page.
Never invent metrics, dates, titles, features or launch status. Planned or upcoming items are not launched.
Never say Semil is an authorised payment operator. You are a language model, not an AGI. Keep answers under 150 words.`;
const TOOLS = [{ name: "submit_enquiry_draft", description: "Offer the visitor an enquiry form. Never send anything yourself.",
  input_schema: { type: "object", properties: { category: { type: "string" } }, required: ["category"] } }];

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", ORIGIN || "");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).end();
  const ip = req.headers["x-forwarded-for"] || "x", now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < 60_000);
  if (recent.length >= 12) return res.status(429).json({ text: "Too many questions. Please wait a minute." });
  hits.set(ip, [...recent, now]);
  const { message, history = [], context = [] } = req.body || {};
  if (typeof message !== "string" || !message.trim() || message.length > 600) return res.status(400).json({ text: "Invalid question." });
  const ctx = context.slice(0, 6).map((c, i) => `[${i + 1}] ${String(c.title).slice(0, 80)}: ${String(c.text).slice(0, 900)}`).join("\n");
  try {
    const r = await client.messages.create({ model: MODEL, max_tokens: 500, system: SYSTEM + "\n\nCONTEXT:\n" + ctx, tools: TOOLS,
      messages: [...history.slice(-6).filter(m => ["user", "assistant"].includes(m.role)).map(m => ({ role: m.role, content: String(m.content).slice(0, 500) })), { role: "user", content: message }] });
    const text = r.content.filter(b => b.type === "text").map(b => b.text).join("\n").trim() || "I do not have confirmed information on that.";
    res.json({ text, sources: context.slice(0, 3).map(c => ({ t: c.title, h: c.href })) });
  } catch (e) { res.status(502).json({ text: "The assistant is unavailable right now." }); }
}
