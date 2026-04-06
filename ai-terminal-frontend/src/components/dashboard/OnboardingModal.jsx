import React, { useState } from 'react';
import './OnboardingModal.css';

export default function OnboardingModal({ currentStep, onNext }) {
  if (currentStep > 4) return null; // Modal closes after step 4

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="modal-content text-center">
            <h2 className="modal-title">Disclaimer</h2>
            <div className="disclaimer-text">
              <p>FINLYTICS and its creators are not investment advisers and do not provide financial advice.</p>
              <p>FINLYTICS uses large language models and, despite safeguards, may produce statements that resemble trading recommendations; these are not instructions or solicitations.</p>
              <p>Markets involve risk, including loss of principal. Use your own judgment, do your own research, and consider consulting a licensed financial professional.</p>
            </div>
            <button className="primary-btn full-width" onClick={onNext}>
              I Understand
            </button>
            <p className="modal-footer-text">By clicking "I understand", you agree to this disclaimer.</p>
          </div>
        );

      case 2:
        return (
          <div className="modal-content form-step">
            <h2 className="modal-title">Before <em>the hunt</em></h2>
            <p className="modal-sub">Set your primary market and risk parameters. (You can change these anytime in your profile.)</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Which market do you primarily trade? *</label>
                <select defaultValue="">
                  <option value="" disabled>Choose primary market</option>
                  <option value="crypto">Crypto</option>
                  <option value="stocks">Stocks / Equities</option>
                  <option value="forex">Forex</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Trading Capital</label>
                <div className="input-group">
                  <select className="currency-select" defaultValue="usd">
                    <option value="usd">Currency</option>
                    <option value="eur">EUR</option>
                  </select>
                  <input type="text" placeholder="e.g. 20,000" />
                </div>
              </div>

              <div className="form-group">
                <label>Daily Risk Limit (1-100%)</label>
                <input type="number" placeholder="e.g. 20" />
              </div>

              <div className="form-group">
                <label>Risk per Trade (1-100%)</label>
                <input type="number" placeholder="e.g. 20" />
              </div>

              <div className="form-group">
                <label>Target Risk-to-Reward Ratio</label>
                <select defaultValue="">
                  <option value="" disabled>Choose risk-to-reward ratio</option>
                  <option value="1:2">1:2</option>
                  <option value="1:3">1:3</option>
                </select>
              </div>

              <div className="form-group">
                <label>Pick your Timezone *</label>
                <select defaultValue="">
                  <option value="" disabled>Select a timezone</option>
                  <option value="est">EST - Eastern Time</option>
                  <option value="utc">UTC</option>
                </select>
              </div>
            </div>

            <button className="primary-btn" onClick={onNext} style={{ marginTop: '20px' }}>
              Lock In
            </button>
          </div>
        );

      case 3:
        return (
          <div className="modal-content intent-step">
            <h2 className="modal-title text-center">Welcome <em>to</em><br/><span className="brand-pixel">FINLYTICS</span></h2>
            <p className="modal-sub text-center">What brings you here? (Choose one)</p>
            
            <div className="intent-grid">
              <label className="intent-card">
                <input type="radio" name="intent" />
                <div className="card-inner">
                  <h4>FIND MY NEXT TRADE</h4>
                  <p>Scan for setups and opportunities.</p>
                </div>
              </label>

              <label className="intent-card">
                <input type="radio" name="intent" />
                <div className="card-inner">
                  <h4>DEEP-DIVE SOMETHING I'M WATCHING</h4>
                  <p>Full analysis on a stock or index</p>
                </div>
              </label>

              <label className="intent-card">
                <input type="radio" name="intent" />
                <div className="card-inner">
                  <h4>HELP WITH A LIVE POSITION</h4>
                  <p>I have a trade on — what should I watch?</p>
                </div>
              </label>

              <label className="intent-card">
                <input type="radio" name="intent" />
                <div className="card-inner">
                  <h4>LEARN HOW MARKETS WORK</h4>
                  <p>Understand what moves price and why.</p>
                </div>
              </label>
            </div>

            <label className="intent-card full-width-card" style={{ marginTop: '12px' }}>
              <input type="radio" name="intent" />
              <div className="card-inner">
                <h4>SOMETHING ELSE</h4>
                <input type="text" placeholder="Type what you're looking for..." className="intent-input" />
              </div>
            </label>

            <button className="primary-btn" onClick={onNext} style={{ marginTop: '24px' }}>
              Lets Go
            </button>
          </div>
        );

      case 4:
        return (
          <div className="modal-content prompt-step">
            <h2 className="modal-title">You're <em>set.</em></h2>
            <p className="modal-sub">Pick a deep-dive prompt — or edit it before sending:</p>
            
            <div className="prompt-list">
              <button className="prompt-item" onClick={onNext}>
                Are buyers or sellers in control on BTC right now?
              </button>
              <button className="prompt-item" onClick={onNext}>
                What's going on with ETH — give me the full picture
              </button>
              <button className="prompt-item" onClick={onNext}>
                What's the microstructure telling us about SOL today?
              </button>
              <button className="prompt-item" onClick={onNext}>
                Is BTC trading inside or outside its value area?
              </button>
            </div>

            <div className="chat-input-box modal-chat-input">
              <div className="input-left-actions">
                <button className="action-icon">＋</button>
                <button className="action-icon">🎙️</button>
                <button className="action-icon">🧠</button>
              </div>
              <input type="text" className="main-input" placeholder="Choose one from above suggested prompts" />
              <div className="input-right-actions">
                <button className="model-selector">Cinder <span>⌄</span></button>
                <button className="send-btn" onClick={onNext}>↑</button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-backdrop">
      <div className={`onboarding-modal step-${currentStep}`}>
        {renderContent()}
      </div>
    </div>
  );
}
