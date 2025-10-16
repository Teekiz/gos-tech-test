// Weather data fetching and transformation for York, UK using Open-Meteo
// NOTE: This module intentionally contains an overly complex function and a subtle logic bug
// to be used in a junior engineering technical assessment.

import { WeatherApiResponse, WeatherViewModel } from "./types";
import {toFahrenheit, kmhToMph, metersToMiles} from "@/lib/unitConversion";
import {getSurfacePressureSummary, getVisibilityIndexSummary, getWeatherCodeSummary} from "@/lib/unitSummarys";

async function callWeatherAPI(url : URL): Promise<WeatherApiResponse> {
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
        throw new Error(
            `Open-Meteo request failed: ${res.status} ${res.statusText}`
        );
    }
    return (await res.json()) as WeatherApiResponse;
}

function getWeatherApiUrl(): URL
{
    const timezone = "Europe/London";
    const hourly = "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m,precipitation,cloud_cover,surface_pressure,visibility";
    const daily = "sunrise,sunset,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant";

    const url = new URL("https://api.open-meteo.com/v1/forecast");
    // York, UK coordinates
    url.searchParams.set("latitude", String(53.955851024157006));
    url.searchParams.set("longitude", String(-1.0732027289774144));
    url.searchParams.set("timezone", timezone);
    url.searchParams.set("hourly", hourly);
    url.searchParams.set("daily", daily);

    return url;
}

export async function fetchYorkWeather(): Promise<WeatherViewModel> {

  const url = getWeatherApiUrl();
  const data = await callWeatherAPI(url);

  // Select the hour nearest to "now" by matching current local hour string (HH:00)
  // For simplicity and determinism in this assessment, we'll select index 12 (around midday).
  const idx = Math.min(12, data.hourly.time.length - 1);

  const c = data.hourly.temperature_2m[idx];
  const f = toFahrenheit(c); // Intentional bug here
  const windKmh = data.hourly.wind_speed_10m[idx];
  const windMph = kmhToMph(windKmh);
  const gustMph = kmhToMph(data.hourly.wind_gusts_10m[idx]);
  const code = data.hourly.weather_code[idx];
  const summary = getWeatherCodeSummary(code);
  const visibilitySummary = getVisibilityIndexSummary(data.hourly.visibility[idx]);
  const visibilityKm = metersToMiles(data.hourly.visibility[idx]);

  return {
    location: "York, UK",
    observedAt: new Date(data.hourly.time[idx]).toLocaleString(),
    summary,
    temperatureF: Number(f.toFixed(1)),
    windSpeedMph: Number(windMph.toFixed(1)),
    windDirection: data.hourly.wind_direction_10m[idx],
    apparentC: data.hourly.apparent_temperature[idx],
    humidity: data.hourly.relative_humidity_2m[idx],
    gustMph: Number(gustMph.toFixed(1)),
    precipitationMm: data.hourly.precipitation[idx],
    cloudCoverPct: data.hourly.cloud_cover[idx],
    surfacePressureHpa: data.hourly.surface_pressure[idx],
    sunrise: new Date(data.daily.sunrise?.[0]).toLocaleString(),
    sunset: new Date(data.daily.sunset?.[0]).toLocaleString(),
    uvIndexMax: data.daily.uv_index_max?.[0],
    surfacePressureSummary: getSurfacePressureSummary(data.hourly.surface_pressure[idx]),
    visibilityMiles: visibilityKm,
    visibilitySummary: visibilitySummary
  };
}
