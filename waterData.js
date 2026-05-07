import { supabase } from "../lib/supabase";

export async function loadWaterData() {
  const [
    sensorsResult,
    pipesResult,
    alertsResult,
    statsResult,
    configResult,
  ] = await Promise.all([
    supabase.from("sensors").select("*").order("id"),
    supabase.from("pipes").select("*").order("id"),
    supabase.from("recent_alerts").select("*").order("id"),
    supabase.from("dashboard_stats").select("*").eq("id", 1).single(),
    supabase.from("app_config").select("*").eq("id", 1).single(),
  ]);

  if (sensorsResult.error) throw sensorsResult.error;
  if (pipesResult.error) throw pipesResult.error;
  if (alertsResult.error) throw alertsResult.error;
  if (statsResult.error) throw statsResult.error;
  if (configResult.error) throw configResult.error;

  const sensors = sensorsResult.data.map((sensor) => ({
    id: sensor.id,
    name: sensor.name,
    lat: sensor.lat,
    lng: sensor.lng,
    type: sensor.type,
    status: sensor.status,
    pressure: Number(sensor.pressure),
    flow: Number(sensor.flow),
    anomalyScore: Number(sensor.anomaly_score),
    lastUpdate: sensor.last_update,
    alert: sensor.alert,
    zone: sensor.zone,
  }));

  const pipes = pipesResult.data.map((pipe) => ({
    id: pipe.id,
    name: pipe.name,
    status: pipe.status,
    diameter: pipe.diameter,
    coordinates: pipe.coordinates,
  }));

  const recentAlerts = alertsResult.data.map((alert) => ({
    time: alert.time,
    sensor: alert.sensor,
    msg: alert.msg,
    level: alert.level,
  }));

  const dbStats = statsResult.data;

  const stats = {
    totalSensors: dbStats.total_sensors,
    critical: dbStats.critical,
    warning: dbStats.warning,
    normal: dbStats.normal,
    totalFlow: dbStats.total_flow,
    avgPressure: dbStats.avg_pressure,
    networkHealth: dbStats.network_health,
    alertsToday: dbStats.alerts_today,
  };

  const QESHM_CENTER = configResult.data.qeshm_center;

  return {
    QESHM_CENTER,
    sensors,
    pipes,
    stats,
    recentAlerts,
  };
}