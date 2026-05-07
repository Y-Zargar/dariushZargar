const API_BASE_URL = "http://localhost:4000";

export async function loadWaterDataFromBackend() {
  const [
    sensorsRes,
    pipesRes,
    alertsRes,
    statsRes,
    configRes,
  ] = await Promise.all([
    fetch(`${API_BASE_URL}/api/sensors`),
    fetch(`${API_BASE_URL}/api/pipes`),
    fetch(`${API_BASE_URL}/api/alerts`),
    fetch(`${API_BASE_URL}/api/stats`),
    fetch(`${API_BASE_URL}/api/config`),
  ]);

  if (!sensorsRes.ok) throw new Error("Failed to load sensors");
  if (!pipesRes.ok) throw new Error("Failed to load pipes");
  if (!alertsRes.ok) throw new Error("Failed to load alerts");
  if (!statsRes.ok) throw new Error("Failed to load stats");
  if (!configRes.ok) throw new Error("Failed to load config");

  const sensors = await sensorsRes.json();
  const pipes = await pipesRes.json();
  const recentAlerts = await alertsRes.json();
  const stats = await statsRes.json();
  const config = await configRes.json();

  return {
    sensors,
    pipes,
    recentAlerts,
    stats,
    QESHM_CENTER: config.QESHM_CENTER,
  };
}