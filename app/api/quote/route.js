export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker");

  if (!ticker || !/^[A-Z.]{1,10}$/.test(ticker)) {
    return Response.json({ error: "Ticker inválido" }, { status: 400 });
  }

  // ── Try Finnhub first (free, reliable, works from Vercel) ──
  const finnhubKey = process.env.FINNHUB_API_KEY;
  if (finnhubKey) {
    try {
      const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ticker)}&token=${finnhubKey}`;
      const res = await fetch(url);

      if (res.ok) {
        const data = await res.json();
        // Finnhub returns c=0 if ticker not found
        if (data && data.c && data.c > 0) {
          return Response.json({
            ticker,
            price: data.c,
            previousClose: data.pc,
            high: data.h,
            low: data.l,
            open: data.o,
            change: data.d,
            changePercent: data.dp,
            source: "finnhub",
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (e) {
      console.error("Finnhub error:", e.message);
    }
  }

  // ── Fallback: Yahoo Finance ──
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=5d`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0",
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.chart?.result?.[0]) {
        const meta = data.chart.result[0].meta;
        return Response.json({
          ticker,
          price: meta.regularMarketPrice,
          previousClose: meta.chartPreviousClose,
          source: "yahoo",
          marketState: meta.marketState || "",
          timestamp: new Date().toISOString(),
        });
      }
    }
  } catch (e) {
    console.error("Yahoo Finance error:", e.message);
  }

  // ── Fallback 2: Google Finance page scrape ──
  try {
    const url = `https://www.google.com/finance/quote/${encodeURIComponent(ticker)}:NASDAQ`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    if (res.ok) {
      const html = await res.text();
      const match = html.match(/data-last-price="([0-9.]+)"/);
      if (match) {
        return Response.json({
          ticker,
          price: parseFloat(match[1]),
          source: "google",
          timestamp: new Date().toISOString(),
        });
      }
    }
  } catch (e) {
    console.error("Google Finance error:", e.message);
  }

  return Response.json(
    {
      error:
        "No se pudo obtener el precio. Verificá el ticker o ingresá el precio manualmente.",
    },
    { status: 502 }
  );
}
