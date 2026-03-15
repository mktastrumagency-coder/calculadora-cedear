export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker");

  if (!ticker || !/^[A-Z.]{1,10}$/.test(ticker)) {
    return Response.json({ error: "Ticker inválido" }, { status: 400 });
  }

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=5d`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return Response.json(
        { error: `Yahoo Finance devolvió ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (!data.chart?.result?.[0]) {
      return Response.json(
        { error: "No se encontró el ticker" },
        { status: 404 }
      );
    }

    const meta = data.chart.result[0].meta;
    const price = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose;
    const currency = meta.currency || "USD";
    const exchangeName = meta.exchangeName || "";
    const marketState = meta.marketState || "";

    return Response.json({
      ticker,
      price,
      previousClose,
      currency,
      exchangeName,
      marketState,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Error fetching Yahoo Finance:", e);
    return Response.json(
      { error: "Error de conexión con Yahoo Finance" },
      { status: 502 }
    );
  }
}
