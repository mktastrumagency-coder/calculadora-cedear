"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ──────────────────────────────────────────────
   CEDEAR DATA — ~200 tickers con ratios actualizados
   Ratios con formato "X:1" se almacenan como número.
   Ratios fraccionarios (ej 1:3) usan ratioNum.
   ────────────────────────────────────────────── */
const CEDEAR_DATA = {
  AAL: { name: "American Airlines", ratio: 2 },
  AAPL: { name: "Apple Inc", ratio: 10 },
  ABBV: { name: "AbbVie Inc", ratio: 10 },
  ABEV: { name: "Ambev S.A.", ratioLabel: "1:3", ratioNum: 1 / 3 },
  ABT: { name: "Abbott Laboratories", ratio: 4 },
  ADBE: { name: "Adobe Inc", ratio: 22 },
  ADGO: { name: "Adecoagro S.A.", ratioLabel: "1:2", ratioNum: 0.5 },
  ADI: { name: "Analog Devices", ratio: 15 },
  ADP: { name: "Automatic Data Processing", ratio: 6 },
  ADS: { name: "Adidas AG", ratio: 22 },
  AEM: { name: "Agnico Eagle Mines", ratio: 3 },
  AIG: { name: "American Intl Group", ratio: 5 },
  AI: { name: "C3 AI Inc", ratio: 5 },
  AMAT: { name: "Applied Materials", ratio: 5 },
  AMD: { name: "Advanced Micro Devices", ratio: 10 },
  AMGN: { name: "Amgen Inc", ratio: 10 },
  AMX: { name: "América Móvil", ratio: 1 },
  AMZN: { name: "Amazon.com Inc", ratio: 144 },
  ANF: { name: "Abercrombie & Fitch", ratio: 1 },
  ARCO: { name: "Arcos Dorados", ratioLabel: "1:2", ratioNum: 0.5 },
  ASML: { name: "ASML Holding", ratio: 146 },
  ASR: { name: "Grupo Aeroportuario", ratio: 20 },
  AVGO: { name: "Broadcom Inc", ratio: 39 },
  AVY: { name: "Avery Dennison", ratio: 18 },
  AXP: { name: "American Express", ratio: 5 },
  AZN: { name: "AstraZeneca", ratio: 2 },
  BA: { name: "Boeing Co", ratio: 6 },
  BABA: { name: "Alibaba Group", ratio: 9 },
  BAC: { name: "Bank of America", ratio: 2 },
  BAS: { name: "BASF SE", ratio: 2 },
  BAYN: { name: "Bayer AG", ratio: 3 },
  BB: { name: "BlackBerry Ltd", ratio: 3 },
  BBD: { name: "Banco Bradesco", ratio: 1 },
  BBVA: { name: "Banco Bilbao Vizcaya", ratio: 1 },
  BCS: { name: "Barclays PLC", ratio: 1 },
  BHP: { name: "BHP Group", ratio: 2 },
  BIDU: { name: "Baidu Inc", ratio: 11 },
  BIIB: { name: "Biogen Inc", ratio: 13 },
  BIOX: { name: "Bioceres Crop Solutions", ratioLabel: "1:2", ratioNum: 0.5 },
  BK: { name: "Bank of New York Mellon", ratio: 2 },
  BMY: { name: "Bristol-Myers Squibb", ratio: 3 },
  BNG: { name: "Bunge Ltd", ratio: 5 },
  BP: { name: "BP PLC", ratio: 5 },
  BRFS: { name: "BRF S.A.", ratioLabel: "1:3", ratioNum: 1 / 3 },
  BRKB: { name: "Berkshire Hathaway B", ratio: 22 },
  BSN: { name: "Danone", ratio: 20 },
  C: { name: "Citigroup Inc", ratio: 3 },
  CAAP: { name: "Corp. América Airports", ratioLabel: "1:4", ratioNum: 0.25 },
  CAH: { name: "Cardinal Health", ratio: 3 },
  CAR: { name: "Avis Budget Group", ratio: 26 },
  CAT: { name: "Caterpillar Inc", ratio: 20 },
  CEG: { name: "Constellation Energy", ratio: 45 },
  CL: { name: "Colgate-Palmolive", ratio: 3 },
  CLS: { name: "Celestica Inc", ratio: 20 },
  COIN: { name: "Coinbase Global", ratio: 10 },
  COST: { name: "Costco Wholesale", ratio: 60 },
  CRM: { name: "Salesforce Inc", ratio: 10 },
  CSCO: { name: "Cisco Systems", ratio: 4 },
  CVX: { name: "Chevron Corp", ratio: 5 },
  DAL: { name: "Delta Air Lines", ratio: 3 },
  DBX: { name: "Dropbox Inc", ratio: 2 },
  DD: { name: "DuPont", ratio: 3 },
  DE: { name: "Deere & Company", ratio: 20 },
  DECK: { name: "Deckers Outdoor", ratio: 25 },
  DIA: { name: "SPDR Dow Jones ETF", ratio: 72 },
  DIS: { name: "Walt Disney Co", ratio: 5 },
  DOCU: { name: "DocuSign Inc", ratio: 5 },
  EBAY: { name: "eBay Inc", ratio: 3 },
  EEM: { name: "iShares MSCI EM ETF", ratio: 4 },
  EFX: { name: "Equifax Inc", ratio: 11 },
  ELP: { name: "Cia Paranaense Energía", ratio: 1 },
  EMR: { name: "Emerson Electric", ratio: 4 },
  ERIC: { name: "Ericsson", ratio: 1 },
  ERJ: { name: "Embraer S.A.", ratio: 2 },
  ETSY: { name: "Etsy Inc", ratio: 7 },
  EWZ: { name: "iShares MSCI Brazil", ratio: 2 },
  F: { name: "Ford Motor Co", ratio: 1 },
  FANG: { name: "Diamondback Energy", ratio: 10 },
  FCX: { name: "Freeport-McMoRan", ratio: 2 },
  FDX: { name: "FedEx Corp", ratio: 10 },
  FSLR: { name: "First Solar Inc", ratio: 6 },
  GD: { name: "General Dynamics", ratio: 5 },
  GE: { name: "GE Aerospace", ratio: 6 },
  GILD: { name: "Gilead Sciences", ratio: 5 },
  GLD: { name: "SPDR Gold Shares", ratio: 10 },
  GLW: { name: "Corning Inc", ratio: 3 },
  GM: { name: "General Motors", ratio: 2 },
  GOLD: { name: "Barrick Gold", ratio: 1 },
  GOOG: { name: "Alphabet Inc (C)", ratio: 14 },
  GOOGL: { name: "Alphabet Inc (A)", ratio: 14 },
  GS: { name: "Goldman Sachs", ratio: 19 },
  GSK: { name: "GSK PLC", ratio: 3 },
  HAL: { name: "Halliburton Co", ratio: 2 },
  HDB: { name: "HDFC Bank", ratio: 3 },
  HD: { name: "Home Depot", ratio: 14 },
  HMC: { name: "Honda Motor", ratio: 2 },
  HON: { name: "Honeywell Intl", ratio: 5 },
  HPQ: { name: "HP Inc", ratio: 2 },
  HSBC: { name: "HSBC Holdings", ratio: 3 },
  HWM: { name: "Howmet Aerospace", ratio: 4 },
  IBM: { name: "IBM Corp", ratio: 5 },
  IJH: { name: "iShares S&P Mid-Cap", ratio: 12 },
  INTC: { name: "Intel Corp", ratio: 2 },
  INTU: { name: "Intuit Inc", ratio: 24 },
  IQV: { name: "IQVIA Holdings", ratio: 10 },
  ISRG: { name: "Intuitive Surgical", ratio: 16 },
  ITUB: { name: "Itaú Unibanco", ratio: 1 },
  IWM: { name: "iShares Russell 2000", ratio: 17 },
  JD: { name: "JD.com Inc", ratio: 5 },
  JNJ: { name: "Johnson & Johnson", ratio: 5 },
  JPM: { name: "JPMorgan Chase", ratio: 10 },
  KGC: { name: "Kinross Gold", ratio: 1 },
  KMB: { name: "Kimberly-Clark", ratio: 5 },
  KO: { name: "Coca-Cola Co", ratio: 3 },
  LRCX: { name: "Lam Research", ratio: 11 },
  LLY: { name: "Eli Lilly", ratio: 28 },
  LMT: { name: "Lockheed Martin", ratio: 18 },
  LOW: { name: "Lowe's Companies", ratio: 10 },
  LVS: { name: "Las Vegas Sands", ratio: 3 },
  LYG: { name: "Lloyds Banking Group", ratio: 1 },
  MA: { name: "Mastercard Inc", ratio: 18 },
  MCD: { name: "McDonald's Corp", ratio: 12 },
  MELI: { name: "MercadoLibre Inc", ratio: 120 },
  META: { name: "Meta Platforms", ratio: 28 },
  MMM: { name: "3M Company", ratio: 10 },
  MO: { name: "Altria Group", ratio: 3 },
  MOS: { name: "Mosaic Company", ratio: 2 },
  MRK: { name: "Merck & Co", ratio: 5 },
  MRVL: { name: "Marvell Technology", ratio: 8 },
  MSFT: { name: "Microsoft Corp", ratio: 14 },
  MSI: { name: "Motorola Solutions", ratio: 16 },
  MU: { name: "Micron Technology", ratio: 8 },
  NFLX: { name: "Netflix Inc", ratio: 48 },
  NKE: { name: "Nike Inc", ratio: 5 },
  NOC: { name: "Northrop Grumman", ratio: 18 },
  NOW: { name: "ServiceNow Inc", ratio: 172 },
  NUE: { name: "Nucor Corp", ratio: 5 },
  NVDA: { name: "NVIDIA Corp", ratio: 10 },
  NVS: { name: "Novartis AG", ratio: 5 },
  ORCL: { name: "Oracle Corp", ratio: 6 },
  OXY: { name: "Occidental Petroleum", ratio: 3 },
  PATH: { name: "UiPath Inc", ratio: 2 },
  PBR: { name: "Petrobras", ratio: 1 },
  PDD: { name: "PDD Holdings", ratio: 25 },
  PEP: { name: "PepsiCo Inc", ratio: 5 },
  PFE: { name: "Pfizer Inc", ratio: 2 },
  PG: { name: "Procter & Gamble", ratio: 4 },
  PLTR: { name: "Palantir Technologies", ratio: 7 },
  PSQ: { name: "ProShares Short QQQ", ratio: 8 },
  PYPL: { name: "PayPal Holdings", ratio: 5 },
  QCOM: { name: "Qualcomm Inc", ratio: 10 },
  QQQ: { name: "Invesco QQQ Trust", ratio: 36 },
  RGTI: { name: "Rigetti Computing", ratio: 2 },
  RIO: { name: "Rio Tinto", ratio: 3 },
  ROKU: { name: "Roku Inc", ratio: 5 },
  RTX: { name: "RTX Corporation", ratio: 4 },
  SBUX: { name: "Starbucks Corp", ratio: 4 },
  SCCO: { name: "Southern Copper", ratio: 4 },
  SHOP: { name: "Shopify Inc", ratio: 5 },
  SID: { name: "CSN - Cia Siderúrgica", ratio: 1 },
  SLB: { name: "Schlumberger", ratio: 3 },
  SLV: { name: "iShares Silver Trust", ratio: 6 },
  SNAP: { name: "Snap Inc", ratio: 1 },
  SNOW: { name: "Snowflake Inc", ratio: 10 },
  SNP: { name: "China Petroleum", ratio: 6 },
  SONY: { name: "Sony Group", ratio: 8 },
  SPY: { name: "SPDR S&P 500 ETF", ratio: 46 },
  SQ: { name: "Block Inc (Square)", ratio: 5 },
  STX: { name: "Seagate Technology", ratio: 3 },
  T: { name: "AT&T Inc", ratio: 1 },
  TD: { name: "Toronto-Dominion Bank", ratio: 3 },
  TEAM: { name: "Atlassian Corp", ratio: 47 },
  TEM: { name: "Tempus AI", ratio: 12 },
  TGT: { name: "Target Corp", ratio: 6 },
  TM: { name: "Toyota Motor", ratio: 6 },
  TMO: { name: "Thermo Fisher", ratio: 18 },
  TRIP: { name: "TripAdvisor", ratio: 2 },
  TSLA: { name: "Tesla Inc", ratio: 15 },
  TSM: { name: "TSMC", ratio: 10 },
  TTE: { name: "TotalEnergies", ratio: 4 },
  TX: { name: "Ternium S.A.", ratio: 1 },
  TXN: { name: "Texas Instruments", ratio: 6 },
  UBER: { name: "Uber Technologies", ratio: 5 },
  UGP: { name: "Ultrapar Participações", ratio: 1 },
  UL: { name: "Unilever PLC", ratio: 3 },
  UNH: { name: "UnitedHealth Group", ratio: 14 },
  UNP: { name: "Union Pacific", ratio: 6 },
  UPST: { name: "Upstart Holdings", ratio: 4 },
  USB: { name: "U.S. Bancorp", ratio: 3 },
  V: { name: "Visa Inc", ratio: 12 },
  VALE: { name: "Vale S.A.", ratio: 1 },
  VIG: { name: "Vanguard Div. Appreciation", ratio: 39 },
  VIST: { name: "Vista Energy", ratio: 3 },
  VOD: { name: "Vodafone Group", ratio: 1 },
  VRTX: { name: "Vertex Pharmaceuticals", ratio: 101 },
  VST: { name: "Vistra Corp", ratio: 26 },
  VZ: { name: "Verizon Communications", ratio: 2 },
  WBA: { name: "Walgreens Boots", ratio: 1 },
  WFC: { name: "Wells Fargo", ratio: 3 },
  WMT: { name: "Walmart Inc", ratio: 6 },
  X: { name: "United States Steel", ratio: 2 },
  XLE: { name: "Energy Select Sector", ratio: 5 },
  XLF: { name: "Financial Select Sector", ratio: 3 },
  XOM: { name: "Exxon Mobil Corp", ratio: 4 },
  XPEV: { name: "XPeng Inc", ratio: 4 },
  XRX: { name: "Xerox Holdings", ratio: 1 },
  ZM: { name: "Zoom Video", ratio: 47 },
};

