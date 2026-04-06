import React, { useEffect, useRef } from 'react';
import './FeaturesSection.css';

export default function FeaturesSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.1 }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  const agentIcons = [
    { symbol: '◉', label: 'Price Action' },
    { symbol: '⬡', label: 'Indicators' },
    { symbol: '✦', label: 'Options' },
    { symbol: '⫸', label: 'Sentiment' },
    { symbol: '◈', label: 'Volume' },
  ];

  return (
    <section className="features-section" ref={sectionRef}>
      <div className="features-inner">
        {/* Left column */}
        <div className="feature-block">
          <span className="feature-label">INHUMAN GRASP</span>
          <h3 className="feature-title">Real-time processing of global market data</h3>

          <div className="stats-list">
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">Datapoints</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Opportunities</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">30+</span>
              <span className="stat-label">Markets</span>
            </div>
          </div>

          {/* Chip visual */}
          <div className="chip-visual">
            <div className="circuit-lines">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="circuit-line" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
            <div className="chip-core">
              <div className="chip-bars">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="chip-bar" style={{
                    height: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.1}s`
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="feature-block">
          <span className="feature-label">INFINITE PERSPECTIVES</span>
          <h3 className="feature-title">Multi-agentic architecture</h3>
          <p className="feature-desc">
            Specialized analytical agents – Price Action, Indicators, Options, Sentiment – integrated into
            unified insights unmatched by humans alone.
          </p>

          {/* Agent icons grid */}
          <div className="agents-grid">
            {agentIcons.map((agent, i) => (
              <div key={i} className="agent-badge" style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
                <div className="badge-inner">
                  <span className="badge-symbol">{agent.symbol}</span>
                </div>
                <span className="badge-label">{agent.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
