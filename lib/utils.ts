import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
type TickerRow = Record<string, any>

export type Sections = Record<string, TickerRow[]>

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildSignalBrief(
  sectionsInput: Sections | null | undefined,
  opts?: {
    topNPerSection?: number
    maxTickersInPriorityList?: number
    dateMode?: "global-latest" | "per-section-latest" | "no-filter"
  },
): { briefText: string; symbols: string[]; tradingDate?: string } {
  const sections: Sections = sectionsInput ?? {}

  const topN = opts?.topNPerSection ?? 3
  const maxTickers = opts?.maxTickersInPriorityList ?? 20
  const dateMode = opts?.dateMode ?? "global-latest"

  const normSymbol = (s: any) => String(s ?? "").trim().toUpperCase()
  const num = (v: any) => (v === null || v === undefined || v === "" ? null : Number(v))
  const safe = (v: any, fallback = "") => (v === null || v === undefined ? fallback : String(v))

  const fmtPct = (v: any) => {
    const n = num(v)
    if (n === null || Number.isNaN(n)) return "n/a"
    const sign = n > 0 ? "+" : ""
    return `${sign}${n.toFixed(2)}%`
  }

  const fmtNum = (v: any, digits = 2) => {
    const n = num(v)
    if (n === null || Number.isNaN(n)) return "n/a"
    // keep integers clean
    if (Math.abs(n) >= 1000 && Number.isInteger(n)) return n.toLocaleString()
    return n.toLocaleString(undefined, { maximumFractionDigits: digits })
  }

  const fmtPKR = (v: any) => {
    const n = num(v)
    if (n === null || Number.isNaN(n)) return "n/a"
    // compact-ish formatting without relying on Intl compact (inconsistent across runtimes)
    if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B PKR`
    if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M PKR`
    if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(2)}K PKR`
    return `${n.toFixed(0)} PKR`
  }

  // 1) Determine latest trading_date to avoid mixing old stale rows into today's summary
  const allDates: string[] = []
  for (const rows of Object.values(sections)) {
    for (const r of rows ?? []) {
      const d = r?.trading_date
      if (d) allDates.push(String(d))
    }
  }
  const globalLatestDate = allDates.length ? allDates.sort().slice(-1)[0] : undefined

  const sectionLatestDate = (rows: TickerRow[]) => {
    const dates = (rows ?? [])
      .map((r) => (r?.trading_date ? String(r.trading_date) : null))
      .filter(Boolean) as string[]
    return dates.length ? dates.sort().slice(-1)[0] : undefined
  }

  const filterByDate = (sectionName: string, rows: TickerRow[]) => {
    if (dateMode === "no-filter") return rows ?? []
    const target =
      dateMode === "per-section-latest"
        ? sectionLatestDate(rows ?? [])
        : globalLatestDate
    if (!target) return rows ?? []
    return (rows ?? []).filter((r) => String(r?.trading_date ?? "") === target)
  }

  // 2) Pick top 3 per section and build a compact brief
  const lines: string[] = []
  const prioritySymbols: string[] = []

  const prettySection = (key: string) => {
    // Light prettification for known keys
    const map: Record<string, string> = {
      topGainers: "Top Gainers (price)",
      mostActiveVolume: "Most Active (volume)",
      highestTurnover: "Highest Turnover",
      largestBlocks: "Largest Blocks",
      vwapPremiums: "VWAP Premium leaders",
      vwapDiscounts: "VWAP Discount leaders",
      volatilityLeaders: "Volatility leaders",
    }
    return map[key] ?? key
  }

  const rowLine = (r: TickerRow) => {
    const symbol = normSymbol(r.symbol)
    const name = safe(r.name)
    const close = fmtNum(r.close, 4)
    const pct1d = fmtPct(r.pct_change_1d)
    const volume = fmtNum(r.volume, 0)
    const vwapGap = fmtPct(r.vwap_gap_pct)
    const volat = fmtNum(r.intraday_volatility, 4)
    const biggest = fmtPKR(r.biggest_order_value)

    // Keep it tight; include the most useful fields for “why it’s on the dashboard”
    return `- ${symbol} (${name}): close ${close}, 1D ${pct1d}, vol ${volume}, VWAP gap ${vwapGap}, volat ${volat}, biggest order ${biggest}`
  }

  // Header
  if (globalLatestDate) {
    lines.push(`Market Summary Signals`)
    lines.push(`- Date: ${globalLatestDate}`)
  } else {
    lines.push(`Market Summary Signals`)
  }
  lines.push(`- Objective: Explain unusual activity; neutral tone; no financial advice.`)
  lines.push("")

  // Per-section summaries (top 3)
  for (const [sectionName, rawRows] of Object.entries(sections)) {
    const rows = filterByDate(sectionName, rawRows ?? [])
    if (!rows.length) continue

    const topRows = rows.slice(0, topN)
    lines.push(`${prettySection(sectionName)}:`)
    for (const r of topRows) {
      const sym = normSymbol(r.symbol)
      if (sym) prioritySymbols.push(sym)
      lines.push(rowLine(r))
    }
    lines.push("")
  }

  // 3) Build a deduped priority symbol list (cap length)
  const uniqSymbols: string[] = []
  const seen = new Set<string>()
  for (const s of prioritySymbols) {
    if (!s) continue
    if (seen.has(s)) continue
    seen.add(s)
    uniqSymbols.push(s)
    if (uniqSymbols.length >= maxTickers) break
  }

  if (uniqSymbols.length) {
    lines.push(`Tickers to prioritize for evidence lookup:`)
    lines.push(uniqSymbols.join(", "))
  }

  return {
    briefText: lines.join("\n").trim(),
    symbols: uniqSymbols,
    tradingDate: globalLatestDate,
  }
}
