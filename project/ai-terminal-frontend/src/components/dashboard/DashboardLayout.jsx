import React from 'react';
import './DashboardLayout.css';

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      {/* Animated Ambient Background */}
      <div className="dashboard-ambient-bg">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      {/* Faint Grid Overlay */}
      <div className="dashboard-grid-overlay"></div>

      {/* Persistent Sidebar */}
      <nav className="dashboard-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <span className="brand-logo">⬡</span>
            <span className="brand-version">v2.237</span>
          </div>
          
          <button className="sidebar-action-btn">
            <span className="plus-icon">+</span>
          </button>
          
          <button className="sidebar-icon-btn active">
            ⏳
          </button>
        </div>

        <div className="sidebar-bottom">
          <button className="sidebar-icon-btn">🔌</button>
          <button className="sidebar-icon-btn">👥</button>
          <button className="sidebar-icon-btn">📖</button>
          <button className="sidebar-icon-btn highlight">💲</button>
          <div className="sidebar-avatar">
            <div className="avatar-circle">👤</div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {children}
      </main>
      
      {/* Feedback Button on right side */}
      <div className="feedback-badge">Feedback</div>
    </div>
  );
}
