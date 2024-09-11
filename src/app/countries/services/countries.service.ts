import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  private apiUrl: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital: { value: '', countries: [] },
    byCountries: { value: '', countries: [] },
    byRegion: { value: '', countries: [] },
  }

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage(): void {
    if (!localStorage.getItem('cacheStore')) return;

    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);
  }

  private getCountriesRequest(url: string): Observable<Country[]> {
    return this.http.get<Country[]>(url)
      .pipe(
        catchError(error => of([])),
        // delay(1500)
      );
  }

  searchCountryByAlphaCode(query: string): Observable<Country | null> {
    const url = `${this.apiUrl}/alpha/${query}`;
    return this.http.get<Country[]>(url)
      .pipe(
        map(countries => countries.length > 0 ? countries[0] : null),
        catchError(error => of(null))
      );
  }

  searchCapital(value: string): Observable<Country[]> {
    const url = `${this.apiUrl}/capital/${value}`;
    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => this.cacheStore.byCapital = { value, countries }),
        tap(() => this.saveToLocalStorage())
      );
  }

  searchCountry(value: string): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${value}`;
    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => this.cacheStore.byCountries = { value, countries }),
        tap(() => this.saveToLocalStorage())
      );
  }

  searchRegion(value: Region): Observable<Country[]> {
    const url = `${this.apiUrl}/region/${value}`;
    return this.getCountriesRequest(url)
      .pipe(
        tap(countries => this.cacheStore.byRegion = { value, countries }),
        tap(() => this.saveToLocalStorage())
      );
  }
}
