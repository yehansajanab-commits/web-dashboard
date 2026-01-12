/* =========================================================
   SPEAKER CONTROL DASHBOARD - MQTT (Browser)
   Broker  : test.mosquitto.org
   WS Port : 8080
   Topics  : speakers/1..4/cmd
   Payload : PLAY / STOP
   ========================================================= */

// MQTT WebSocket URL (matches ESP32 broker)
const MQTT_URL = "ws://test.mosquitto.org:8080/mqtt";

// Connect to MQTT broker (no username/password)
const client = mqtt.connect(MQTT_URL);

// Status display element
const statusEl = document.getElementById("status");

/* ---------------- MQTT EVENTS ---------------- */

client.on("connect", () => {
  console.log("🟢 Connected to MQTT broker");
  statusEl.textContent = "🟢 Connected to MQTT Broker";
});

client.on("reconnect", () => {
  console.log("🟡 Reconnecting to MQTT...");
  statusEl.textContent = "🟡 Reconnecting...";
});

client.on("offline", () => {
  console.log("🔴 MQTT Offline");
  statusEl.textContent = "🔴 MQTT Offline";
});

client.on("error", (error) => {
  console.error("❌ MQTT Error:", error);
  statusEl.textContent = "❌ MQTT Error";
});

/* ---------------- BUTTON HANDLERS ---------------- */

document.querySelectorAll(".speaker").forEach(speaker => {
  const speakerId = speaker.getAttribute("data-id");

  speaker.querySelector(".play").addEventListener("click", () => {
    sendCommand(speakerId, "PLAY");
  });

  speaker.querySelector(".stop").addEventListener("click", () => {
    sendCommand(speakerId, "STOP");
  });
});

/* ---------------- MQTT PUBLISH ---------------- */

function sendCommand(speakerId, command) {
  if (!client.connected) {
    console.warn("⚠ MQTT not connected");
    statusEl.textContent = "⚠ MQTT not connected";
    return;
  }

  const topic = `speakers/${speakerId}/cmd`;
  client.publish(topic, command, { qos: 0, retain: false });

  console.log(`📢 Sent ${command} → ${topic}`);
}
