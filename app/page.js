"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ── CEDEAR DATA ── */
const CEDEAR_DATA = {
  AAL: { name: "American Airlines", ratio: 2 },
  AAPL: { name: "Apple Inc", ratio: 20 },
  ABBV: { name: "AbbVie Inc", ratio: 10 },
  ABEV: { name: "Ambev S.A.", ratioLabel: "1:3", ratioNum: 1 / 3 },
  ABT: { name: "Abbott Laboratories", ratio: 4 },
  ADBE: { name: "Adobe Inc", ratio: 44 },
  ADGO: { name: "Adecoagro S.A.", ratio: 1 },
  ADI: { name: "Analog Devices", ratio: 15 },
  ADP: { name: "Automatic Data Processing", ratio: 6 },
  ADS: { name: "Adidas AG", ratio: 22 },
  AEM: { name: "Agnico Eagle Mines", ratio: 6 },
  AIG: { name: "American Intl Group", ratio: 5 },
  AI: { name: "C3 AI Inc", ratio: 5 },
  AMAT: { name: "Applied Materials", ratio: 5 },
  AMD: { name: "Advanced Micro Devices", ratio: 10 },
  AMGN: { name: "Amgen Inc", ratio: 30 },
  AMX: { name: "América Móvil", ratio: 1 },
  AMZN: { name: "Amazon.com Inc", ratio: 144 },
  ANF: { name: "Abercrombie & Fitch", ratio: 1 },
  ARCO: { name: "Arcos Dorados", ratioLabel: "1:2", ratioNum: 0.5 },
  ASML: { name: "ASML Holding", ratio: 146 },
  ASR: { name: "Grupo Aeroportuario", ratio: 20 },
  AVGO: { name: "Broadcom Inc", ratio: 39 },
  AVY: { name: "Avery Dennison", ratio: 18 },
  AXP: { name: "American Express", ratio: 15 },
  AZN: { name: "AstraZeneca", ratio: 2 },
  BA: { name: "Boeing Co", ratio: 6 },
  BABA: { name: "Alibaba Group", ratio: 9 },
  BAC: { name: "Bank of America", ratio: 4 },
  BAS: { name: "BASF SE", ratio: 2 },
  BAYN: { name: "Bayer AG", ratio: 3 },
  BB: { name: "BlackBerry Ltd", ratio: 3 },
  BBD: { name: "Banco Bradesco", ratio: 1 },
  BBVA: { name: "Banco Bilbao Vizcaya", ratio: 1 },
  BCS: { name: "Barclays PLC", ratio: 1 },
  BHP: { name: "BHP Group", ratio: 2 },
  BIDU: { name: "Baidu Inc", ratio: 11 },
  BIIB: { name: "Biogen Inc", ratio: 13 },
  BIOX: { name: "Bioceres Crop Solutions", ratio: 1 },
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
  CVX: { name: "Chevron Corp", ratio: 16 },
  DAL: { name: "Delta Air Lines", ratio: 3 },
  DBX: { name: "Dropbox Inc", ratio: 2 },
  DD: { name: "DuPont", ratio: 3 },
  DE: { name: "Deere & Company", ratio: 20 },
  DECK: { name: "Deckers Outdoor", ratio: 25 },
  DIA: { name: "SPDR Dow Jones ETF", ratio: 72 },
  DIS: { name: "Walt Disney Co", ratio: 10 },
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
  FSLR: { name: "First Solar Inc", ratio: 18 },
  GD: { name: "General Dynamics", ratio: 5 },
  GE: { name: "GE Aerospace", ratio: 8 },
  GILD: { name: "Gilead Sciences", ratio: 5 },
  GLD: { name: "SPDR Gold Shares", ratio: 10 },
  GLW: { name: "Corning Inc", ratio: 3 },
  GM: { name: "General Motors", ratio: 2 },
  GOLD: { name: "Barrick Gold", ratio: 2 },
  GOOG: { name: "Alphabet Inc (C)", ratio: 58 },
  GOOGL: { name: "Alphabet Inc (A)", ratio: 58 },
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
  IBM: { name: "IBM Corp", ratio: 15 },
  IJH: { name: "iShares S&P Mid-Cap", ratio: 12 },
  INTC: { name: "Intel Corp", ratio: 5 },
  INTU: { name: "Intuit Inc", ratio: 24 },
  IQV: { name: "IQVIA Holdings", ratio: 10 },
  ISRG: { name: "Intuitive Surgical", ratio: 16 },
  ITUB: { name: "Itaú Unibanco", ratio: 1 },
  IWM: { name: "iShares Russell 2000", ratio: 17 },
  JD: { name: "JD.com Inc", ratio: 5 },
  JNJ: { name: "Johnson & Johnson", ratio: 15 },
  JPM: { name: "JPMorgan Chase", ratio: 10 },
  KGC: { name: "Kinross Gold", ratio: 1 },
  KMB: { name: "Kimberly-Clark", ratio: 5 },
  KO: { name: "Coca-Cola Co", ratio: 3 },
  LRCX: { name: "Lam Research", ratio: 11 },
  LLY: { name: "Eli Lilly", ratio: 28 },
  LMT: { name: "Lockheed Martin", ratio: 18 },
  LOMA: { name: "Loma Negra", ratio: 1 },
  LOW: { name: "Lowe's Companies", ratio: 10 },
  LVS: { name: "Las Vegas Sands", ratio: 3 },
  LYG: { name: "Lloyds Banking Group", ratio: 1 },
  MA: { name: "Mastercard Inc", ratio: 18 },
  MCD: { name: "McDonald's Corp", ratio: 12 },
  MELI: { name: "MercadoLibre Inc", ratio: 120 },
  META: { name: "Meta Platforms", ratio: 24 },
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
  NU: { name: "Nu Holdings", ratio: 2 },
  NVDA: { name: "NVIDIA Corp", ratio: 10 },
  NVS: { name: "Novartis AG", ratio: 5 },
  ORCL: { name: "Oracle Corp", ratio: 6 },
  OXY: { name: "Occidental Petroleum", ratio: 3 },
  PATH: { name: "UiPath Inc", ratio: 2 },
  PAM: { name: "Pampa Energía", ratio: 25 },
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
  SPY: { name: "SPDR S&P 500 ETF", ratio: 20 },
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
  WMT: { name: "Walmart Inc", ratio: 18 },
  X: { name: "United States Steel", ratio: 2 },
  XLE: { name: "Energy Select Sector", ratio: 5 },
  XLF: { name: "Financial Select Sector", ratio: 3 },
  XOM: { name: "Exxon Mobil Corp", ratio: 4 },
  XPEV: { name: "XPeng Inc", ratio: 4 },
  XRX: { name: "Xerox Holdings", ratio: 1 },
  YPF: { name: "YPF S.A.", ratio: 1 },
  ZM: { name: "Zoom Video", ratio: 47 },
};

