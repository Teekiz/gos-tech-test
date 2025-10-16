import {weatherCodeHashMap} from "@/lib/weatherCodes";

//a function to convert the surface pressure (hPa) from a numerical value to a description
export function getSurfacePressureSummary(surfacePressureHpa: number): string {
    if (surfacePressureHpa < 1000){
        return "Low"
    } else if (surfacePressureHpa >= 1020){
        return "High"
    } else {
        return "Average"
    }
}

//takes the viewable distance in meters and converts it into a summary
export function getVisibilityIndexSummary(visibility: number): string {
    if (visibility <= 1000){return "Very Poor"}
    else if (visibility > 1000 && visibility <= 4000){return "Poor"}
    else if (visibility > 4000 && visibility <= 10000){return "Moderate"}
    else if (visibility > 10000 && visibility <= 20000){return "Good"}
    else if (visibility > 20000 && visibility <= 40000){return "Very Good"}
    else {return "Excellent"}
}

export function getWeatherCodeSummary(code: number): string {
    if (!code) {
        return "Clear sky";
    }

    const summary = weatherCodeHashMap.get(code);

    return !summary ? `Code ${code}` : summary;
}