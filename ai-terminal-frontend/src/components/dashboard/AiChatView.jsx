import React, { useState, useRef, useEffect } from 'react';
import './AiChatView.css';

export default function AiChatView() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const match = userText.match(/\b[A-Z]{1,5}\b/);
      const ticker = match ? match[0] : 'NVDA';

      const res = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, stock_data: '', headlines: [] })
      });
      
      const data = await res.json();
      const aiText = typeof data === 'string' ? data : (data.analysis || data.result || JSON.stringify(data));
      
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
       console.error("API Error:", error);
       setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to your new Groq Backend. Make sure `uvicorn backend_api:app` is running!" }]);
    } finally {
       setIsLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="ai-chat-container">
      <div className="chat-top-bar">
        <div className="plan-badge">
          <span className="plan-text">Free Plan</span>
          <span className="plan-dot">•</span>
          <a href="#upgrade" className="plan-upgrade">Upgrade</a>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="chat-empty-state">
          <h1 className="chat-greeting">
            What are <span className="greeting-em">we hunting</span> today?
          </h1>
          
          <button className="surprise-btn" onClick={() => setInput('Analyze TSLA')}>Surprise Me</button>

          <div className="suggestion-cards">
            <div className="suggestion-card empty-card" onClick={() => setInput('Analyze BTC')}>
              <p>Momentum — BTC or ETH?</p>
            </div>
            <div className="suggestion-card" onClick={() => setInput('Analyze SOL')}>
              <span className="card-label">KEY LEVELS & ZONES</span>
              <p>Has SOL accepted or rejected today's value area?</p>
            </div>
            <div className="suggestion-card" onClick={() => setInput('Analyze NVDA')}>
              <span className="card-label">SMART MONEY & TRAPS</span>
              <p>Find setups where a failed breakdown turned into a recovery</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '20px 40px', paddingBottom: '100px' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
              marginBottom: '20px',
              gap: '12px'
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: m.role === 'user' ? 'rgba(232,102,10,0.2)' : '#1a0d08',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: m.role === 'ai' ? '1px solid #e8660a' : 'none',
                color: '#e8660a'
              }}>
                {m.role === 'user' ? '👤' : '🤖'}
              </div>
              <div style={{
                background: m.role === 'user' ? '#1a0d08' : 'transparent',
                border: m.role === 'user' ? '1px solid rgba(232,102,10,0.1)' : 'none',
                padding: '16px 20px',
                borderRadius: '12px',
                maxWidth: '80%',
                color: '#f0e6dc',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {m.role === 'ai' && isLoading && i === messages.length - 1 ? (
                   <span style={{color: '#a89080'}}>Analyzing market conditions with Groq...</span>
                ) : m.text}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1].role === 'user' && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: '#1a0d08', border: '1px solid #e8660a',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>🤖</div>
              <div style={{ padding: '16px 20px', color: '#a89080' }}>
                Fetching live data via yfinance and reasoning...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      )}

      <div className="chat-input-wrapper">
        <div className="chat-input-box">
          <div className="input-left-actions">
            <button className="action-icon">＋</button>
            <button className="action-icon">🎙️</button>
            <button className="action-icon" onClick={() => setInput('Analyze AAPL')}>🧠</button>
          </div>
          
          <input 
            type="text" 
            className="main-input" 
            placeholder="Start the hunt with a question or click the mic to speak" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          
          <div className="input-right-actions">
            <button className="model-selector">
              Cinder <span className="drop-icon">⌄</span>
            </button>
            <button className="send-btn" onClick={handleSend} disabled={isLoading}>
              <span className="send-arrow">↑</span>
            </button>
          </div>
        </div>
        <p className="input-footer">
          Powered by Llama-3 70B & Live Yahoo Finance Data
        </p>
      </div>

      <div className="bg-watermark">FINLYTICS</div>
    </div>
  );
}
