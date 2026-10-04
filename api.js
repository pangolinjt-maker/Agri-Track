const WeatherAPI = (() => {
 
const provinces = [
{ name: "Harare", lat: -17.8292, lon: 31.0522 },
{ name: "Bulawayo", lat: -20.1480, lon: 28.5331 },
{ name: "Manicaland", lat: -18.9216, lon: 32.1746 },
{ name: "Mashonaland East", lat: -18.5872, lon: 31.2626 },
{ name: "Mashonaland West", lat: -17.4851, lon: 30.2800 },
{ name: "Mashonaland Central", lat: -16.7644, lon: 31.0794 },
{ name: "Midlands", lat: -19.4500, lon: 29.8167 },
{ name: "Masvingo", lat: -20.0740, lon: 30.8320 },
{ name: "Matabeleland North", lat: -18.5333, lon: 27.1500 },
{ name: "Matabeleland South", lat: -21.0500, lon: 29.3667 }
];
 
// Open-Meteo requires no API key for basic weather requests.
// If using a production API that requires a secret key,
// the key should be stored on a backend server and never
// exposed directly in frontend JavaScript.
 
async function getWeather(lat, lon) {
 
try {
 
const response = await fetch(
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
);
 
if (!response.ok) {
throw new Error("Weather service unavailable.");
}
 
return await response.json();
 
} catch (error) {
 
alert("Unable to load weather data. Please try again later.");
 
return null;
}
}
 
async function getAllProvinceWeather() {
 
const weatherPromises = provinces.map(province =>
getWeather(province.lat, province.lon)
);
 
const results = await Promise.all(weatherPromises);
 
return provinces.map((province, index) => ({
province: province.name,
weather: results[index]
}));
}
 
return {
getWeather,
getAllProvinceWeather
};
 
})();
 
 
 
const StorageAPI = (() => {
 
const KEY = "agritrack_farm";
 
function save(data) {
localStorage.setItem(KEY, JSON.stringify(data));
}
 
function get() {
return JSON.parse(localStorage.getItem(KEY)) || [];
}
 
function remove() {
localStorage.removeItem(KEY);
}
 
return {
save,
get,
remove
};
 
})();