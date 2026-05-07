import React from "react";
import "./TopBar.css";

const filters = [
  { id: "all", label: "همه", count: 10 },
  { id: "critical", label: "بحرانی", count: 2 },
  { id: "warning", label: "هشدار", count: 3 },
  { id: "normal", label: "نرمال", count: 5 },
];

export default function TopBar({
  stats,
  activeFilter,
  setActiveFilter,
}) {
  return (
    <div className="topbar glass-panel">
      {/* Logo */}
      <div className="topbar-logo">
        <div className="logo-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="12" stroke="#00c8ff" strokeWidth="1.5" />
            <circle cx="14" cy="14" r="7" stroke="#00c8ff" strokeWidth="1" strokeDasharray="3 2" />
            <circle cx="14" cy="14" r="2.5" fill="#00c8ff" />
            <line x1="14" y1="2" x2="14" y2="6" stroke="#00c8ff" strokeWidth="1.5" />
            <line x1="14" y1="22" x2="14" y2="26" stroke="#00c8ff" strokeWidth="1.5" />
            <line x1="2" y1="14" x2="6" y2="14" stroke="#00c8ff" strokeWidth="1.5" />
            <line x1="22" y1="14" x2="26" y2="14" stroke="#00c8ff" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="logo-text">
          <span className="logo-main">داریوش زرگر</span>
          <span className="logo-sub">پایش هوشمند آب قشم</span>
        </div>
      </div>

      {/* Filters */}
      <div className="topbar-filters">
        {filters.map((f) => (
          <button
            key={f.id}
            className={`filter-btn filter-${f.id} ${
              activeFilter === f.id ? "active" : ""
            }`}
            onClick={() => setActiveFilter(f.id)}
          >
            <span className={`filter-dot dot-${f.id}`} />
            <span className="filter-label">{f.label}</span>
            <span className="filter-count">{f.count}</span>
          </button>
        ))}
      </div>

      {/* Status Bar */}
      <div className="topbar-status">
        <div className="status-item">
          <span className="live-badge">
            <span className="live-dot" />
            LIVE
          </span>
        </div>

        <div className="status-item">
          <span className="status-label">سلامت شبکه</span>
          <span className="status-val health">{stats.networkHealth}%</span>
        </div>

        <div className="status-item">
          <span className="status-label">هشدار امروز</span>
          <span className="status-val warn">{stats.alertsToday}</span>
        </div>
      </div>
    </div>
  );
}