const FEE_PERCENT = 0.663;

function getRatio(ticker) {
  const d = CEDEAR_DATA[ticker];
  if (!d) return null;
  return d.ratioNum ?? d.ratio;
}

function formatRatio(ticker) {
  const d = CEDEAR_DATA[ticker];
  if (!d) return "";
  if (d.ratioLabel) return d.ratioLabel;
  return `${d.ratio}:1`;
}

/* ──────────────────────────────────────────────
   COMPONENT
   ────────────────────────────────────────────── */
export default function Home() {
  const [ticker, setTicker] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [intlPrice, setIntlPrice] = useState(null);
  const [manualIntlPrice, setManualIntlPrice] = useState("");
  const [argyPrice, setArgyPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [marketState, setMarketState] = useState("");
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const allTickers = Object.keys(CEDEAR_DATA).sort();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleTickerChange = (val) => {
    const upper = val.toUpperCase().replace(/[^A-Z.]/g, "");
    setTicker(upper);
    setSelectedTicker(null);
    setIntlPrice(null);
    setError(null);
    setHighlightIdx(-1);
    if (upper.length > 0) {
      const filtered = allTickers
        .filter(
          (t) =>
            t.startsWith(upper) ||
            CEDEAR_DATA[t].name.toUpperCase().includes(upper)
        )
        .slice(0, 10);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const fetchPrice = useCallback(async (t) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/quote?ticker=${encodeURIComponent(t)}`);
      const data = await res.json();
      if (res.ok && data.price) {
        setIntlPrice(data.price);
        setMarketState(data.marketState || "");
        setLastUpdate(
          new Date(data.timestamp).toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } else {
        setError(data.error || "No se pudo obtener el precio");
        setIntlPrice(null);
      }
    } catch {
      setError("Error de conexión. Ingresá el precio manualmente.");
      setIntlPrice(null);
    }
    setLoading(false);
  }, []);

  const selectTicker = (t) => {
    setTicker(t);
    setSelectedTicker(t);
    setShowSuggestions(false);
    setSuggestions([]);
    setHighlightIdx(-1);
    fetchPrice(t);
    // Focus argy input after selection
    setTimeout(() => {
      const argyInput = document.getElementById("argy-price-input");
      if (argyInput) argyInput.focus();
    }, 400);
  };

  // Keyboard navigation in dropdown
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightIdx >= 0) {
      e.preventDefault();
      selectTicker(suggestions[highlightIdx]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const effectiveIntlPrice =
    intlPrice ?? (manualIntlPrice ? parseFloat(manualIntlPrice) : null);
  const ratio = selectedTicker ? getRatio(selectedTicker) : null;
  const argyNum = parseFloat(argyPrice);
  const priceWithFee = argyNum ? argyNum * (1 + FEE_PERCENT / 100) : null;
  const syntheticPrice = priceWithFee && ratio ? priceWithFee * ratio : null;
  const brecha =
    syntheticPrice && effectiveIntlPrice
      ? (syntheticPrice / effectiveIntlPrice - 1) * 100
      : null;

  return (
    <div style={styles.page}>
      {/* BG grid */}
      <div style={styles.bgGrid} />
      <div style={styles.glowOrb} />
      <div style={styles.glowOrb2} />

      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerTag}>
            <div style={styles.dot} />
            <span style={styles.tagText}>CEDEAR // BRECHA CALC</span>
          </div>
          <h1 style={styles.h1}>
            Calculadora de
            <br />
            <span style={{ color: "var(--accent)" }}>Brecha CEDEAR</span>
          </h1>
          <p style={styles.subtitle}>
            Precio internacional vs precio local · Fee {FEE_PERCENT}% incluido
          </p>
        </header>

        {/* ── STEP 1: Ticker ── */}
        <section style={styles.section}>
          <label style={styles.label}>01 — TICKER</label>
          <div style={{ position: "relative" }}>
            <input
              ref={inputRef}
              type="text"
              value={ticker}
              onChange={(e) => handleTickerChange(e.target.value)}
              onFocus={() => {
                if (ticker.length > 0) setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ej: MELI, AAPL, TSLA..."
              autoComplete="off"
              style={styles.input}
            />
            {loading && <div style={styles.spinner} />}

            {showSuggestions && suggestions.length > 0 && (
              <div ref={suggestionsRef} style={styles.dropdown}>
                {suggestions.map((t, i) => (
                  <div
                    key={t}
                    onClick={() => selectTicker(t)}
                    style={{
                      ...styles.dropdownItem,
                      background:
                        i === highlightIdx
                          ? "rgba(0,255,136,0.1)"
                          : "transparent",
                    }}
                    onMouseEnter={() => setHighlightIdx(i)}
                  >
                    <div>
                      <span style={styles.dropdownTicker}>{t}</span>
                      <span style={styles.dropdownName}>
                        {CEDEAR_DATA[t].name}
                      </span>
                    </div>
                    <span style={styles.dropdownRatio}>{formatRatio(t)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── INFO CARD ── */}
        {selectedTicker && (
          <section
            style={{
              ...styles.card,
              animation: "fadeSlideIn 0.35s ease-out",
            }}
          >
            <div style={styles.cardHeader}>
              <div>
                <div style={styles.cardTicker}>{selectedTicker}</div>
                <div style={styles.cardName}>
                  {CEDEAR_DATA[selectedTicker].name}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={styles.miniLabel}>Ratio CEDEAR</div>
                <div style={styles.ratioValue}>
                  {formatRatio(selectedTicker)}
                </div>
              </div>
            </div>

            <div style={styles.cardGrid}>
              {/* Price box */}
              <div style={styles.darkBox}>
                <div style={styles.miniLabel}>Precio Internacional</div>
                {intlPrice ? (
                  <div>
                    <span style={styles.bigPrice}>
                      ${intlPrice.toFixed(2)}
                    </span>
                    <span style={styles.currLabel}>USD</span>
                    <div style={styles.meta}>
                      {marketState === "REGULAR"
                        ? "Mercado abierto"
                        : marketState === "PRE"
                        ? "Pre-market"
                        : marketState === "POST"
                        ? "After-hours"
                        : "Último cierre"}{" "}
                      · {lastUpdate}
                    </div>
                  </div>
                ) : error ? (
                  <div>
                    <input
                      type="number"
                      value={manualIntlPrice}
                      onChange={(e) => setManualIntlPrice(e.target.value)}
                      placeholder="Precio USD"
                      step="0.01"
                      style={styles.inputSmallError}
                    />
                    <div style={styles.errorText}>{error}</div>
                  </div>
                ) : (
                  <div style={{ color: "#444", fontSize: 14 }}>
                    Cargando...
                  </div>
                )}
              </div>

              {/* Fee box */}
              <div style={styles.darkBox}>
                <div style={styles.miniLabel}>Fee de operación</div>
                <span style={styles.feeValue}>{FEE_PERCENT}%</span>
              </div>
            </div>
          </section>
        )}

        {/* ── STEP 2: Argentine price ── */}
        {selectedTicker && (
          <section
            style={{ ...styles.section, animation: "fadeSlideIn 0.4s ease-out" }}
          >
            <label style={styles.label}>02 — PRECIO ARGY (USD por CEDEAR)</label>
            <input
              id="argy-price-input"
              type="number"
              value={argyPrice}
              onChange={(e) => setArgyPrice(e.target.value)}
              placeholder="Ej: 14.15"
              step="0.01"
              style={styles.inputBlue}
            />
            <p style={styles.hint}>
              El precio en USD que pagás por cada CEDEAR en el mercado argentino
            </p>
          </section>
        )}

        {/* ── STEP 3: Result ── */}
        {syntheticPrice !== null && effectiveIntlPrice !== null && brecha !== null && (
          <section
            style={{
              ...styles.resultCard,
              borderColor:
                brecha > 0
                  ? "rgba(255,60,60,0.25)"
                  : "rgba(0,255,136,0.25)",
              background:
                brecha > 0
                  ? "rgba(255,60,60,0.04)"
                  : "rgba(0,255,136,0.04)",
              animation: "fadeSlideIn 0.45s ease-out",
            }}
          >
            <div style={styles.label}>03 — RESULTADO</div>

            {/* Breakdown */}
            <div style={styles.breakdown}>
              <div style={styles.bLine}>
                <span style={styles.bLabel}>Precio argy</span>
                <span style={styles.bVal}>${argyNum.toFixed(4)}</span>
              </div>
              <div style={styles.bLine}>
                <span style={styles.bLabel}>+ Fee {FEE_PERCENT}%</span>
                <span style={{ ...styles.bVal, color: "#ff6644" }}>
                  ${priceWithFee.toFixed(4)}
                </span>
              </div>
              <div style={styles.bLine}>
                <span style={styles.bLabel}>
                  × Ratio {formatRatio(selectedTicker)}
                </span>
                <span style={{ ...styles.bVal, color: "#00aaff" }}>
                  ${syntheticPrice.toFixed(2)}
                </span>
              </div>
              <div style={styles.bDivider} />
              <div style={styles.bLine}>
                <span style={styles.bLabel}>Precio intl</span>
                <span style={styles.bVal}>
                  ${effectiveIntlPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Big brecha number */}
            <div style={styles.brechaWrap}>
              <div style={styles.brechaLabel}>BRECHA</div>
              <div
                style={{
                  ...styles.brechaNum,
                  color: brecha > 0 ? "#ff4444" : "#00ff88",
                  textShadow:
                    brecha > 0
                      ? "0 0 50px rgba(255,68,68,0.35)"
                      : "0 0 50px rgba(0,255,136,0.35)",
                }}
              >
                {brecha > 0 ? "+" : ""}
                {brecha.toFixed(2)}%
              </div>
              <div
                style={{
                  ...styles.brechaCaption,
                  color: brecha > 0 ? "#ff8888" : "#88ffbb",
                }}
              >
                {brecha > 0
                  ? `Estás pagando ${brecha.toFixed(2)}% más caro vía CEDEAR`
                  : brecha < 0
                  ? `Estás pagando ${Math.abs(brecha).toFixed(2)}% más barato vía CEDEAR`
                  : "El precio es equivalente"}
              </div>
              <div style={styles.brechaDetail}>
                Sintético:{" "}
                <span style={{ color: "#00aaff" }}>
                  ${syntheticPrice.toFixed(2)}
                </span>{" "}
                — Internacional:{" "}
                <span style={{ color: "#fff" }}>
                  ${effectiveIntlPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer style={styles.footer}>
          <div>
            Los ratios pueden cambiar. Verificá siempre en{" "}
            <a
              href="https://www.byma.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00ff88", textDecoration: "none" }}
            >
              BYMA
            </a>{" "}
            o tu broker.
          </div>
          <div style={{ marginTop: 4 }}>
            Precios vía Yahoo Finance · Fee: {FEE_PERCENT}%
          </div>
        </footer>
      </div>

      {/* Global styles */}
      <style>{`
        :root {
          --accent: #00ff88;
          --bg: #0a0a0f;
          --surface: rgba(255,255,255,0.03);
        }
        *, *::before, *::after { box-sizing: border-box; }
        body { background: var(--bg); }
        input::placeholder { color: #333; }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,255,136,0.15); border-radius: 3px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to{transform:translateY(-50%) rotate(360deg)} }
        @keyframes fadeSlideIn {
          from { opacity:0; transform:translateY(12px); }
          to { opacity:1; transform:translateY(0); }
        }
        input:focus {
          border-color: rgba(0,255,136,0.45) !important;
          box-shadow: 0 0 0 3px rgba(0,255,136,0.08);
          outline: none;
        }
      `}</style>
    </div>
  );
}

/* ──────────────────────────────────────────────
   STYLES
   ────────────────────────────────────────────── */
const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
    color: "#e0e0e0",
    position: "relative",
    overflow: "hidden",
  },
  bgGrid: {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    backgroundImage: `
      linear-gradient(rgba(0,255,136,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,136,0.025) 1px, transparent 1px)
    `,
    backgroundSize: "44px 44px",
    pointerEvents: "none",
  },
  glowOrb: {
    position: "fixed",
    top: "-18%",
    right: "-8%",
    width: 560,
    height: 560,
    background: "radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 70%)",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: 0,
  },
  glowOrb2: {
    position: "fixed",
    bottom: "-15%",
    left: "-10%",
    width: 400,
    height: 400,
    background: "radial-gradient(circle, rgba(0,100,255,0.05) 0%, transparent 70%)",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: 0,
  },
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: 700,
    margin: "0 auto",
    padding: "36px 20px",
  },
  header: { marginBottom: 48 },
  headerTag: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  dot: {
    width: 9,
    height: 9,
    borderRadius: "50%",
    background: "#00ff88",
    boxShadow: "0 0 10px #00ff88",
    animation: "pulse 2s ease-in-out infinite",
  },
  tagText: {
    fontSize: 11,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: "#00ff88",
    fontWeight: 600,
  },
  h1: {
    fontFamily: "'Space Mono', monospace",
    fontSize: "clamp(26px, 5vw, 40px)",
    fontWeight: 700,
    color: "#fff",
    lineHeight: 1.1,
    margin: "0 0 8px",
  },
  subtitle: { fontSize: 13, color: "#555", margin: 0 },
  section: { marginBottom: 28 },
  label: {
    display: "block",
    fontSize: 10,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#555",
    marginBottom: 8,
    fontWeight: 600,
  },
  input: {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid rgba(0,255,136,0.15)",
    borderRadius: 8,
    padding: "15px 18px",
    fontSize: 17,
    fontFamily: "'IBM Plex Mono', monospace",
    color: "#fff",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputBlue: {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid rgba(0,153,255,0.2)",
    borderRadius: 8,
    padding: "15px 18px",
    fontSize: 17,
    fontFamily: "'IBM Plex Mono', monospace",
    color: "#fff",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputSmallError: {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,100,100,0.3)",
    borderRadius: 6,
    padding: "10px 12px",
    fontSize: 15,
    fontFamily: "'IBM Plex Mono', monospace",
    color: "#fff",
    outline: "none",
  },
  hint: { fontSize: 11, color: "#444", marginTop: 6 },
  spinner: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: "translateY(-50%)",
    width: 18,
    height: 18,
    border: "2px solid rgba(0,255,136,0.2)",
    borderTopColor: "#00ff88",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    zIndex: 100,
    background: "#12121e",
    border: "1px solid rgba(0,255,136,0.18)",
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 320,
    overflowY: "auto",
    boxShadow: "0 24px 64px rgba(0,0,0,0.85)",
  },
  dropdownItem: {
    padding: "11px 18px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
    transition: "background 0.12s",
  },
  dropdownTicker: { color: "#00ff88", fontWeight: 600, fontSize: 14 },
  dropdownName: { color: "#555", marginLeft: 12, fontSize: 12 },
  dropdownRatio: { color: "#3a3a4a", fontSize: 12, fontWeight: 500 },
  card: {
    background: "rgba(0,255,136,0.03)",
    border: "1px solid rgba(0,255,136,0.1)",
    borderRadius: 14,
    padding: 24,
    marginBottom: 28,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 12,
  },
  cardTicker: {
    fontSize: 22,
    fontWeight: 700,
    color: "#fff",
    fontFamily: "'Space Mono', monospace",
  },
  cardName: { fontSize: 13, color: "#777", marginTop: 2 },
  miniLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: "#555",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  ratioValue: {
    fontSize: 20,
    fontWeight: 700,
    color: "#00ff88",
    fontFamily: "'Space Mono', monospace",
  },
  cardGrid: {
    marginTop: 20,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 14,
  },
  darkBox: { background: "rgba(0,0,0,0.35)", borderRadius: 8, padding: 16 },
  bigPrice: {
    fontSize: 26,
    fontWeight: 700,
    color: "#fff",
    fontFamily: "'Space Mono', monospace",
  },
  currLabel: { fontSize: 12, color: "#555", marginLeft: 5 },
  meta: { fontSize: 10, color: "#333", marginTop: 4 },
  feeValue: {
    fontSize: 26,
    fontWeight: 700,
    color: "#ff6644",
    fontFamily: "'Space Mono', monospace",
  },
  errorText: { marginTop: 8, fontSize: 11, color: "#ff6644", opacity: 0.85 },
  resultCard: {
    border: "1px solid",
    borderRadius: 16,
    padding: "28px 28px 32px",
    marginBottom: 24,
  },
  breakdown: {
    background: "rgba(0,0,0,0.35)",
    borderRadius: 10,
    padding: 18,
    marginTop: 16,
    marginBottom: 24,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 13,
  },
  bLine: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  bLabel: { color: "#777" },
  bVal: { color: "#fff", fontWeight: 500 },
  bDivider: {
    borderTop: "1px solid rgba(255,255,255,0.06)",
    margin: "8px 0",
  },
  brechaWrap: { textAlign: "center" },
  brechaLabel: {
    fontSize: 11,
    color: "#555",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  brechaNum: {
    fontSize: "clamp(44px, 10vw, 68px)",
    fontWeight: 700,
    fontFamily: "'Space Mono', monospace",
    lineHeight: 1,
  },
  brechaCaption: { marginTop: 10, fontSize: 13 },
  brechaDetail: { marginTop: 8, fontSize: 12, color: "#555" },
  footer: {
    textAlign: "center",
    padding: "36px 0 16px",
    fontSize: 11,
    color: "#2a2a2a",
  },
};
