# Cache Invalidation System

## Overview

The PSX Intelligence application implements a comprehensive cache invalidation system to ensure users always see fresh data when the underlying database is updated by AWS Lambda functions.

## Architecture

### 1. Cache Invalidation API (`/api/cache/invalidate`)
- **POST endpoint** for AWS Lambda to trigger cache invalidation
- Requires API key authentication (`CACHE_INVALIDATION_API_KEY`)
- Accepts `sections` and `tickers` parameters to target specific data

### 2. Server-Sent Events (`/api/cache/events`)
- Real-time communication channel for cache invalidation events
- Automatically reconnects on connection loss
- Sends heartbeat messages to keep connection alive

### 3. Client-Side Cache Management
- `CacheInvalidationManager` class handles SSE connections
- Automatic query invalidation based on received events
- Manual refresh controls throughout the UI

## Usage

### For AWS Lambda Functions

\`\`\`bash
curl -X POST https://your-app.vercel.app/api/cache/invalidate \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "your-secret-key",
    "sections": ["watchlist", "dashboard"],
    "tickers": ["OGDC", "UBL"]
  }'
\`\`\`

### Cache Configuration

Different data types use optimized cache settings:

- **Real-time data**: 30s stale time, 1min refetch interval
- **Stock details**: 2min stale time, focus refetch
- **Watchlist**: 1min stale time, 2min background refetch
- **AI signals**: 10min stale time (expensive to generate)

### Manual Refresh Controls

Users can manually refresh data using:
- Header cache status indicator
- Individual component refresh buttons
- Full page refresh for server-side data

## Environment Variables

\`\`\`env
CACHE_INVALIDATION_API_KEY=your-secret-key-here
\`\`\`

## Benefits

1. **Real-time Updates**: Data refreshes automatically when Lambda updates database
2. **Performance**: Intelligent caching reduces API calls and improves UX
3. **Reliability**: Automatic reconnection and fallback mechanisms
4. **Flexibility**: Granular control over what data to invalidate
5. **User Control**: Manual refresh options for immediate updates
