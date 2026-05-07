import React, { useEffect, useState } from "react";
import "./SensorPanel.css";

const STATUS_FA = {
  critical: "بحرانی",
  warning: "هشدار",
  normal: "نرمال",
};

const TYPE_FA = {
  pressure: "فشارسنج",
  flow: "جریان‌سنج",
  desalination: "آب‌شیرین‌کن",
  sewage: "فاضلاب",
};

// Mini sparkline generator
function Sparkline({ status }) {
  const points = Array.from({ length: 20 }, (_, i) => {
    const base = status === "critical" ? 30 : status === "warning" ? 50 : 70;
    const noise = (Math.random() - 0.5) * 20;
    const y = 80 - (base + noise);
    return `${i * 5},${Math.max(5, Math.min(75, y))}`;
  });

  const color =
    status === "critical" ? "#ff2d55" : status === "warning" ? "#ffb800" : "#00e676";

  return (
    <svg viewBox="0 0 95 80" className="sparkline" preserveAspectRatio="none">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
}

function GaugeBar({ value, max = 6, status }) {
  const pct = Math.min(100, (value / max) * 100);
  const color =
    status === "critical" ? "#ff2d55" : status === "warning" ? "#ffb800" : "#00e676";

  return (
    <div className="gauge-wrap">
      <div className="gauge-track">
        <div
          className="gauge-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="gauge-max">{max}</span>
    </div>
  );
}

export default function SensorPanel({ sensor, onClose }) {
  const [history] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      time: `${14 - i}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
      pressure: (sensor.pressure + (Math.random() - 0.5) * 0.8).toFixed(2),
      flow: (sensor.flow + (Math.random() - 0.5) * 2).toFixed(1),
    }))
  );

  return (
    <div className="sensor-panel glass-panel">
      {/* Header */}
      <div className="sp-header">
        <div className="sp-title-wrap">
          <span className={`sp-status-badge badge-${sensor.status}`}>
            {STATUS_FA[sensor.status]}
          </span>
          <span className="sp-id">{sensor.id}</span>
        </div>
        <button className="sp-close" onClick={onClose}>✕</button>
      </div>

      <div className="sp-name">{sensor.name}</div>
      <div className="sp-meta">
        <span className="sp-tag">{TYPE_FA[sensor.type]}</span>
        <span className="sp-tag">{sensor.zone}</span>
        <span className="sp-tag live">● آنلاین</span>
      </div>

      {/* Alert box */}
      {sensor.alert && (
        <div className={`sp-alert alert-${sensor.status}`}>
          <span className="sp-alert-icon">⚠</span>
          <span>{sensor.alert}</span>
        </div>
      )}

      {/* Main metrics */}
      <div className="sp-metrics">
        <div className="sp-metric">
          <div className="metric-val">{sensor.pressure.toFixed(2)}</div>
          <div className="metric-unit">bar</div>
          <div className="metric-lbl">فشار</div>
          <GaugeBar value={sensor.pressure} max={6} status={sensor.status} />
        </div>
        <div className="sp-metric">
          <div className="metric-val">{sensor.flow.toFixed(1)}</div>
          <div className="metric-unit">m³/h</div>
          <div className="metric-lbl">جریان</div>
          <GaugeBar value={sensor.flow} max={40} status="normal" />
        </div>
      </div>

      {/* Anomaly score */}
      <div className="sp-anomaly">
        <div className="anomaly-label">
          <span>امتیاز ناهنجاری (ML)</span>
          <span className={`anomaly-score score-${sensor.status}`}>
            {(sensor.anomalyScore * 100).toFixed(0)}%
          </span>
        </div>
        <div className="anomaly-bar">
          <div
            className="anomaly-fill"
            style={{
              width: `${sensor.anomalyScore * 100}%`,
              background:
                sensor.anomalyScore > 0.7
                  ? "var(--status-critical)"
                  : sensor.anomalyScore > 0.4
                  ? "var(--status-warning)"
                  : "var(--status-normal)",
            }}
          />
        </div>
        <div className="anomaly-labels">
          <span>نرمال</span>
          <span>هشدار</span>
          <span>بحرانی</span>
        </div>
      </div>

      {/* Sparkline chart */}
      <div className="sp-chart-wrap">
        <div className="sp-chart-label">فشار — ۲۰ نقطه اخیر</div>
        <Sparkline status={sensor.status} />
      </div>

      {/* History table */}
      <div className="sp-history">
        <div className="sp-history-label">تاریخچه اندازه‌گیری</div>
        <table className="history-table">
          <thead>
            <tr>
              <th>زمان</th>
              <th>فشار (bar)</th>
              <th>جریان (m³/h)</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i}>
                <td className="time-cell" dir="ltr">{h.time}</td>
                <td>{h.pressure}</td>
                <td>{h.flow}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Coordinates */}
      <div className="sp-coords">
        <span className="coord-label">مختصات</span>
        <span className="coord-val" dir="ltr">
          {sensor.lat.toFixed(4)}°N, {sensor.lng.toFixed(4)}°E
        </span>
      </div>

      <div className="sp-updated">آخرین به‌روزرسانی: {sensor.lastUpdate}</div>
    </div>
  );
}
