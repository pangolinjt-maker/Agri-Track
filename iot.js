// AgriTrack ZW IoT Sensor Simulation
 
function generateSensorData() {
 
return {
soilMoisture: Math.floor(Math.random() * 100),
temperature: (20 + Math.random() * 15).toFixed(1),
rainfall: (Math.random() * 20).toFixed(1)
};
 
}
 
function updateDashboard() {
 
const sensorData = generateSensorData();
const card = document.getElementById(`${data.sensor}-card`);
 
card.classList.remove(
"normal",
"warning",
"critical"
);
 
card.classList.add(
status.toLowerCase()
);
 
document.getElementById("soil-moisture").textContent =
sensorData.soilMoisture + "%";
 
document.getElementById("temperature").textContent =
sensorData.temperature + " °C";
 
document.getElementById("rainfall").textContent =
sensorData.rainfall + " mm";
 
}
 
// Load initial data
updateDashboard();
 
// Refresh every 5 seconds
setInterval(updateDashboard, 5000);
*/
Q4.9
 
In a real IoT installation, this simulator would be replaced
with live sensor readings received from physical sensors using
a communication protocol such as MQTT over WebSockets.
 
The display module would not need to change because it already
listens for sensor events through the EventBus. Only the source
of the data would change from simulated readings to real sensor
readings coming from the field.
*/
 
 
IoT Simulator Module
Q4.7
 
const IoTSimulator = (function () {
 
function generateReadings() {
 
EventBus.publish("sensorUpdate", {
sensor: "soil",
value: Math.floor(Math.random() * 101),
unit: "%"
});
 
EventBus.publish("sensorUpdate", {
sensor: "temperature",
value: Number((15 + Math.random() * 25).toFixed(1)),
unit: "°C"
});
 
EventBus.publish("sensorUpdate", {
sensor: "humidity",
value: Math.floor(Math.random() * 101),
unit: "%"
});
 
EventBus.publish("sensorUpdate", {
sensor: "light",
value: Math.floor(Math.random() * 1500),
unit: "Lux"
});
 
}
 
function start() {
 
generateReadings();
 
setInterval(generateReadings, 3000);
 
}
 
return {
start
};
 
})();
 
 

IoT Display Module
Q4.8

 
const IoTDisplay = (function () {
 
const alertLog =
document.getElementById("alert-log");
 
function createAlert(message) {
 
const li =
document.createElement("li");
 
li.textContent =
`${new Date().toLocaleTimeString()} - ${message}`;
 
alertLog.prepend(li);
}
 
function getStatus(sensor, value) {
 
switch (sensor) {
 
case "soil":
 
if (value < 20) return "Critical";
if (value < 40) return "Warning";
return "Normal";
 
case "temperature":
 
if (value > 35) return "Critical";
if (value > 30) return "Warning";
return "Normal";
 
case "humidity":
 
if (value < 30) return "Critical";
if (value < 50) return "Warning";
return "Normal";
 
case "light":
 
if (value < 200) return "Critical";
if (value < 500) return "Warning";
return "Normal";
 
default:
return "Normal";
}
}
 
EventBus.subscribe("sensorUpdate", data => {
 
let valueElement;
let statusElement;
 
switch (data.sensor) {
 
case "soil":
valueElement =
document.getElementById("soil-moisture");
 
statusElement =
document.getElementById("soil-status");
break;
 
case "temperature":
valueElement =
document.getElementById("temperature");
 
statusElement =
document.getElementById("temperature-status");
break;
 
case "humidity":
valueElement =
document.getElementById("humidity");
 
statusElement =
document.getElementById("humidity-status");
break;
 
case "light":
valueElement =
document.getElementById("light-intensity");
 
statusElement =
document.getElementById("light-status");
break;
}
 
valueElement.textContent =
`${data.value} ${data.unit}`;
 
const status =
getStatus(data.sensor, data.value);
 
statusElement.textContent =
status;
 
statusElement.className = "";
 
if (status === "Normal") {
statusElement.classList.add("normal");
}
 
if (status === "Warning") {
statusElement.classList.add("warning");
}
 
if (status === "Critical") {
statusElement.classList.add("critical",);
}
 
if (status !== "Normal") {
 
createAlert(
`${data.sensor} is ${status} (${data.value}${data.unit})`
);
}
 
});
 
return {};
 
})();
 
 
document.addEventListener("DOMContentLoaded", () => {
 
IoTSimulator.start();
 
});