import React from 'react';
import ChartViewer from '../components/ChartViewer';
import StatsCard from '../components/StatsCard';
import AiAssistant from '../components/AiAssistant';
import './Analysis.css';

export default function Analysis() {
  return (
    <div className="analysis-page">
      <header className="page-header">
        <h1>Market Intelligence System</h1>
        <p>AI-Powered insights for NVDA</p>
      </header>

      <div className="analysis-grid">
        <div className="main-col">
          <div className="chart-container">
            <ChartViewer />
          </div>
          
          <div className="stats-grid">
            <StatsCard title="P/E Ratio" value="64.5" trend="down" trendValue="1.2%" subtitle="Slightly overvalued compared to sector" />
            <StatsCard title="Revenue Growth" value="+265%" trend="up" trendValue="12%" subtitle="Massive YoY AI hardware demand" />
            <StatsCard title="EPS" value="$1.18" trend="up" trendValue="Beat by $0.08" subtitle="Strong earnings report" />
            <StatsCard title="AI Sentiment" value="BULLISH" trend="up" trendValue="94/100" subtitle="Based on recent earnings call" />
          </div>
        </div>

        <div className="side-col">
          <AiAssistant />
        </div>
      </div>
    </div>
  );
}
