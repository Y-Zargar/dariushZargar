import React from "react";
import "./BottomBar.css";

const tools = [
  { id: "settings", icon: "⚙", label: "تنظیمات" },
  { id: "filters", icon: "◫", label: "فیلترها" },
  { id: "layers", icon: "⊟", label: "لایه‌ها" },
  { id: "export", icon: "↗", label: "خروجی" },
  { id: "history", icon: "◷", label: "تاریخچه" },
];

export default function BottomBar({ stats }) {
  return (
    <div className="bottombar glass-panel">
      <div className="bb-info">
        <span className="bb-item">
          <span className="bb-label">جریان کل:</span>
          <span className="bb-val">{stats.totalFlow}</span>
        </span>
        <span className="bb-sep">|</span>
        <span className="bb-item">
          <span className="bb-label">فشار میانگین:</span>
          <span className="bb-val">{stats.avgPressure}</span>
        </span>
        <span className="bb-sep">|</span>
        <span className="bb-item">
          <span className="bb-label">سنسورهای فعال:</span>
          <span className="bb-val">{stats.totalSensors}</span>
        </span>
      </div>

      <div className="bb-tools">
        {tools.map((t) => (
          <button key={t.id} className="bb-tool">
            <span className="bb-tool-icon">{t.icon}</span>
            <span className="bb-tool-label">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="bb-brand">
      </div>
    </div>
  );
}
