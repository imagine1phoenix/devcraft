import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600 }}>Market Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Real-time insights and portfolio performance.</p>
      </header>
      
      <div className="glass-panel flex-center" style={{ height: '400px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Dashboard Widgets (Please navigate to Analysis for the main AI feature)</p>
      </div>
    </div>
  );
}
