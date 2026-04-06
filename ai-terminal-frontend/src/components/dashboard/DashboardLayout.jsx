import React from 'react';
import './DashboardLayout.css';

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
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
