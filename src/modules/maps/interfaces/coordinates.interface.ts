export interface Coordinates {
  lat: number;
  lon: number;
}

export interface GeocodeResult {
  lat: number;
  lon: number;
}

export interface DistanceResult {
  distance: number;
  isNearby: boolean;
}

export interface NominatimResponse {
  lat: string;
  lon: string;
}
