import React from 'react';
import './AiChatView.css';

export default function AiChatView() {
  return (
    <div className="ai-chat-container">
      {/* Top bar inner area */}
      <div className="chat-top-bar">
        <div className="plan-badge">
          <span className="plan-text">Free Plan</span>
          <span className="plan-dot">•</span>
          <a href="#upgrade" className="plan-upgrade">Upgrade</a>
        </div>
      </div>

      {/* Main Empty State */}
      <div className="chat-empty-state">
        <h1 className="chat-greeting">
          What are <span className="greeting-em">we hunting</span> today?
        </h1>
        
        <button className="surprise-btn">Surprise Me</button>

        <div className="suggestion-cards">
          <div className="suggestion-card empty-card">
            <p>Momentum — BTC or ETH?</p>
          </div>
          <div className="suggestion-card">
            <span className="card-label">KEY LEVELS & ZONES</span>
            <p>Has SOL accepted or rejected today's value area?</p>
          </div>
          <div className="suggestion-card">
            <span className="card-label">SMART MONEY & TRAPS</span>
            <p>Find setups where a failed breakdown turned into a recovery</p>
          </div>
        </div>
      </div>

      {/* Bottom Input Area */}
      <div className="chat-input-wrapper">
        <div className="chat-input-box">
          <div className="input-left-actions">
            <button className="action-icon">＋</button>
            <button className="action-icon">🎙️</button>
            <button className="action-icon">🧠</button>
          </div>
          
          <input 
            type="text" 
            className="main-input" 
            placeholder="Start the hunt with a question or click the mic to speak" 
          />
          
          <div className="input-right-actions">
            <button className="model-selector">
              Cinder <span className="drop-icon">⌄</span>
            </button>
            <button className="send-btn">
              <span className="send-arrow">↑</span>
            </button>
          </div>
        </div>
        <p className="input-footer">
          3 free analyses daily — unlocked once your base plan is exhausted.
        </p>
      </div>

      {/* Faint background text watermark */}
      <div className="bg-watermark">FINLYTICS</div>
    </div>
  );
}
