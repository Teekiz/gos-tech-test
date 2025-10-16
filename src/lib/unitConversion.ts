export function toFahrenheit(celsius: number): number {
    return celsius * 1.8 + 32;
}

export function kmhToMph(kmh: number): number {
    return kmh / 1.609344;
}

export function metersToMiles(m: number): number {
    return Math.round((m / 1000) *  0.6214);
}
