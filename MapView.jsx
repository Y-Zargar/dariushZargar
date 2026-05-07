import React, { useEffect, useRef } from "react";
import "./MapView.css";

const PIPE_COLORS = {
  critical: "#ff2d55",
  warning: "#ffb800",
  normal: "#0078ff",
};

export default function MapView({
  sensors = [],
  pipes = [],
  qeshmCenter = [26.9619, 56.2681],
  selectedSensor,
  setSelectedSensor,
}) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef({});
  const pipeLinesRef = useRef([]);

  useEffect(() => {
    if (leafletMap.current) return;

    const L = window.L;
    if (!L || !mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: qeshmCenter,
      zoom: 14,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.control.zoom({ position: "bottomleft" }).addTo(map);

    leafletMap.current = map;

    return () => {
      map.remove();
      leafletMap.current = null;
      pipeLinesRef.current = [];
      markersRef.current = {};
    };
  }, []);

  useEffect(() => {
    const L = window.L;
    const map = leafletMap.current;
    if (!L || !map) return;

    if (Array.isArray(qeshmCenter) && qeshmCenter.length === 2) {
      map.setView(qeshmCenter, map.getZoom());
    }
  }, [qeshmCenter]);

  useEffect(() => {
    const L = window.L;
    const map = leafletMap.current;
    if (!L || !map) return;

    pipeLinesRef.current.forEach((line) => {
      if (line && typeof line.remove === "function") {
        line.remove();
      }
    });

    pipeLinesRef.current = [];

    const safePipes = Array.isArray(pipes) ? pipes : [];

    safePipes.forEach((pipe) => {
      if (!pipe || !Array.isArray(pipe.coordinates)) return;

      const color = PIPE_COLORS[pipe.status] || "#0078ff";
      const weight =
        pipe.status === "critical" ? 5 : pipe.status === "warning" ? 4 : 3;

      if (pipe.status !== "normal") {
        const glowLine = L.polyline(pipe.coordinates, {
          color,
          weight: weight + 6,
          opacity: 0.18,
          smoothFactor: 1,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(map);

        pipeLinesRef.current.push(glowLine);
      }

      const line = L.polyline(pipe.coordinates, {
        color,
        weight,
        opacity: pipe.status === "normal" ? 0.72 : 0.92,
        smoothFactor: 1,
        lineCap: "round",
        lineJoin: "round",
        dashArray: pipe.status === "critical" ? "8,4" : null,
      }).addTo(map);

      line.bindTooltip(
        `<div class="pipe-tooltip">
          <strong>${pipe.name}</strong><br/>
          قطر: ${pipe.diameter}<br/>
          وضعیت: <span class="s-${pipe.status}">${
          pipe.status === "critical"
            ? "بحرانی"
            : pipe.status === "warning"
            ? "هشدار"
            : "نرمال"
        }</span>
        </div>`,
        {
          permanent: false,
          direction: "top",
          className: "custom-tooltip",
        }
      );

      pipeLinesRef.current.push(line);
    });
  }, [pipes]);

  useEffect(() => {
    const L = window.L;
    const map = leafletMap.current;
    if (!L || !map) return;

    Object.values(markersRef.current).forEach((marker) => {
      if (marker && typeof marker.remove === "function") {
        marker.remove();
      }
    });

    markersRef.current = {};

    const safeSensors = Array.isArray(sensors) ? sensors : [];

    safeSensors.forEach((sensor) => {
      if (!sensor || typeof sensor.lat !== "number" || typeof sensor.lng !== "number") {
        return;
      }

      const isSelected = selectedSensor?.id === sensor.id;
      const isCritical = sensor.status === "critical";

      const html = `
        <div class="sensor-marker status-${sensor.status} ${
        isSelected ? "selected" : ""
      }">
          <div class="marker-pulse ${isCritical ? "pulse" : ""}"></div>
          <div class="marker-core">
            <span class="marker-icon">${
              sensor.type === "desalination"
                ? "◈"
                : sensor.type === "sewage"
                ? "⊗"
                : sensor.type === "flow"
                ? "≋"
                : "⊕"
            }</span>
          </div>
          <div class="marker-label">${sensor.id}</div>
        </div>
      `;

      const icon = L.divIcon({
        html,
        className: "",
        iconSize: [40, 52],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([sensor.lat, sensor.lng], { icon })
        .addTo(map)
        .on("click", () => {
          setSelectedSensor(sensor);
        });

      markersRef.current[sensor.id] = marker;
    });
  }, [sensors, selectedSensor, setSelectedSensor]);

  useEffect(() => {
    const map = leafletMap.current;
    if (!map || !selectedSensor) return;

    if (
      typeof selectedSensor.lat !== "number" ||
      typeof selectedSensor.lng !== "number"
    ) {
      return;
    }

    map.flyTo([selectedSensor.lat, selectedSensor.lng], 15.5, {
      duration: 0.8,
    });
  }, [selectedSensor]);

  return (
    <div className="mapview-wrap">
      <div ref={mapRef} className="leaflet-map" />

      <div className="map-overlay-corner">
        <div className="corner-line" />
        <span className="map-location-text">
          <span>جزیره قشم</span>
          <span>شبکه آب</span>
        </span>
      </div>
    </div>
  );
}