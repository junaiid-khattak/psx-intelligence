"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Search, Filter, TrendingUp, Volume2, DollarSign, Zap } from "lucide-react"

interface ScreenerCriteria {
  priceMin: string
  priceMax: string
  volumeMin: string
  marketCapMin: string
  marketCapMax: string
  changeMin: string
  changeMax: string
  sector: string
  sortBy: string
}

const mockScreenerResults = [
  {
    symbol: "UBL",
    name: "United Bank Limited",
    close: 185.5,
    pct_change_1d: 2.45,
    volume: 1250000,
    market_cap: 125000000000,
    sector: "Banking",
  },
  {
    symbol: "ENGRO",
    name: "Engro Corporation",
    close: 425.75,
    pct_change_1d: 1.85,
    volume: 890000,
    market_cap: 98000000000,
    sector: "Chemicals",
  },
  {
    symbol: "OGDC",
    name: "Oil & Gas Development Company",
    close: 95.25,
    pct_change_1d: -0.75,
    volume: 2100000,
    market_cap: 156000000000,
    sector: "Oil & Gas",
  },
]

const sectors = [
  "All Sectors",
  "Banking",
  "Oil & Gas",
  "Chemicals",
  "Cement",
  "Textiles",
  "Technology",
  "Pharmaceuticals",
]

const sortOptions = [
  { value: "pct_change_1d.desc", label: "Highest Gainers" },
  { value: "pct_change_1d.asc", label: "Biggest Losers" },
  { value: "volume.desc", label: "Most Active" },
  { value: "market_cap.desc", label: "Largest Cap" },
  { value: "close.desc", label: "Highest Price" },
  { value: "close.asc", label: "Lowest Price" },
]

export function StockScreener() {
  const [criteria, setCriteria] = useState<ScreenerCriteria>({
    priceMin: "",
    priceMax: "",
    volumeMin: "",
    marketCapMin: "",
    marketCapMax: "",
    changeMin: "",
    changeMax: "",
    sector: "All Sectors",
    sortBy: "pct_change_1d.desc",
  })
  const [results, setResults] = useState(mockScreenerResults)
  const [isSearching, setIsSearching] = useState(false)

  const handleCriteriaChange = (field: keyof ScreenerCriteria, value: string) => {
    setCriteria((prev) => ({ ...prev, [field]: value }))
  }

  const handleSearch = async () => {
    setIsSearching(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setResults(mockScreenerResults)
    setIsSearching(false)
  }

  const clearFilters = () => {
    setCriteria({
      priceMin: "",
      priceMax: "",
      volumeMin: "",
      marketCapMin: "",
      marketCapMax: "",
      changeMin: "",
      changeMax: "",
      sector: "All Sectors",
      sortBy: "pct_change_1d.desc",
    })
  }

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
    return value.toString()
  }

  return (
    <div className="space-y-6">
      {/* Screening Criteria */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle>Screening Criteria</CardTitle>
          </div>
          <CardDescription>Set your filters to find stocks matching your criteria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Range */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">Price Range (PKR)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priceMin" className="text-xs text-muted-foreground">
                  Minimum
                </Label>
                <Input
                  id="priceMin"
                  placeholder="0"
                  value={criteria.priceMin}
                  onChange={(e) => handleCriteriaChange("priceMin", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="priceMax" className="text-xs text-muted-foreground">
                  Maximum
                </Label>
                <Input
                  id="priceMax"
                  placeholder="1000"
                  value={criteria.priceMax}
                  onChange={(e) => handleCriteriaChange("priceMax", e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Volume and Market Cap */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-foreground mb-3 block">Volume</Label>
              <Input
                placeholder="Minimum volume"
                value={criteria.volumeMin}
                onChange={(e) => handleCriteriaChange("volumeMin", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground mb-3 block">Market Cap Range (PKR)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Min (B)"
                  value={criteria.marketCapMin}
                  onChange={(e) => handleCriteriaChange("marketCapMin", e.target.value)}
                />
                <Input
                  placeholder="Max (B)"
                  value={criteria.marketCapMax}
                  onChange={(e) => handleCriteriaChange("marketCapMax", e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Performance and Sector */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium text-foreground mb-3 block">1-Day Change (%)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Min %"
                  value={criteria.changeMin}
                  onChange={(e) => handleCriteriaChange("changeMin", e.target.value)}
                />
                <Input
                  placeholder="Max %"
                  value={criteria.changeMax}
                  onChange={(e) => handleCriteriaChange("changeMax", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground mb-3 block">Sector</Label>
              <Select value={criteria.sector} onValueChange={(value) => handleCriteriaChange("sector", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground mb-3 block">Sort By</Label>
              <Select value={criteria.sortBy} onValueChange={(value) => handleCriteriaChange("sortBy", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSearch} disabled={isSearching} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {isSearching ? "Searching..." : "Run Screen"}
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Screening Results</CardTitle>
              <CardDescription>{results.length} stocks match your criteria</CardDescription>
            </div>
            <Badge variant="secondary">{results.length} Results</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((stock) => (
              <div
                key={stock.symbol}
                className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{stock.symbol}</h4>
                      <p className="text-sm text-muted-foreground">{stock.name}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{stock.sector}</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-medium text-foreground">PKR {stock.close.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">1D Change</p>
                      <p className={`font-medium ${stock.pct_change_1d >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {stock.pct_change_1d >= 0 ? "+" : ""}
                        {stock.pct_change_1d.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Volume</p>
                      <p className="font-medium text-foreground">{stock.volume.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Market Cap</p>
                      <p className="font-medium text-foreground">PKR {formatMarketCap(stock.market_cap)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
