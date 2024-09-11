import { Country } from "./country.interface"
import { Region } from "./region.type"

export interface CacheStore {
  byCapital:    ValueCountries,
  byCountries:  ValueCountries,
  byRegion:     RegionCountries
}

export interface ValueCountries {
  value:      string,
  countries:  Country[]
}

export interface RegionCountries {
  value:     Region,
  countries:  Country[]
}
