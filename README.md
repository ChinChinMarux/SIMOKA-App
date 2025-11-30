# 🌊 SIMOKA: Sistem Monitoring Kualitas Air

**SIMOKA (Sistem Monitoring Kualitas Air)** adalah sebuah sistem yang digunakan untuk memantau kualitas air di beberapa wilayah secara **_real-time_**. Sistem ini terintegrasi dengan **perangkat IoT** yang mengirimkan data sensor melalui protokol **MQTT**, kemudian data disimpan dalam **InfluxDB** dan ditampilkan pada aplikasi web.

Parameter kualitas air yang dapat dipantau meliputi:

- pH air
- TDS (Total Dissolved Solids)
- TSS / Kekeruhan (Turbidity)
- Suhu air

Sistem ini dirancang untuk membantu proses pemantauan kualitas air secara terpusat, cepat, dan efisien.

---

## 1. Arsitektur Sistem

```
[Perangkat IoT / Simulator]
           |
          MQTT
           |
   [Mosquitto - Docker]
           |
   [Backend - Node.js + Express]
           |
      [InfluxDB - Docker]
           |
        [Frontend - React]
```

**Penjelasan alur kerja:**

1. Perangkat IoT (ESP32 + Sensor) mengirimkan data kualitas air ke broker MQTT
2. MQTT Broker (Mosquitto) menerima data dari perangkat
3. Backend melakukan subscribe pada topic MQTT
4. Data disimpan di database InfluxDB
5. Frontend menampilkan data secara real-time dan historis

---

## 2. Struktur Folder Proyek

```
SIMOKA/
│
├── backend/        -> Server Node.js & DB
├── frontend/       -> Aplikasi tampilan monitoring
├── docker          -> Konfigurasi Mosquitto
├── simulator/      -> Simulator data sensor
├── README.md
```

---

## 3. Setup MQTT (Mosquitto) dengan Docker

### File: `docker-compose.yml`

```yaml
version: "3.8"
services:
  mosquitto:
    image: eclipse-mosquitto
    container_name: mosquitto
    ports:
      - "1883:1883"
      - "9001:9001"
    volumes:
      - ./mqtt/mosquitto.conf:/mosquitto/config/mosquitto.conf
```

### File: `mqtt/mosquitto.conf`

```conf
listener 1883
allow_anonymous true

listener 9001
protocol websockets
allow_anonymous true
```

### Jalankan Mosquitto

```bash
docker-compose up -d
```

Cek container:

```bash
docker ps
```

---

## 4. Setup InfluxDB (Database) dengan Docker

Tambahkan service berikut ke file `docker-compose.yml`:

```yaml
influxdb:
  image: influxdb:latest
  container_name: influxdb
  ports:
    - "8086:8086"
  volumes:
    - ./influx:/var/lib/influxdb2
```

Lalu jalankan kembali:

```bash
docker-compose up -d
```

Buka pada browser:

```
http://localhost:8086
```

Buat konfigurasi:

- **Organization**: iot
- **Bucket**: water_monitor
- **Token**: simpan untuk backend

---

## 5. Setup Backend (Node.js + Express + MQTT + InfluxDB)

Masuk ke folder backend:

```bash
cd backend
npm init -y
npm install express mqtt @influxdata/influxdb-client cors dotenv
```

### File: `.env`

```env
INFLUX_TOKEN=YOUR_TOKEN
INFLUX_ORG=iot
INFLUX_BUCKET=water_monitor
INFLUX_URL=http://localhost:8086
MQTT_URL=mqtt://localhost:1883
```

### File: `index.js`

```javascript
import express from "express";
import mqtt from "mqtt";
import { InfluxDB, Point } from "@influxdata/influxdb-client";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MQTT
const mqttClient = mqtt.connect(process.env.MQTT_URL);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT Broker");
  mqttClient.subscribe("air/monitoring");
});

// InfluxDB
const influxDB = new InfluxDB({
  url: process.env.INFLUX_URL,
  token: process.env.INFLUX_TOKEN,
});

const writeApi = influxDB.getWriteApi(
  process.env.INFLUX_ORG,
  process.env.INFLUX_BUCKET
);

mqttClient.on("message", (topic, message) => {
  const data = JSON.parse(message.toString());

  const point = new Point("water")
    .floatField("ph", data.ph)
    .floatField("tds", data.tds)
    .floatField("turbidity", data.tss)
    .floatField("temperature", data.temperature);

  writeApi.writePoint(point);

  console.log("Data received & saved:", data);
});

app.get("/", (req, res) => {
  res.send("SIMOKA Backend is running...");
});

app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});
```

Jalankan backend:

```bash
node index.js
```

---

## 6. Setup Frontend (React + Vite)

Masuk ke folder frontend:

```bash
npm create vite@latest
cd frontend
npm install
npm install mqtt
```

### File: `src/mqtt.js`

```javascript
import mqtt from "mqtt";

export const client = mqtt.connect("ws://localhost:9001", {
  clientId: "simoka_" + Math.random().toString(16).substr(2, 8),
});
```

### File: `src/App.jsx`

```jsx
import { useEffect, useState } from "react";
import { client } from "./mqtt";

function App() {
  const [data, setData] = useState("Belum ada data");

  useEffect(() => {
    client.on("connect", () => {
      console.log("Connected to MQTT WebSocket");
      client.subscribe("air/monitoring");
    });

    client.on("message", (topic, message) => {
      setData(message.toString());
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>SIMOKA - Sistem Monitoring Kualitas Air</h1>
      <h3>Data Sensor (Realtime)</h3>
      <pre>{data}</pre>
    </div>
  );
}

export default App;
```

Jalankan frontend:

```bash
npm run dev
```

---

## 7. Pengujian (Simulasi Data Sensor)

Kirim data uji ke MQTT:

```bash
docker exec -it mosquitto mosquitto_pub -t air/monitoring -m "{\"ph\":7.2,\"tds\":450,\"tss\":30,\"temperature\":29}"
```

Jika berhasil:

- Data tampil di frontend
- Data tersimpan di InfluxDB
- Backend menampilkan log penerimaan data

---

## 8. Pengembangan Selanjutnya (Opsional)

- Grafik realtime (Chart.js / Recharts)
- Peta lokasi sensor (Maps API)
- Status air (layak / tercemar)
- Riwayat data per wilayah
- Panel admin

---

## 9. Informasi Proyek

**Nama sistem:**  
SIMOKA – Sistem Monitoring Kualitas Air

**Fokus:**  
Pemantauan kualitas air di beberapa wilayah terintegrasi perangkat IoT

**Teknologi:**

- React
- Node.js
- MQTT (Mosquitto)
- Docker
- InfluxDB
- ESP32 (IoT Device)

---
