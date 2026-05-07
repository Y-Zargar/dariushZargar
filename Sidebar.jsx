import React from "react";
import "./Sidebar.css";
import LogoutButton from "./LogoutButton";

const typeIcon = {
  pressure: "⊕",
  flow: "≋",
  desalination: "◈",
  sewage: "⊗",
};

const typeLabel = {
  pressure: "فشارسنج",
  flow: "جریان‌سنج",
  desalination: "آب‌شیرین‌کن",
  sewage: "فاضلاب",
};

export default function Sidebar({
  sensors,
  alerts,
  stats,
  activeTab,
  setActiveTab,
  selectedSensor,
  setSelectedSensor,
}) {
  const critical = sensors.filter((s) => s.status === "critical");
  const warning = sensors.filter((s) => s.status === "warning");

  return (
    <div className="sidebar glass-panel">
      {/* Header stats */}
      <div className="sidebar-stats">
        <div className="stat-box critical">
          <span className="stat-num">{critical.length}</span>
          <span className="stat-lbl">بحرانی</span>
        </div>
        <div className="stat-box warning">
          <span className="stat-num">{warning.length}</span>
          <span className="stat-lbl">هشدار</span>
        </div>
        <div className="stat-box normal">
          <span className="stat-num">{stats.normal}</span>
          <span className="stat-lbl">نرمال</span>
        </div>
        <div className="stat-box info">
          <span className="stat-num">{stats.totalSensors}</span>
          <span className="stat-lbl">کل سنسور</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="sidebar-tabs">
        {["alerts", "sensors", "pipes"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "alerts" && "هشدارها"}
            {tab === "sensors" && "سنسورها"}
            {tab === "pipes" && "لوله‌ها"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="sidebar-content">
        {activeTab === "alerts" && (
          <div className="alerts-list">
            {alerts.map((a, i) => (
              <div key={i} className={`alert-item level-${a.level}`}>
                <div className="alert-header">
                  <span className={`alert-dot dot-${a.level}`} />
                  <span className="alert-sensor">{a.sensor}</span>
                  <span className="alert-time">{a.time}</span>
                </div>
                <div className="alert-msg">{a.msg}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "sensors" && (
          <div className="sensors-list">
            {/* Critical first */}
            {critical.length > 0 && (
              <div className="group-label critical-label">⚠ بحرانی</div>
            )}
            {critical.map((s) => (
              <SensorRow
                key={s.id}
                sensor={s}
                selected={selectedSensor?.id === s.id}
                onClick={() =>
                  setSelectedSensor(selectedSensor?.id === s.id ? null : s)
                }
              />
            ))}
            {warning.length > 0 && (
              <div className="group-label warning-label">◉ هشدار</div>
            )}
            {warning.map((s) => (
              <SensorRow
                key={s.id}
                sensor={s}
                selected={selectedSensor?.id === s.id}
                onClick={() =>
                  setSelectedSensor(selectedSensor?.id === s.id ? null : s)
                }
              />
            ))}
            <div className="group-label normal-label">✓ نرمال</div>
            {sensors
              .filter((s) => s.status === "normal")
              .map((s) => (
                <SensorRow
                  key={s.id}
                  sensor={s}
                  selected={selectedSensor?.id === s.id}
                  onClick={() =>
                    setSelectedSensor(selectedSensor?.id === s.id ? null : s)
                  }
                />
              ))}
          </div>
        )}

        {activeTab === "pipes" && (
          <div className="pipes-info">
            <div className="pipe-stat-grid">
              <div className="pipe-stat">
                <span className="ps-val">{stats.totalFlow}</span>
                <span className="ps-lbl">جریان کل</span>
              </div>
              <div className="pipe-stat">
                <span className="ps-val">{stats.avgPressure}</span>
                <span className="ps-lbl">فشار میانگین</span>
              </div>
            </div>
            <div className="pipes-note">
              <div className="legend-item">
                <span className="legend-line critical-line" />
                <span>لوله بحرانی</span>
              </div>
              <div className="legend-item">
                <span className="legend-line warning-line" />
                <span>لوله هشدار</span>
              </div>
              <div className="legend-item">
                <span className="legend-line normal-line" />
                <span>لوله نرمال</span>
              </div>
            </div>
            <p className="pipes-desc">
              شبکه لوله‌کشی قشم شامل ۷ خط اصلی با مجموع ۱۲.۴ کیلومتر طول است.
              ۲ خط در وضعیت بحرانی، ۲ خط نیاز به بررسی و ۳ خط در وضعیت نرمال
              می‌باشند.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="health-bar-wrap">
          <div className="health-bar-label">
            <span>سلامت شبکه</span>
            <span className="health-pct">{stats.networkHealth}%</span>
          </div>
          <div className="health-bar">
            <div
              className="health-fill"
              style={{ width: `${stats.networkHealth}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SensorRow({ sensor, selected, onClick }) {
  const typeIcon = {
    pressure: "⊕",
    flow: "≋",
    desalination: "◈",
    sewage: "⊗",
  };
  const typeLabel = {
    pressure: "فشارسنج",
    flow: "جریان‌سنج",
    desalination: "آب‌شیرین‌کن",
    sewage: "فاضلاب",
  };

  return (
    <div
      className={`sensor-row status-${sensor.status} ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="sensor-row-left">
        <span className={`sensor-status-dot dot-${sensor.status}`} />
        <div>
          <div className="sensor-row-name">{sensor.name}</div>
          <div className="sensor-row-meta">
            <span className="sensor-type-tag">{typeLabel[sensor.type]}</span>
            <span className="sensor-zone">{sensor.zone}</span>
          </div>
        </div>
      </div>
      <div className="sensor-row-right">
        <div className="sensor-mini-val">{sensor.pressure.toFixed(1)}</div>
        <div className="sensor-mini-lbl">bar</div>
      </div>
    </div>
  );
  
}

<div className="logout-sidebar-wrap">
  <LogoutButton />
</div>