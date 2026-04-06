import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const mockData = [
  { time: '10:00', price: 132.50 },
  { time: '11:00', price: 134.20 },
  { time: '12:00', price: 133.80 },
  { time: '13:00', price: 135.10 },
  { time: '14:00', price: 137.40 },
  { time: '15:00', price: 136.90 },
  { time: '16:00', price: 138.50 },
];

export default function ChartViewer() {
  return (
    <div className="chart-viewer glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>NVIDIA Corp (NVDA)</h2>
          <span style={{ color: 'var(--accent-bullish)', fontWeight: 600 }}>$138.50 <small>+4.5%</small></span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="timeframe-btn active">1D</button>
          <button className="timeframe-btn">1W</button>
          <button className="timeframe-btn">1M</button>
          <button className="timeframe-btn">YTD</button>
        </div>
      </div>
      <div style={{ flexGrow: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-bullish)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent-bullish)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)', fontSize: 12}} />
            <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)', fontSize: 12}} domain={['dataMin - 1', 'dataMax + 1']}/>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--accent-bullish)' }}
            />
            <Area type="monotone" dataKey="price" stroke="var(--accent-bullish)" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
