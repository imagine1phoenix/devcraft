import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

/* ─── Mock Data ─── */
const WATCHLIST = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: '138.50', change: '+4.52%', up: true },
  { symbol: 'AAPL', name: 'Apple Inc', price: '228.14', change: '+1.23%', up: true },
  { symbol: 'TSLA', name: 'Tesla Inc', price: '178.02', change: '-2.15%', up: false },
  { symbol: 'RELIANCE', name: 'Reliance Ind', price: '2,841', change: '+0.87%', up: true },
  { symbol: 'HDFC', name: 'HDFC Bank', price: '1,612', change: '-0.34%', up: false },
  { symbol: 'META', name: 'Meta Platforms', price: '521.30', change: '+3.17%', up: true },
];

const ALERTS = [
  { type: 'bullish', title: 'NVDA Breakout', desc: 'Price crossed above 200 DMA with volume surge', time: '2m ago' },
  { type: 'bearish', title: 'TSLA Divergence', desc: 'RSI bearish divergence on 1H chart', time: '8m ago' },
  { type: 'bullish', title: 'AAPL Support', desc: 'Bounced off key support at $225', time: '15m ago' },
  { type: 'info', title: 'Earnings Alert', desc: 'META earnings report after market close today', time: '1h ago' },
  { type: 'bearish', title: 'Sector Rotation', desc: 'Tech sector seeing unusual selling pressure', time: '2h ago' },
];

const SCREENER_RESULTS = [
  { symbol: 'NVDA', pattern: 'Bullish Breakout', strength: 94, signal: 'BUY' },
  { symbol: 'AMD', pattern: 'Cup & Handle', strength: 87, signal: 'BUY' },
  { symbol: 'GOOGL', pattern: 'Golden Cross', strength: 82, signal: 'BUY' },
  { symbol: 'TSLA', pattern: 'Head & Shoulders', strength: 76, signal: 'SELL' },
  { symbol: 'NFLX', pattern: 'Ascending Triangle', strength: 71, signal: 'BUY' },
];

/* ─── Sidebar Tabs ─── */
const TABS = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'charts', icon: '📈', label: 'Charts' },
  { id: 'scanner', icon: '🔍', label: 'Scanner' },
  { id: 'alerts', icon: '🔔', label: 'Alerts' },
  { id: 'ai', icon: '🤖', label: 'AI Analysis' },
];