const FEE_PERCENT = 0.663;

function getRatio(t) {
  const d = CEDEAR_DATA[t];
  return d ? (d.ratioNum ?? d.ratio) : null;
}
function formatRatio(t) {
  const d = CEDEAR_DATA[t];
  if (!d) return "";
  return d.ratioLabel || `${d.ratio}:1`;
}

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
  const [hlIdx, setHlIdx] = useState(-1);
  const [customRatio, setCustomRatio] = useState("");
  const inputRef = useRef(null);
  const ddRef = useRef(null);

  const allTickers = Object.keys(CEDEAR_DATA).sort();

  useEffect(() => {
    const h = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target) && inputRef.current && !inputRef.current.contains(e.target))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleTickerChange = (val) => {
    const upper = val.toUpperCase().replace(/[^A-Z.]/g, "");
    setTicker(upper);
    setSelectedTicker(null);
    setIntlPrice(null);
    setError(null);
    setHlIdx(-1);
    if (upper.length > 0) {
      setSuggestions(allTickers.filter((t) => t.startsWith(upper) || CEDEAR_DATA[t].name.toUpperCase().includes(upper)).slice(0, 10));
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
        setLastUpdate(new Date(data.timestamp).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }));
      } else {
        setError(data.error || "No se pudo obtener el precio");
      }
    } catch {
      setError("Error de conexión. Ingresá el precio manualmente.");
    }
    setLoading(false);
  }, []);

  const selectTicker = (t) => {
    setTicker(t);
    setSelectedTicker(t);
    setShowSuggestions(false);
    setSuggestions([]);
    setHlIdx(-1);
    setCustomRatio("");
    fetchPrice(t);
    setTimeout(() => document.getElementById("argy-input")?.focus(), 450);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || !suggestions.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHlIdx((p) => Math.min(p + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHlIdx((p) => Math.max(p - 1, 0)); }
    else if (e.key === "Enter" && hlIdx >= 0) { e.preventDefault(); selectTicker(suggestions[hlIdx]); }
    else if (e.key === "Escape") setShowSuggestions(false);
  };

  const effectiveIntl = intlPrice ?? (manualIntlPrice ? parseFloat(manualIntlPrice) : null);
  const defaultRatio = selectedTicker ? getRatio(selectedTicker) : null;
  const ratio = customRatio ? parseFloat(customRatio) : defaultRatio;
  const argyNum = parseFloat(argyPrice);
  const withFee = argyNum ? argyNum * (1 + FEE_PERCENT / 100) : null;
  const synthetic = withFee && ratio ? withFee * ratio : null;
  const brecha = synthetic && effectiveIntl ? (synthetic / effectiveIntl - 1) * 100 : null;

  const mktLabel = marketState === "REGULAR" ? "Mercado abierto" : marketState === "PRE" ? "Pre-market" : marketState === "POST" ? "After-hours" : "Último cierre";

  return (
    <div className="page">
      {/* BG layers */}
      <div className="bg-grid" />
      <div className="glow-1" />
      <div className="glow-2" />

      <main className="container">
        {/* ── HEADER ── */}
        <header className="header">
          <div className="header-tag">
            <div className="dot" />
            <span className="tag-text">CEDEAR · BRECHA CALC</span>
          </div>
          <h1 className="title">
            Calculadora de<br />
            <span className="accent">Brecha CEDEAR</span>
          </h1>
          <p className="subtitle">
            Compará el precio internacional vs lo que pagás localmente, con fee de {FEE_PERCENT}% incluido.
          </p>
        </header>

        {/* ── STEP 1: Ticker ── */}
        <section className="step">
          <label className="step-label">Elegí el ticker</label>
          <div className="input-wrap">
            <input
              ref={inputRef}
              type="text"
              value={ticker}
              onChange={(e) => handleTickerChange(e.target.value)}
              onFocus={() => ticker.length > 0 && setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="Buscá por ticker o nombre..."
              autoComplete="off"
              className="main-input"
            />
            {loading && <div className="spinner" />}
            {showSuggestions && suggestions.length > 0 && (
              <div ref={ddRef} className="dropdown">
                {suggestions.map((t, i) => (
                  <div
                    key={t}
                    onClick={() => selectTicker(t)}
                    className={`dd-item ${i === hlIdx ? "dd-active" : ""}`}
                    onMouseEnter={() => setHlIdx(i)}
                  >
                    <div className="dd-left">
                      <span className="dd-ticker">{t}</span>
                      <span className="dd-name">{CEDEAR_DATA[t].name}</span>
                    </div>
                    <span className="dd-ratio">{formatRatio(t)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── INFO PANEL ── */}
        {selectedTicker && (
          <section className="info-panel fade-in">
            <div className="info-top">
              <div>
                <div className="info-ticker">{selectedTicker}</div>
                <div className="info-name">{CEDEAR_DATA[selectedTicker].name}</div>
              </div>
              <div className="info-ratio-box">
                <div className="info-ratio-label">Ratio CEDEAR</div>
                <div className="info-ratio-row">
                  <input
                    type="number"
                    value={customRatio || (defaultRatio ?? "")}
                    onChange={(e) => setCustomRatio(e.target.value)}
                    className="ratio-input"
                    min="0.01"
                    step="1"
                  />
                  <span className="ratio-separator">: 1</span>
                </div>
                {customRatio && parseFloat(customRatio) !== defaultRatio && (
                  <button className="ratio-reset" onClick={() => setCustomRatio("")}>
                    Restaurar ({defaultRatio}:1)
                  </button>
                )}
              </div>
            </div>

            <div className="info-grid">
              <div className="info-card">
                <div className="info-card-label">Precio Internacional</div>
                {intlPrice ? (
                  <>
                    <div className="info-price">${intlPrice.toFixed(2)} <span className="info-curr">USD</span></div>
                    <div className="info-meta">{mktLabel} · {lastUpdate}</div>
                  </>
                ) : error ? (
                  <>
                    <input
                      type="number"
                      value={manualIntlPrice}
                      onChange={(e) => setManualIntlPrice(e.target.value)}
                      placeholder="Ingresá precio USD"
                      step="0.01"
                      className="manual-input"
                    />
                    <div className="error-msg">{error}</div>
                  </>
                ) : (
                  <div className="loading-text">Obteniendo precio...</div>
                )}
              </div>

              <div className="info-card">
                <div className="info-card-label">Fee de operación</div>
                <div className="info-fee">{FEE_PERCENT}%</div>
                <div className="info-meta">Se suma al precio argy</div>
              </div>
            </div>
          </section>
        )}

        {/* ── STEP 2: Argy Price ── */}
        {selectedTicker && (
          <section className="step fade-in" style={{ animationDelay: "0.08s" }}>
            <label className="step-label">Precio local del CEDEAR <span className="step-label-hint">(en USD)</span></label>
            <input
              id="argy-input"
              type="number"
              value={argyPrice}
              onChange={(e) => setArgyPrice(e.target.value)}
              placeholder="Ej: 14.15"
              step="0.01"
              className="main-input blue"
            />
            <p className="input-hint">
              El precio en dólares que ves en tu broker por cada CEDEAR
            </p>
          </section>
        )}

        {/* ── RESULTADO ── */}
        {synthetic !== null && effectiveIntl !== null && brecha !== null && (
          <section className={`result-panel fade-in ${brecha > 0 ? "result-caro" : "result-barato"}`}>
            <div className="result-title">Resultado</div>

            {/* Desglose */}
            <div className="breakdown">
              <div className="b-row">
                <span className="b-label">Precio local</span>
                <span className="b-val">${argyNum.toFixed(4)}</span>
              </div>
              <div className="b-row">
                <span className="b-label">Con fee ({FEE_PERCENT}%)</span>
                <span className="b-val b-fee">${withFee.toFixed(4)}</span>
              </div>
              <div className="b-row">
                <span className="b-label">× Ratio {ratio}:1</span>
                <span className="b-val b-synth">${synthetic.toFixed(2)}</span>
              </div>
              <div className="b-divider" />
              <div className="b-row">
                <span className="b-label">Precio internacional</span>
                <span className="b-val">${effectiveIntl.toFixed(2)}</span>
              </div>
            </div>

            {/* Brecha grande */}
            <div className="brecha-section">
              <div className="brecha-tag">BRECHA</div>
              <div className={`brecha-number ${brecha > 0 ? "brecha-red" : "brecha-green"}`}>
                {brecha > 0 ? "+" : ""}{brecha.toFixed(2)}%
              </div>
              <div className={`brecha-msg ${brecha > 0 ? "msg-red" : "msg-green"}`}>
                {brecha > 0
                  ? `Estás pagando ${brecha.toFixed(2)}% más caro vía CEDEAR`
                  : brecha < 0
                  ? `Estás pagando ${Math.abs(brecha).toFixed(2)}% más barato vía CEDEAR`
                  : "El precio es equivalente al internacional"}
              </div>
              <div className="brecha-detail">
                Sintético: <span className="detail-blue">${synthetic.toFixed(2)}</span>
                {" "} vs Internacional: <span className="detail-white">${effectiveIntl.toFixed(2)}</span>
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ── */}
        <footer className="footer">
          Los ratios pueden cambiar — verificá en{" "}
          <a href="https://www.byma.com.ar" target="_blank" rel="noopener noreferrer">BYMA</a>{" "}
          o tu broker · Precios vía Finnhub / Yahoo Finance
        </footer>
      </main>

      <style>{`
        :root {
          --accent: #00ff88;
          --bg: #08080d;
          --surface: rgba(255,255,255,0.04);
          --border: rgba(255,255,255,0.08);
          --text: #e8e8ee;
          --text2: #9999aa;
          --text3: #555566;
          --red: #ff5555;
          --orange: #ff8844;
          --blue: #44aaff;
          --font: 'IBM Plex Mono', 'SF Mono', 'Fira Code', monospace;
          --display: 'Space Mono', 'IBM Plex Mono', monospace;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; }
        body { background: var(--bg); margin: 0; }

        .page {
          min-height: 100vh;
          font-family: var(--font);
          color: var(--text);
          position: relative;
          overflow-x: hidden;
        }

        /* ── BG ── */
        .bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .glow-1 {
          position: fixed; top: -20%; right: -12%; width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 65%);
          border-radius: 50%; pointer-events: none; z-index: 0;
        }
        .glow-2 {
          position: fixed; bottom: -18%; left: -12%; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(68,170,255,0.04) 0%, transparent 65%);
          border-radius: 50%; pointer-events: none; z-index: 0;
        }

        /* ── LAYOUT ── */
        .container {
          position: relative; z-index: 1;
          max-width: 740px; margin: 0 auto;
          padding: 40px 24px 32px;
        }
        @media (max-width: 600px) {
          .container { padding: 28px 16px 24px; }
        }

        /* ── HEADER ── */
        .header { margin-bottom: 44px; }
        .header-tag { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
        .dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--accent); box-shadow: 0 0 12px var(--accent);
          animation: pulse 2s ease-in-out infinite;
        }
        .tag-text {
          font-size: 13px; letter-spacing: 3px; text-transform: uppercase;
          color: var(--accent); font-weight: 600;
        }
        .title {
          font-family: var(--display);
          font-size: clamp(30px, 6vw, 46px);
          font-weight: 700; color: #fff; line-height: 1.1;
          margin: 0 0 12px;
        }
        .accent { color: var(--accent); }
        .subtitle {
          font-size: 15px; color: var(--text2); line-height: 1.5; margin: 0;
          max-width: 520px;
        }

        /* ── STEP LABEL ── */
        .step { margin-bottom: 32px; }
        .step-label {
          display: block; font-size: 14px; font-weight: 600;
          color: var(--text); margin-bottom: 10px;
        }
        .step-label-hint { color: var(--text3); font-weight: 400; }

        /* ── INPUTS ── */
        .input-wrap { position: relative; }
        .main-input {
          width: 100%; background: var(--surface);
          border: 1.5px solid rgba(0,255,136,0.18);
          border-radius: 10px; padding: 16px 20px;
          font-size: 18px; font-family: var(--font);
          color: #fff; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .main-input:focus {
          border-color: rgba(0,255,136,0.5);
          box-shadow: 0 0 0 4px rgba(0,255,136,0.08);
        }
        .main-input.blue { border-color: rgba(68,170,255,0.22); }
        .main-input.blue:focus {
          border-color: rgba(68,170,255,0.5);
          box-shadow: 0 0 0 4px rgba(68,170,255,0.08);
        }
        .main-input::placeholder { color: #444455; }
        .input-hint { font-size: 13px; color: var(--text3); margin-top: 8px; }

        .manual-input {
          width: 100%; background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,85,85,0.3); border-radius: 8px;
          padding: 12px 14px; font-size: 16px; font-family: var(--font);
          color: #fff; outline: none;
        }
        .manual-input:focus {
          border-color: rgba(255,85,85,0.6);
          box-shadow: 0 0 0 3px rgba(255,85,85,0.08);
        }

        /* ── SPINNER ── */
        .spinner {
          position: absolute; right: 18px; top: 50%; transform: translateY(-50%);
          width: 20px; height: 20px;
          border: 2.5px solid rgba(0,255,136,0.15);
          border-top-color: var(--accent); border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        /* ── DROPDOWN ── */
        .dropdown {
          position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 100;
          background: #111118; border: 1.5px solid rgba(0,255,136,0.15);
          border-radius: 10px; max-height: 360px; overflow-y: auto;
          box-shadow: 0 24px 72px rgba(0,0,0,0.9);
        }
        .dd-item {
          padding: 14px 20px; cursor: pointer;
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.1s;
        }
        .dd-item:last-child { border-bottom: none; }
        .dd-active { background: rgba(0,255,136,0.08) !important; }
        .dd-left { display: flex; align-items: center; gap: 14px; min-width: 0; }
        .dd-ticker { color: var(--accent); font-weight: 700; font-size: 16px; }
        .dd-name {
          color: var(--text2); font-size: 14px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .dd-ratio { color: var(--text3); font-size: 14px; font-weight: 500; flex-shrink: 0; }

        /* ── INFO PANEL ── */
        .info-panel {
          background: rgba(0,255,136,0.025);
          border: 1.5px solid rgba(0,255,136,0.1);
          border-radius: 16px; padding: 28px; margin-bottom: 32px;
        }
        .info-top {
          display: flex; justify-content: space-between; align-items: flex-start;
          flex-wrap: wrap; gap: 16px; margin-bottom: 24px;
        }
        .info-ticker {
          font-family: var(--display); font-size: 28px;
          font-weight: 700; color: #fff;
        }
        .info-name { font-size: 15px; color: var(--text2); margin-top: 2px; }
        .info-ratio-box { text-align: right; }
        .info-ratio-label { font-size: 13px; color: var(--text3); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; }
        .info-ratio-row {
          display: flex; align-items: baseline; justify-content: flex-end; gap: 2px;
        }
        .ratio-input {
          width: 72px; text-align: right;
          background: rgba(0,255,136,0.08); border: 1.5px solid rgba(0,255,136,0.25);
          border-radius: 6px; padding: 6px 10px;
          font-family: var(--display); font-size: 24px; font-weight: 700;
          color: var(--accent); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ratio-input:focus {
          border-color: rgba(0,255,136,0.6);
          box-shadow: 0 0 0 3px rgba(0,255,136,0.1);
        }
        .ratio-separator {
          font-family: var(--display); font-size: 22px; font-weight: 700;
          color: var(--accent); opacity: 0.7;
        }
        .ratio-reset {
          background: none; border: none; cursor: pointer;
          font-family: var(--font); font-size: 11px; color: var(--text3);
          margin-top: 6px; padding: 0; text-decoration: underline;
          transition: color 0.15s;
        }
        .ratio-reset:hover { color: var(--accent); }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        .info-card {
          background: rgba(0,0,0,0.4); border-radius: 12px; padding: 20px;
        }
        .info-card-label {
          font-size: 13px; color: var(--text2); margin-bottom: 10px;
          text-transform: uppercase; letter-spacing: 1px; font-weight: 500;
        }
        .info-price {
          font-family: var(--display); font-size: 30px;
          font-weight: 700; color: #fff;
        }
        .info-curr { font-size: 14px; color: var(--text3); font-weight: 400; margin-left: 4px; }
        .info-meta { font-size: 13px; color: var(--text3); margin-top: 6px; }
        .info-fee {
          font-family: var(--display); font-size: 30px;
          font-weight: 700; color: var(--orange);
        }
        .loading-text { color: var(--text3); font-size: 15px; }
        .error-msg { margin-top: 10px; font-size: 13px; color: var(--red); line-height: 1.4; }

        /* ── RESULT ── */
        .result-panel {
          border: 1.5px solid; border-radius: 20px;
          padding: 32px; margin-bottom: 32px;
        }
        .result-caro {
          border-color: rgba(255,85,85,0.2);
          background: rgba(255,85,85,0.03);
        }
        .result-barato {
          border-color: rgba(0,255,136,0.2);
          background: rgba(0,255,136,0.03);
        }
        .result-title {
          font-size: 14px; font-weight: 600; color: var(--text2);
          text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;
        }

        /* breakdown */
        .breakdown {
          background: rgba(0,0,0,0.4); border-radius: 12px;
          padding: 20px 22px; margin-bottom: 28px;
        }
        .b-row {
          display: flex; justify-content: space-between;
          padding: 6px 0; font-size: 15px;
        }
        .b-label { color: var(--text2); }
        .b-val { color: #fff; font-weight: 600; }
        .b-fee { color: var(--orange); }
        .b-synth { color: var(--blue); }
        .b-divider { border-top: 1px solid rgba(255,255,255,0.07); margin: 8px 0; }

        /* brecha */
        .brecha-section { text-align: center; padding-top: 8px; }
        .brecha-tag {
          font-size: 14px; color: var(--text3); letter-spacing: 4px;
          text-transform: uppercase; margin-bottom: 8px; font-weight: 600;
        }
        .brecha-number {
          font-family: var(--display);
          font-size: clamp(52px, 12vw, 80px);
          font-weight: 700; line-height: 1;
        }
        .brecha-red { color: var(--red); text-shadow: 0 0 60px rgba(255,85,85,0.3); }
        .brecha-green { color: var(--accent); text-shadow: 0 0 60px rgba(0,255,136,0.3); }
        .brecha-msg { margin-top: 14px; font-size: 16px; line-height: 1.4; }
        .msg-red { color: #ff9999; }
        .msg-green { color: #88ffbb; }
        .brecha-detail {
          margin-top: 12px; font-size: 14px; color: var(--text3);
        }
        .detail-blue { color: var(--blue); }
        .detail-white { color: #fff; }

        /* ── FOOTER ── */
        .footer {
          text-align: center; padding: 40px 0 20px;
          font-size: 13px; color: #333344; line-height: 1.5;
        }
        .footer a { color: var(--accent); text-decoration: none; }
        .footer a:hover { text-decoration: underline; }

        /* ── ANIMATIONS ── */
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to{transform:translateY(-50%) rotate(360deg)} }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: slideUp 0.4s ease-out both; }

        /* ── MISC ── */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,255,136,0.12); border-radius: 3px; }

        /* ── MOBILE TWEAKS ── */
        @media (max-width: 480px) {
          .info-ticker { font-size: 24px; }
          .info-ratio-val { font-size: 22px; }
          .info-price, .info-fee { font-size: 26px; }
          .b-row { font-size: 14px; }
          .brecha-msg { font-size: 15px; }
          .breakdown { padding: 16px 18px; }
          .result-panel { padding: 24px 20px; }
          .info-panel { padding: 22px 18px; }
        }
      `}</style>
    </div>
  );
}
