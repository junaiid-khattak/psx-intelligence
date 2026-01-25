import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js"
import { buildSignalBrief } from "@/lib/utils"

const requestSchema = z.object({
  symbols: z.array(z.string()).optional(),
  days: z.number().optional().default(30),
  snapshot: z.any().optional(),
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

async function getMatches(supabaseUrl: string, serviceKey: string, embedding: number[], symbols?: string[], days?: number) {
  const supabase = createClient(supabaseUrl, serviceKey)

  const { data, error } = await supabase.rpc("match_chunks", {
    query_embedding: embedding,
    symbols: symbols && symbols.length > 0 ? symbols : null,
    days: days ?? 30,
    match_count: symbols && symbols.length > 0 ? 12 : 8,
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

async function generateSummary(apiKey: string, matches: any[], snapshot?: unknown) {
  const system =
    "You are an equity market analyst summarizing Pakistan Stock Exchange activity. Be concise, neutral, and avoid financial advice. Mention volumes, block trades, VWAP gaps, volatility, and notable filings if evidence supports them."

  const evidenceText = matches
    .slice(0, 8)
    .map((m: any, idx: number) => `(${idx + 1}) ${m.symbol || ""}: ${m.title || ""} — ${(m.content || "").replace(/\s+/g, " ")}`)
    .join("\n")

  const user = `Create a short PSX market summary (6-10 sentences). Use cautious language. If snapshot metrics are present, weave them in. Keep it factual. Evidence:\n${evidenceText}`

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_CHAT_MODEL,
      temperature: 0.4,
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
    const { signals, days, snapshot } = requestSchema.parse(body)

    const supabaseUrl = process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    if (!supabaseUrl || !serviceKey || !openaiKey) {
      return NextResponse.json({ error: "Missing server configuration" }, { status: 500 })
    }

    // const queryText = symbols && symbols.length > 0 ? `PSX market summary for ${symbols.join(", ")}` : "PSX market summary"

    const signalBriefs = buildSignalBrief(signals);



    const embedding = await getEmbedding(openaiKey, signalBriefs.briefText)
    const matches = await getMatches(supabaseUrl, serviceKey, embedding, signalBriefs.symbols, days)
    const citations = buildCitations(matches)
    const summary = await generateSummary(openaiKey, matches, snapshot)

    return NextResponse.json(
      {
        summary,
        updatedAt: new Date().toISOString(),
        citations,
      },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    )
  } catch (error) {
    console.error("[ai/dashboard-summary]", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
