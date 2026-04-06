import React from 'react';
import { LayoutDashboard, TrendingUp, Cpu, PieChart, Bell, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-logo">
        <Cpu className="text-gradient" size={28} />
        <span className="logo-text">AIAnalyzer</span>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/analysis" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <TrendingUp size={20} />
          <span>Analysis</span>
        </NavLink>
        <NavLink to="/portfolio" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <PieChart size={20} />
          <span>Portfolio</span>
        </NavLink>
        <div className="nav-divider"></div>
        <NavLink to="/alerts" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Bell size={20} />
          <span>Alerts</span>
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">A</div>
          <div className="user-info">
            <div className="username">Pro Trader</div>
            <div className="plan">Premium</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
