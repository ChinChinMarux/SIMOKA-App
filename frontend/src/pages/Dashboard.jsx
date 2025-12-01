import { useEffect, useState } from "react";


class SensorData {
  constructor(name, unit, min, max) {
    this.name = name;
    this.unit = unit;
    this.min = min;
    this.max = max;
  }
  getStatus(value) {
    if (value < this.min) return { label: "Low", color: "#ef4444" };
    if (value > this.max) return { label: "High", color: "#f59e0b" };
    return { label: "Normal", color: "#10b981" };
  }
}

function SensorChart({ title, data, color = "#3b82f6" }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const gradientId = `gradient-${title.replace(/\s+/g, "-")}`;

  return (
    <div style={{ height: "100%" }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 120"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: color, stopOpacity: 0.3 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: color, stopOpacity: 0 }}
            />
          </linearGradient>
        </defs>
        <polygon
          points={`0,120 ${data
            .map((val, i) => {
              const x = (i / (data.length - 1 || 1)) * 300;
              const y = 120 - ((val - min) / range) * 100;
              return `${x},${y}`;
            })
            .join(" ")} 300,120`}
          fill={`url(#${gradientId})`}
        />
        <polyline
          points={data
            .map((val, i) => {
              const x = (i / (data.length - 1 || 1)) * 300;
              const y = 120 - ((val - min) / range) * 100;
              return `${x},${y}`;
            })
            .join(" ")}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
        />
      </svg>
    </div>
  );
}

function InfoCard({ icon, title, description, color }) {
  return (
    <div
      style={{
        background: "rgba(30, 41, 59, 0.4)",
        backdropFilter: "blur(12px)",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid rgba(71, 85, 105, 0.3)",
        display: "flex",
        gap: "16px",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: `linear-gradient(135deg, ${color}40, ${color}20)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <h4
          style={{
            color: "white",
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "8px",
          }}
        >
          {title}
        </h4>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "14px",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

async function getWaterData() {
  return {
    pH: (7 + Math.random() * 2 - 1).toFixed(2),
    temperature: (27 + Math.random() * 4 - 2).toFixed(1),
    TDS: (250 + Math.random() * 100 - 50).toFixed(0),
  };
}

const phSensor = new SensorData("pH", "pH", 6.5, 8.5);
const tempSensor = new SensorData("Temperature", "°C", 20, 35);
const tdsSensor = new SensorData("TDS", "ppm", 0, 500);

export default function Dashboard() {
  const [ph, setPh] = useState([]);
  const [temp, setTemp] = useState([]);
  const [tds, setTds] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await getWaterData();

      setPh((prev) => [...prev.slice(-20), Number(data.pH)]);
      setTemp((prev) => [...prev.slice(-20), Number(data.temperature)]);
      setTds((prev) => [...prev.slice(-20), Number(data.TDS)]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const lastPh = ph[ph.length - 1] || 0;
  const lastTemp = temp[temp.length - 1] || 0;
  const lastTds = tds[tds.length - 1] || 0;

  const phStatus = phSensor.getStatus(lastPh);
  const tempStatus = tempSensor.getStatus(lastTemp);
  const tdsStatus = tdsSensor.getStatus(lastTds);

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    padding: "32px",
  };

  const maxWidthStyle = {
    maxWidth: "1280px",
    margin: "0 auto",
  };

  const headerContainerStyle = {
    marginBottom: "40px",
  };

  const headerFlexStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  };

  const iconBoxStyle = {
    width: "48px",
    height: "48px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 30px -5px rgba(59, 130, 246, 0.5)",
  };

  const h1Style = {
    fontSize: "36px",
    fontWeight: "bold",
    color: "white",
    margin: 0,
  };

  const subtitleStyle = {
    color: "#93c5fd",
    fontSize: "14px",
    marginTop: "4px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
    marginBottom: "32px",
  };

  const cardStyle = {
    background:
      "linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.6))",
    backdropFilter: "blur(16px)",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid rgba(71, 85, 105, 0.5)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const cardHeaderStyle = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: "16px",
    gap: "12px",
  };

  const labelStyle = {
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "4px",
    maxWidth: "200px",
    lineHeight: "1.3",
  };

  const valueContainerStyle = {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
  };

  const valueStyle = {
    fontSize: "36px",
    fontWeight: "bold",
    color: "white",
  };

  const unitStyle = {
    fontSize: "18px",
    color: "#94a3b8",
  };

  const badgeStyle = (color) => ({
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "white",
    backgroundColor: color,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
    flexShrink: 0,
    whiteSpace: "nowrap",
  });

  const rangeStyle = {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "12px",
  };

  const miniChartStyle = {
    height: "64px",
    marginLeft: "-8px",
    marginRight: "-8px",
  };

  const detailedCardStyle = {
    ...cardStyle,
    marginBottom: "24px",
  };

  const chartTitleStyle = {
    fontSize: "20px",
    fontWeight: "600",
    color: "white",
    marginBottom: "16px",
  };

  const detailedChartStyle = {
    height: "192px",
  };

  const sensorColors = {
    ph: "#8b5cf6",
    temp: "#f59e0b",
    tds: "#06b6d4",
  };

  const infoSectionStyle = {
    background:
      "linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.5))",
    backdropFilter: "blur(12px)",
    borderRadius: "20px",
    padding: "32px",
    border: "1px solid rgba(71, 85, 105, 0.5)",
    marginBottom: "32px",
  };

  const sectionTitleStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "white",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  return (
    <div style={containerStyle}>
      <div style={maxWidthStyle}>
        {/* Header */}
        <div style={headerContainerStyle}>
          <div style={headerFlexStyle}>
            <div style={iconBoxStyle}>
              <svg
                style={{ width: "28px", height: "28px", color: "white" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h1 style={h1Style}>SIMOKA</h1>
              <p style={subtitleStyle}>
                Sistem Monitoring Kualitas Air •{" "}
                <span style={{ fontStyle: "italic" }}>
                  Terintegrasi dengan Perangkat IoT
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div style={gridStyle}>
          {/* pH Card */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: `linear-gradient(135deg, ${sensorColors.ph}40, ${sensorColors.ph}20)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    style={{ width: "24px", height: "24px", color: sensorColors.ph }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <p style={labelStyle}>pH Level</p>
                  <div style={valueContainerStyle}>
                    <span style={valueStyle}>{lastPh.toFixed(2)}</span>
                    <span style={unitStyle}>pH</span>
                  </div>
                </div>
              </div>
              <div style={badgeStyle(phStatus.color)}>{phStatus.label}</div>
            </div>
            <div style={rangeStyle}>
              Normal: {phSensor.min} - {phSensor.max} pH
            </div>
            <div style={miniChartStyle}>
              <SensorChart title="pH" data={ph} color={sensorColors.ph} />
            </div>
          </div>

          {/* Temperature Card */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: `linear-gradient(135deg, ${sensorColors.temp}40, ${sensorColors.temp}20)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    style={{ width: "24px", height: "24px", color: sensorColors.temp }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p style={labelStyle}>Temperature</p>
                  <div style={valueContainerStyle}>
                    <span style={valueStyle}>{lastTemp.toFixed(1)}</span>
                    <span style={unitStyle}>°C</span>
                  </div>
                </div>
              </div>
              <div style={badgeStyle(tempStatus.color)}>{tempStatus.label}</div>
            </div>
            <div style={rangeStyle}>
              Normal: {tempSensor.min} - {tempSensor.max} °C
            </div>
            <div style={miniChartStyle}>
              <SensorChart title="Temperature" data={temp} color={sensorColors.temp} />
            </div>
          </div>

          {/* TDS Card */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: `linear-gradient(135deg, ${sensorColors.tds}40, ${sensorColors.tds}20)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    style={{ width: "24px", height: "24px", color: sensorColors.tds }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <div>
                  <p style={labelStyle}>Total Dissolved Solid</p>
                  <div style={valueContainerStyle}>
                    <span style={valueStyle}>{lastTds.toFixed(0)}</span>
                    <span style={unitStyle}>ppm</span>
                  </div>
                </div>
              </div>
              <div style={badgeStyle(tdsStatus.color)}>{tdsStatus.label}</div>
            </div>
            <div style={rangeStyle}>
              Normal: {tdsSensor.min} - {tdsSensor.max} ppm
            </div>
            <div style={miniChartStyle}>
              <SensorChart title="TDS" data={tds} color={sensorColors.tds} />
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div style={infoSectionStyle}>
          <h2 style={sectionTitleStyle}>
            <svg
              style={{ width: "28px", height: "28px", color: "#3b82f6" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Informasi Parameter Kualitas Air
          </h2>
          <div style={{ display: "grid", gap: "16px" }}>
            <InfoCard
              icon={
                <svg
                  style={{ width: "24px", height: "24px", color: sensorColors.ph }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              }
              title="pH Level (Derajat Keasaman)"
              description="pH mengukur tingkat keasaman atau kebasaan air. Skala pH berkisar dari 0-14, dengan 7 sebagai netral. Air yang sehat untuk dikonsumsi memiliki pH antara 6.5-8.5. pH yang terlalu rendah (asam) atau terlalu tinggi (basa) dapat berbahaya bagi kesehatan dan merusak sistem pipa."
              color={sensorColors.ph}
            />
            <InfoCard
              icon={
                <svg
                  style={{ width: "24px", height: "24px", color: sensorColors.temp }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
              title="Temperature (Suhu Air)"
              description="Suhu air mempengaruhi kenyamanan penggunaan dan pertumbuhan mikroorganisme. Suhu ideal untuk air minum adalah 20-35°C. Suhu yang terlalu tinggi dapat mempercepat pertumbuhan bakteri, sementara suhu yang terlalu rendah dapat mempengaruhi kenyamanan penggunaan."
              color={sensorColors.temp}
            />
            <InfoCard
              icon={
                <svg
                  style={{ width: "24px", height: "24px", color: sensorColors.tds }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              }
              title="TDS (Total Dissolved Solids)"
              description="TDS mengukur jumlah total zat terlarut dalam air, termasuk mineral, garam, dan logam. Diukur dalam ppm (parts per million). TDS ideal untuk air minum adalah 0-500 ppm. TDS yang terlalu tinggi dapat mengindikasikan kontaminasi atau kandungan mineral berlebih yang mempengaruhi rasa dan kualitas air."
              color={sensorColors.tds}
            />
          </div>
        </div>

        {/* Detailed Charts */}
        <div>
          {/* pH Chart */}
          <div style={detailedCardStyle}>
            <h3 style={chartTitleStyle}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: `linear-gradient(135deg, ${sensorColors.ph}40, ${sensorColors.ph}20)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  style={{ width: "20px", height: "20px", color: sensorColors.ph }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              pH Sensor - Real-time Monitoring
            </h3>
            <div style={detailedChartStyle}>
              <SensorChart title="pH Sensor" data={ph} color={sensorColors.ph} />
            </div>
          </div>

          {/* Temperature Chart */}
          <div style={detailedCardStyle}>
            <h3 style={chartTitleStyle}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: `linear-gradient(135deg, ${sensorColors.temp}40, ${sensorColors.temp}20)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  style={{ width: "20px", height: "20px", color: sensorColors.temp }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              Temperature - Real-time Monitoring
            </h3>
            <div style={detailedChartStyle}>
              <SensorChart title="Temperature" data={temp} color={sensorColors.temp} />
            </div>
          </div>

          {/* TDS Chart */}
          <div style={detailedCardStyle}>
            <h3 style={chartTitleStyle}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: `linear-gradient(135deg, ${sensorColors.tds}40, ${sensorColors.tds}20)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  style={{ width: "20px", height: "20px", color: sensorColors.tds }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              TDS - Real-time Monitoring
            </h3>
            <div style={detailedChartStyle}>
              <SensorChart title="TDS" data={tds} color={sensorColors.tds} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
