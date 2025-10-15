export function toFahrenheit(celsius: number): number {
    return celsius * 1.8 + 32;
}

export function kmhToMph(kmh: number): number {
    return kmh / 1.609344;
}

//a function to convert the surface pressure (hPa) from a numerical value to a description
export function surfacePressureSummary(surfacePressureHpa: number): string {
    if (surfacePressureHpa < 1000){
        return "Low"
    } else if (surfacePressureHpa >= 1020){
        return "High"
    } else {
        return "Average"
    }
}