/* ─── Mini Sparkline ─── */
function Sparkline({ up }) {
  const pts = Array.from({ length: 20 }, (_, i) => {
    const trend = up ? i * 1.5 : (20 - i) * 1.5;
    return trend + Math.random() * 8;
  });
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const h = 28, w = 60;
  const path = pts.map((p, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((p - min) / (max - min)) * h;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <path d={path} fill="none" stroke={up ? '#00e676' : '#ff1744'} strokeWidth="1.5" />
    </svg>
  );
}

/* ─── Dashboard View ─── */
function DashboardView({ onSearch }) {
  return (
    <div className="dash-view">
      <div className="dash-header">
        <div>
          <h3 className="dash-greeting">Good Morning, Trader</h3>
          <p className="dash-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="market-status">
          <span className="status-dot live" />
          <span>Markets Open</span>
        </div>
      </div>

      {/* Market indices */}
      <div className="indices-row">
        {[
          { name: 'S&P 500', val: '5,482.30', ch: '+0.83%', up: true },
          { name: 'NASDAQ', val: '17,321.50', ch: '+1.12%', up: true },
          { name: 'NIFTY 50', val: '22,756', ch: '-0.24%', up: false },
          { name: 'BTC/USD', val: '68,241', ch: '+2.41%', up: true },
        ].map((idx, i) => (
          <div key={i} className="index-card">
            <span className="index-name">{idx.name}</span>
            <span className="index-val">{idx.val}</span>
            <span className={`index-change ${idx.up ? 'up' : 'down'}`}>{idx.ch}</span>
          </div>
        ))}
      </div>

      {/* Watchlist */}
      <div className="dash-section">
        <h4 className="section-title">Watchlist</h4>
        <div className="watchlist-table">
          <div className="wl-header">
            <span>Symbol</span><span>Price</span><span>Change</span><span>Trend</span>
          </div>
          {WATCHLIST.map((s, i) => (
            <div key={i} className="wl-row" onClick={() => onSearch(s.symbol)}>
              <span className="wl-symbol">
                <strong>{s.symbol}</strong>
                <small>{s.name}</small>
              </span>
              <span className="wl-price">${s.price}</span>
              <span className={`wl-change ${s.up ? 'up' : 'down'}`}>{s.change}</span>
              <span><Sparkline up={s.up} /></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Charts View ─── */
function ChartsView() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const cw = canvas.offsetWidth, ch = canvas.offsetHeight;

    // Generate candlestick data
    const candles = [];
    let price = 130;
    for (let i = 0; i < 40; i++) {
      const open = price;
      const close = open + (Math.random() - 0.45) * 5;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;
      candles.push({ open, close, high, low });
      price = close;
    }

    const pMin = Math.min(...candles.map(c => c.low)) - 2;
    const pMax = Math.max(...candles.map(c => c.high)) + 2;
    const barW = (cw - 80) / candles.length;

    // Grid
    ctx.strokeStyle = 'rgba(232,102,10,0.06)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = 30 + ((ch - 60) / 5) * i;
      ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(cw - 10, y); ctx.stroke();
      ctx.fillStyle = '#6b5548';
      ctx.font = '10px Inter';
      ctx.fillText((pMax - ((pMax - pMin) / 5) * i).toFixed(1), 10, y + 4);
    }

    // Candles
    candles.forEach((c, i) => {
      const x = 60 + i * barW + barW / 2;
      const yH = 30 + ((pMax - c.high) / (pMax - pMin)) * (ch - 60);
      const yL = 30 + ((pMax - c.low) / (pMax - pMin)) * (ch - 60);
      const yO = 30 + ((pMax - c.open) / (pMax - pMin)) * (ch - 60);
      const yC = 30 + ((pMax - c.close) / (pMax - pMin)) * (ch - 60);
      const bull = c.close >= c.open;

      ctx.strokeStyle = bull ? '#00e676' : '#ff1744';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, yH); ctx.lineTo(x, yL); ctx.stroke();

      ctx.fillStyle = bull ? '#00e676' : '#ff1744';
      const bodyTop = Math.min(yO, yC);
      const bodyH = Math.max(Math.abs(yO - yC), 1);
      ctx.fillRect(x - barW * 0.35, bodyTop, barW * 0.7, bodyH);
    });

    // Moving average line
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(232,102,10,0.6)';
    ctx.lineWidth = 1.5;
    const maWindow = 7;
    for (let i = maWindow; i < candles.length; i++) {
      const avg = candles.slice(i - maWindow, i).reduce((s, c) => s + c.close, 0) / maWindow;
      const x = 60 + i * barW + barW / 2;
      const y = 30 + ((pMax - avg) / (pMax - pMin)) * (ch - 60);
      if (i === maWindow) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, []);

  return (
    <div className="charts-view">
      <div className="chart-toolbar">
        <div className="chart-ticker">
          <strong>NVDA</strong>
          <span className="ticker-price">$138.50</span>
          <span className="ticker-change up">+4.52%</span>
        </div>
        <div className="chart-timeframes">
          {['1m', '5m', '15m', '1H', '4H', '1D'].map((tf, i) => (
            <button key={tf} className={`tf-btn ${i === 3 ? 'active' : ''}`}>{tf}</button>
          ))}
        </div>
        <div className="chart-indicators">
          <button className="ind-btn active">MA</button>
          <button className="ind-btn">RSI</button>
          <button className="ind-btn">MACD</button>
          <button className="ind-btn">Vol</button>
        </div>
      </div>
      <canvas ref={canvasRef} className="chart-canvas" />
    </div>
  );
}

/* ─── Scanner View ─── */
function ScannerView() {
  return (
    <div className="scanner-view">
      <div className="scanner-header">
        <h4>Pattern Scanner</h4>
        <div className="scanner-filters">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">Bullish</button>
          <button className="filter-btn">Bearish</button>
        </div>
      </div>
      <div className="scanner-table">
        <div className="sc-header">
          <span>Stock</span><span>Pattern</span><span>Strength</span><span>Signal</span>
        </div>
        {SCREENER_RESULTS.map((r, i) => (
          <div key={i} className="sc-row">
            <span className="sc-symbol">{r.symbol}</span>
            <span className="sc-pattern">{r.pattern}</span>
            <span className="sc-strength">
              <div className="strength-bar">
                <div className="strength-fill" style={{ width: `${r.strength}%`, background: r.strength > 80 ? '#00e676' : r.strength > 60 ? '#ffd600' : '#ff1744' }} />
              </div>
              <small>{r.strength}%</small>
            </span>
            <span className={`sc-signal ${r.signal === 'BUY' ? 'buy' : 'sell'}`}>{r.signal}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Alerts View ─── */
function AlertsView() {
  return (
    <div className="alerts-view">
      <h4>Smart Alerts</h4>
      <div className="alerts-list">
        {ALERTS.map((a, i) => (
          <div key={i} className={`alert-item ${a.type}`}>
            <div className="alert-dot" />
            <div className="alert-body">
              <strong>{a.title}</strong>
              <p>{a.desc}</p>
            </div>
            <span className="alert-time">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── AI View ─── */
function AIView() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Welcome! I'm your AI trading mentor. Ask me about any stock — technical analysis, fundamentals, or earnings insights." },
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const q = input;
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setInput('');
    setIsLoading(true);

    try {
      // Find a ticker, default NVDA
      const match = q.match(/\b[A-Z]{1,5}\b/);
      const ticker = match ? match[0] : 'NVDA';

      const res = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          ticker: ticker,
          stock_data: '',
          headlines: []
        })
      });
      
      const data = await res.json();
      const aiText = typeof data === 'string' ? data : (data.analysis || data.result || JSON.stringify(data));
      
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
       console.error("AI Analysis failed:", error);
       setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I couldn't connect to Google Colab. Make sure your ngrok tunnel is still running!" }]);
    } finally {
       setIsLoading(false);
    }
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <div className="ai-view">
      <div className="ai-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.role === 'ai' && <span className="ai-dot" />}
            <p>{m.text}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="ai-input-bar">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about any stock..."
        />
        <button onClick={handleSend} className="ai-send">↑</button>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════
   HERO SECTION (Main Component)
   ═══════════════════════════════════════ */
export default function HeroSection() {
  const canvasRef = useRef(null);
  const zoomContainerRef = useRef(null);
  const dashboardRef = useRef(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchVal, setSearchVal] = useState('');

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.offsetWidth;
        this.y = Math.random() * 120;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = Math.random() * 0.3 + 0.05;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;
      }
      update() {
        this.y += this.speedY; this.x += this.speedX; this.life++;
        if (this.life > this.maxLife) this.opacity -= 0.02;
        if (this.opacity <= 0 || this.y > 150) { this.reset(); this.y = 0; }
      }
      draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 102, 10, ${this.opacity})`; ctx.fill();
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 102, 10, ${this.opacity * 0.1})`; ctx.fill();
      }
    }
    for (let i = 0; i < 150; i++) particles.push(new Particle());
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      particles.forEach(p => { p.update(); p.draw(); });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, []);

  // Scroll-driven zoom effect
  useEffect(() => {
    const handleScroll = () => {
      const container = zoomContainerRef.current;
      const dashboard = dashboardRef.current;
      if (!container || !dashboard) return;

      const rect = container.getBoundingClientRect();
      const scrolled = -rect.top;
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, scrolled / scrollable));

      // Get the actual rendered size of the dashboard element
      const dashRect = dashboard.getBoundingClientRect();
      // We need the un-scaled dimensions — divide by current scale
      const currentTransform = dashboard.style.transform;
      const currentScale = currentTransform ? parseFloat(currentTransform.match(/scale\(([^)]+)\)/)?.[1] || 1) : 1;
      const dw = dashRect.width / currentScale;
      const dh = dashRect.height / currentScale;

      // Calculate the exact scale needed to fill 100% viewport
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scaleX = vw / dw;
      const scaleY = vh / dh;
      const maxScale = Math.max(scaleX, scaleY) * 1.005; // tiny buffer to avoid sub-pixel gaps

      let s = 1, br = 20, titleOp = 1, borderOp = 1, navOp = 1;

      if (progress <= 0.35) {
        // Zoom IN phase
        const t = progress / 0.35;
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        s = 1 + (maxScale - 1) * e;
        br = 20 * (1 - e);
        titleOp = Math.max(0, 1 - t * 3);
        borderOp = 1 - e;
        navOp = Math.max(0, 1 - t * 2.5);
      } else if (progress <= 0.65) {
        // HOLD phase — fully immersive fullscreen
        s = maxScale;
        br = 0;
        titleOp = 0;
        borderOp = 0;
        navOp = 0;
      } else {
        // Zoom OUT phase
        const t = (progress - 0.65) / 0.35;
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        s = maxScale - (maxScale - 1) * e;
        br = 20 * e;
        titleOp = Math.min(1, t * 2);
        borderOp = e;
        navOp = Math.min(1, t * 2);
      }

      dashboard.style.transform = `scale(${s})`;
      dashboard.style.borderRadius = `${br}px`;
      dashboard.style.borderColor = borderOp > 0.01 ? `rgba(232,102,10,${0.25 * borderOp})` : 'transparent';

      // Hide hero text
      const title = document.querySelector('.hero-title');
      const btn = document.querySelector('.access-btn');
      if (title) title.style.opacity = titleOp;
      if (btn) btn.style.opacity = titleOp;

      // Hide/show the site navbar so dashboard is truly fullscreen
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        navbar.style.opacity = navOp;
        navbar.style.pointerEvents = navOp < 0.1 ? 'none' : 'auto';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      // Restore navbar on unmount
      const navbar = document.querySelector('.navbar');
      if (navbar) { navbar.style.opacity = 1; navbar.style.pointerEvents = 'auto'; }
    };
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchVal(typeof term === 'string' ? term : '');
    if (typeof term === 'string') setActiveTab('charts');
  }, []);

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView onSearch={handleSearch} />;
      case 'charts': return <ChartsView />;
      case 'scanner': return <ScannerView />;
      case 'alerts': return <AlertsView />;
      case 'ai': return <AIView />;
      default: return <DashboardView onSearch={handleSearch} />;
    }
  };

  return (
    <section className="hero-section">
      <canvas ref={canvasRef} className="particle-canvas" />

      <div className="hero-content">
        <h1 className="hero-title">
          <span className="title-line">Your mind is the strategy.</span>
          <span className="title-line">This is the <em>weapon.</em></span>
        </h1>
      </div>

      <div className="zoom-scroll-container" ref={zoomContainerRef}>
        <div className="zoom-sticky-wrapper">
          <div className="dashboard-preview" ref={dashboardRef}>

            {/* Sidebar */}
            <div className="preview-sidebar">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`sidebar-icon ${activeTab === tab.id ? 'active' : ''}`}
                  title={tab.label}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="sb-emoji">{tab.icon}</span>
                  <span className="sb-label">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Main content area */}
            <div className="preview-main">
              {/* Top bar */}
              <div className="topbar">
                <div className="topbar-left">
                  <span className="topbar-brand">FINLYTICS</span>
                  <span className="topbar-sep">|</span>
                  <span className="topbar-tab">{TABS.find(t => t.id === activeTab)?.label}</span>
                </div>
                <div className="topbar-search">
                  <input
                    type="text"
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && searchVal) handleSearch(searchVal); }}
                    placeholder="Search stocks, patterns, news..."
                  />
                  <button onClick={() => searchVal && handleSearch(searchVal)}>⏎</button>
                </div>
              </div>

              {/* View content */}
              <div className="view-content">
                {renderView()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-content post-zoom-content">
        <Link to="/dashboard" className="access-btn">Access Now</Link>
      </div>
    </section>
  );
}
