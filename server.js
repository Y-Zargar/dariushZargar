const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
}));

app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    message: "Dariush backend is running",
  });
});

app.get("/api/sensors", async (req, res) => {
  const { data, error } = await supabase
    .from("sensors")
    .select("*")
    .order("id");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const sensors = data.map((sensor) => ({
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

  res.json(sensors);
});

app.get("/api/pipes", async (req, res) => {
  const { data, error } = await supabase
    .from("pipes")
    .select("*")
    .order("id");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/api/alerts", async (req, res) => {
  const { data, error } = await supabase
    .from("recent_alerts")
    .select("*")
    .order("id");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const alerts = data.map((alert) => ({
    time: alert.time,
    sensor: alert.sensor,
    msg: alert.msg,
    level: alert.level,
  }));

  res.json(alerts);
});

app.get("/api/stats", async (req, res) => {
  const { data, error } = await supabase
    .from("dashboard_stats")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({
    totalSensors: data.total_sensors,
    critical: data.critical,
    warning: data.warning,
    normal: data.normal,
    totalFlow: data.total_flow,
    avgPressure: data.avg_pressure,
    networkHealth: data.network_health,
    alertsToday: data.alerts_today,
  });
});

app.get("/api/config", async (req, res) => {
  const { data, error } = await supabase
    .from("app_config")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({
    QESHM_CENTER: data.qeshm_center,
  });
});

app.post("/api/readings", async (req, res) => {
  const {
    sensorId,
    pressure,
    flow,
    anomalyScore,
  } = req.body;

  if (!sensorId || pressure === undefined || flow === undefined) {
    return res.status(400).json({
      error: "sensorId, pressure and flow are required",
    });
  }

  let status = "normal";
  let alert = null;

  if (pressure < 1.5 || anomalyScore > 0.85) {
    status = "critical";
    alert = "افت فشار شدید - نشتی احتمالی";
  } else if (pressure < 2.5 || anomalyScore > 0.45) {
    status = "warning";
    alert = "وضعیت غیرعادی در شبکه";
  }

  const lastUpdate = new Date().toLocaleTimeString("fa-IR");

  const { data, error } = await supabase
    .from("sensors")
    .update({
      pressure,
      flow,
      anomaly_score: anomalyScore || 0,
      status,
      alert,
      last_update: lastUpdate,
    })
    .eq("id", sensorId)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (status !== "normal") {
    await supabase.from("recent_alerts").insert({
      time: new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sensor: sensorId,
      msg: alert,
      level: status,
    });
  }

  res.json({
    ok: true,
    sensor: data,
  });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Dariush backend running on http://localhost:${port}`);
});