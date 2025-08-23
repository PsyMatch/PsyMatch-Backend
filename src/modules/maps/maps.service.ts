import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GeocodeResult,
  NominatimResponse,
  Coordinates,
  DistanceResult,
} from './interfaces/coordinates.interface';
import { Patient } from '../users/entities/patient.entity';
import { Psychologist } from '../psychologist/entities/psychologist.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class MapsService {
  private readonly EARTH_RADIUS_KM = 6371;
  private readonly USER_AGENT = 'PsyMatch-App';

  constructor(private readonly usersService: UsersService) {}

  async geocode(address: string): Promise<GeocodeResult> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': this.USER_AGENT },
      });

      if (!response.ok) {
        throw new Error(
          `Error en la API de geocodificación: ${response.status}`,
        );
      }

      const data = (await response.json()) as NominatimResponse[];

      if (!data || data.length === 0) {
        throw new Error(`No se pudo geocodificar la dirección: ${address}`);
      }

      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    } catch (error) {
      throw new Error(
        `Error al geocodificar "${address}": ${(error as Error).message}`,
      );
    }
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const toRad = (angle: number) => (angle * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return this.EARTH_RADIUS_KM * c;
  }

  calculateDistanceFromCoords(
    coords1: Coordinates,
    coords2: Coordinates,
  ): number {
    return this.calculateDistance(
      coords1.lat,
      coords1.lon,
      coords2.lat,
      coords2.lon,
    );
  }

  calculateProximity(
    coords1: Coordinates,
    coords2: Coordinates,
    maxDistanceKm?: number,
  ): DistanceResult {
    const distance = this.calculateDistanceFromCoords(coords1, coords2);

    return {
      distance: parseFloat(distance.toFixed(2)),
      isNearby: distance <= (maxDistanceKm || 0),
    };
  }

  async getDirections(
    patientId: string,
    psychologistId: string,
  ): Promise<{ from: string; to: string; link: string }> {
    const patient = (await this.usersService.findById(patientId)) as Patient;
    const psychologist = (await this.usersService.findById(
      psychologistId,
    )) as Psychologist;

    const link = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(patient.address)}&destination=${encodeURIComponent(psychologist.office_address)}`;
    return {
      from: patient.address,
      to: psychologist.office_address,
      link,
    };
  }

  async calculateDistanceFromAddresses(
    address1: string,
    address2: string,
    maxDistanceKm?: number,
  ): Promise<DistanceResult> {
    try {
      const [coords1, coords2] = await Promise.all([
        this.geocode(address1),
        this.geocode(address2),
      ]);

      return this.calculateProximity(coords1, coords2, maxDistanceKm);
    } catch (error) {
      throw new Error(
        `Error calculando distancia entre direcciones: ${(error as Error).message}`,
      );
    }
  }

  async filterAddressesByDistance(
    userAddress: string,
    psychoAddresses: string[],
    maxDistanceKm: number,
  ): Promise<{ address: string; distance: number }[]> {
    try {
      const userCoords = await this.geocode(userAddress);
      const psychoCoordsList = await Promise.all(
        psychoAddresses.map((addr) => this.geocode(addr)),
      );
      return psychoAddresses
        .map((address, i) => ({
          address,
          distance: Math.round(
            this.calculateDistanceFromCoords(userCoords, psychoCoordsList[i]) *
              1000,
          ),
        }))
        .filter((item) => item.distance <= maxDistanceKm * 1000);
    } catch (error) {
      throw new Error(
        `Error filtrando direcciones por distancia: ${(error as Error).message}`,
      );
    }
  }

  async getNearbyPsychologistsList(
    patientId: string,
    maxDistanceKm: number,
  ): Promise<
    Array<{
      name: string;
      email: string;
      address: string;
      distance: number;
      link: string;
    }>
  > {
    try {
      const patient = (await this.usersService.findById(patientId)) as Patient;
      const psychologistsResult = await this.usersService.findAllPsychologists({
        page: 1,
        limit: 1000,
      });
      const psychologists = psychologistsResult.data || [];
      const nearby = await this.filterAddressesByDistance(
        patient.address,
        psychologists.map((p: Psychologist) => p.office_address),
        maxDistanceKm,
      );

      if (nearby.length === 0) {
        throw new NotFoundException(
          'No se encontraron psicólogos dentro del rango especificado',
        );
      }

      const result = nearby.map((item) => {
        const psychologist = psychologists.find(
          (p: Psychologist) => p.office_address === item.address,
        );
        return {
          name: psychologist?.name || '',
          email: psychologist?.email || '',
          address: item.address,
          distance: item.distance,
          link: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(patient.address)}&destination=${encodeURIComponent(item.address)}`,
        };
      });

      return result.sort((a, b) => a.distance - b.distance);
    } catch (error) {
      throw new NotFoundException(
        `Error obteniendo psicólogos cercanos. ${(error as Error).message}`,
      );
    }
  }
}
