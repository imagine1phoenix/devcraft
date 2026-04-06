import React from 'react';
import './StatsCard.css';

export default function StatsCard({ title, value, trend, trendValue, subtitle }) {
  const isBullish = trend === 'up';
  const isBearish = trend === 'down';
  
  return (
    <div className={`stats-card glass-panel ${isBullish ? 'glow-bullish' : isBearish ? 'glow-bearish' : ''}`}>
      <div className="stats-header">
        <span className="stats-title">{title}</span>
      </div>
      <div className="stats-body">
        <span className="stats-value">{value}</span>
        {trendValue && (
          <span className={`stats-trend ${isBullish ? 'bullish' : isBearish ? 'bearish' : 'neutral'}`}>
            {isBullish ? '▲' : isBearish ? '▼' : '−'} {trendValue}
          </span>
        )}
      </div>
      {subtitle && <div className="stats-footer">{subtitle}</div>}
    </div>
  );
}
