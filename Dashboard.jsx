import React, { useEffect, useState } from "react";
import "../App.css";
import MapView from "../components/MapView";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import SensorPanel from "../components/SensorPanel";
import { loadWaterDataFromBackend } from "../services/backendData";

function Dashboard() {
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const [qeshmCenter, setQeshmCenter] = useState([26.9619, 56.2681]);
  const [liveData, setLiveData] = useState([]);
  const [pipes, setPipes] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    totalSensors: 0,
    critical: 0,
    warning: 0,
    normal: 0,
    totalFlow: "0 m³/h",
    avgPressure: "0 bar",
    networkHealth: 0,
    alertsToday: 0,
  });

  const [sidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("alerts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const data = await loadWaterDataFromBackend();

        setQeshmCenter(data.QESHM_CENTER);
        setLiveData(data.sensors);
        setPipes(data.pipes);
        setAlerts(data.recentAlerts);
        setStats(data.stats);
      } catch (err) {
        console.error("DATABASE LOAD ERROR:", err);
        setError("خطا در دریافت داده‌ها از پایگاه داده");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (liveData.length === 0) return;

    const interval = setInterval(() => {
      setLiveData((prev) =>
        prev.map((sensor) => ({
          ...sensor,
          pressure: Math.max(
            0.3,
            sensor.pressure + (Math.random() - 0.5) * 0.1
          ),
          flow: Math.max(
            0,
            sensor.flow + (Math.random() - 0.5) * 0.5
          ),
          anomalyScore: Math.min(
            1,
            Math.max(
              0,
              sensor.anomalyScore + (Math.random() - 0.5) * 0.02
            )
          ),
          lastUpdate: new Date().toLocaleTimeString("fa-IR"),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [liveData.length]);

  const filteredSensors = liveData.filter((sensor) => {
    if (activeFilter === "all") return true;
    return sensor.status === activeFilter;
  });

  if (loading) {
    return <div className="loading-screen">در حال دریافت داده‌ها...</div>;
  }

  if (error) {
    return <div className="loading-screen">{error}</div>;
  }

  return (
    <div className="app">
      <TopBar
        stats={stats}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <div className="main-layout">
        {sidebarOpen && (
          <Sidebar
            sensors={liveData}
            alerts={alerts}
            stats={stats}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedSensor={selectedSensor}
            setSelectedSensor={setSelectedSensor}
          />
        )}

        <div className="map-container">
          <MapView
            sensors={filteredSensors}
            pipes={pipes}
            qeshmCenter={qeshmCenter}
            selectedSensor={selectedSensor}
            setSelectedSensor={setSelectedSensor}
          />
        </div>

        {selectedSensor && (
          <SensorPanel
            sensor={selectedSensor}
            onClose={() => setSelectedSensor(null)}
          />
        )}
      </div>

      <BottomBar stats={stats} />
    </div>
  );
}

export default Dashboard;