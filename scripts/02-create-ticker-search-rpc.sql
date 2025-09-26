-- Create RPC function for ticker search with pagination, sorting, and search
-- This function provides server-side search, pagination, and sorting for the mv_ticker_dashboard_stocks view

CREATE OR REPLACE FUNCTION get_ticker_dashboard_stocks(
  search_query TEXT DEFAULT NULL,
  sort_column TEXT DEFAULT 'symbol',
  sort_direction TEXT DEFAULT 'asc',
  page_limit INTEGER DEFAULT 50,
  page_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  symbol TEXT,
  name TEXT,
  sector TEXT,
  trading_date DATE,
  open NUMERIC,
  high NUMERIC,
  low NUMERIC,
  close NUMERIC,
  prev_close NUMERIC,
  pct_change_1d NUMERIC,
  volume BIGINT,
  turnover NUMERIC,
  vwap NUMERIC,
  vwap_gap_pct NUMERIC,
  trade_count INTEGER,
  avg_trade_size NUMERIC,
  median_trade_size NUMERIC,
  intraday_volatility NUMERIC,
  biggest_order_shares BIGINT,
  biggest_order_value NUMERIC,
  ticker_id BIGINT,
  created_at TIMESTAMP WITH TIME ZONE,
  total_count BIGINT
) 
LANGUAGE plpgsql
AS $$
DECLARE
  total_records BIGINT;
  sort_clause TEXT;
BEGIN
  -- Validate sort direction
  IF sort_direction NOT IN ('asc', 'desc') THEN
    sort_direction := 'asc';
  END IF;
  
  -- Validate sort column (security measure)
  IF sort_column NOT IN (
    'symbol', 'name', 'sector', 'trading_date', 'open', 'high', 'low', 'close', 
    'prev_close', 'pct_change_1d', 'volume', 'turnover', 'vwap', 'vwap_gap_pct',
    'trade_count', 'avg_trade_size', 'median_trade_size', 'intraday_volatility',
    'biggest_order_shares', 'biggest_order_value', 'ticker_id', 'created_at'
  ) THEN
    sort_column := 'symbol';
  END IF;
  
  -- Build sort clause
  sort_clause := sort_column || ' ' || sort_direction || ' NULLS LAST';
  
  -- Get total count for pagination
  IF search_query IS NOT NULL AND search_query != '' THEN
    SELECT COUNT(*) INTO total_records
    FROM mv_ticker_dashboard_stocks
    WHERE symbol ILIKE search_query || '%' 
       OR name ILIKE '%' || search_query || '%';
  ELSE
    SELECT COUNT(*) INTO total_records
    FROM mv_ticker_dashboard_stocks;
  END IF;
  
  -- Return paginated results with total count
  RETURN QUERY EXECUTE format('
    SELECT 
      t.symbol,
      t.name,
      t.sector,
      t.trading_date,
      t.open,
      t.high,
      t.low,
      t.close,
      t.prev_close,
      t.pct_change_1d,
      t.volume,
      t.turnover,
      t.vwap,
      t.vwap_gap_pct,
      t.trade_count,
      t.avg_trade_size,
      t.median_trade_size,
      t.intraday_volatility,
      t.biggest_order_shares,
      t.biggest_order_value,
      t.ticker_id,
      t.created_at,
      %L::BIGINT as total_count
    FROM mv_ticker_dashboard_stocks t
    %s
    ORDER BY %s
    LIMIT %L OFFSET %L
  ',
  total_records,
  CASE 
    WHEN search_query IS NOT NULL AND search_query != '' THEN
      'WHERE t.symbol ILIKE ' || quote_literal(search_query || '%') || 
      ' OR t.name ILIKE ' || quote_literal('%' || search_query || '%')
    ELSE ''
  END,
  sort_clause,
  page_limit,
  page_offset
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_ticker_dashboard_stocks TO authenticated;
GRANT EXECUTE ON FUNCTION get_ticker_dashboard_stocks TO anon;

-- Create an index on symbol and name for faster searching if not exists
CREATE INDEX IF NOT EXISTS idx_mv_ticker_dashboard_stocks_symbol_search 
ON mv_ticker_dashboard_stocks USING gin(symbol gin_trgm_ops, name gin_trgm_ops);

-- Enable the pg_trgm extension for better text search if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_trgm;
