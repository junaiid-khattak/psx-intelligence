import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js"

const requestSchema = z.object({
  symbol: z.string().min(1),
  days: z.number().optional().default(60),
  metrics: z.record(z.any()).optional(),
})

const OPENAI_EMBED_MODEL = "text-embedding-3-small"
const OPENAI_CHAT_MODEL = "gpt-4o-mini"

async function getEmbedding(apiKey: string, input: string) {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: OPENAI_EMBED_MODEL, input }),
  })

  if (!response.ok) {
    throw new Error(`Embedding failed: ${response.status} ${await response.text()}`)
  }

  const json = await response.json()
  return json.data?.[0]?.embedding as number[]
}

async function getMatches(supabaseUrl: string, serviceKey: string, embedding: number[], symbol: string, days?: number) {
  const supabase = createClient(supabaseUrl, serviceKey)

  const { data, error } = await supabase.rpc("match_chunks", {
    query_embedding: embedding,
    symbols: [symbol],
    days: days ?? 60,
    match_count: 12,
  })

  if (error) throw error
  return data || []
}

function buildCitations(matches: any[]) {
  const seen = new Set<string>()
  const citations: {
    symbol: string
    title: string
    published_at: string
    snippet: string
  }[] = []

  for (const m of matches) {
    const key = `${m.symbol}|${m.title}`
    if (seen.has(key)) continue
    seen.add(key)
    citations.push({
      symbol: m.symbol || "",
      title: m.title || "Untitled",
      published_at: m.published_at || m.created_at || new Date().toISOString(),
      snippet: (m.content || "").replace(/\s+/g, " ").slice(0, 220),
    })
    if (citations.length >= 10) break
  }

  return citations
}

async function generateExplanation(apiKey: string, matches: any[], symbol: string, metrics?: Record<string, any>) {
  const system =
    "You are an assistant explaining why a PSX ticker appears in trading signals. Be concise, neutral, and avoid financial advice. Use evidence provided and be cautious about causality."

  const metricLines = metrics
    ? Object.entries(metrics)
        .map(([k, v]) => `${k}: ${v}`)
        .join("; ")
    : ""

  const evidenceText = matches
    .slice(0, 8)
    .map((m: any, idx: number) => `(${idx + 1}) ${m.title || ""} — ${(m.content || "").replace(/\s+/g, " ")}`)
    .join("\n")

  const user = `Explain why ${symbol} is notable today. Metrics: ${metricLines}. Cite titles/dates lightly. Evidence:\n${evidenceText}`

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_CHAT_MODEL,
      temperature: 0.35,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      max_tokens: 320,
    }),
  })

  if (!response.ok) {
    throw new Error(`Chat failed: ${response.status} ${await response.text()}`)
  }

  const json = await response.json()
  return json.choices?.[0]?.message?.content?.trim() || ""
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { symbol, days, metrics } = requestSchema.parse(body)

    const supabaseUrl = process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    if (!supabaseUrl || !serviceKey || !openaiKey) {
      return NextResponse.json({ error: "Missing server configuration" }, { status: 500 })
    }

    const embedding = await getEmbedding(openaiKey, `PSX ticker ${symbol} recent news and trading drivers`)
    const matches = await getMatches(supabaseUrl, serviceKey, embedding, symbol, days)
    const citations = buildCitations(matches)
    const explanation = await generateExplanation(openaiKey, matches, symbol, metrics || undefined)

    return NextResponse.json(
      {
        explanation,
        updatedAt: new Date().toISOString(),
        citations,
      },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    )
  } catch (error) {
    console.error("[ai/ticker-explainer]", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
