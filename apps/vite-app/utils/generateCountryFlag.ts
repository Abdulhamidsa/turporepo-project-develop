import { Countries } from '@repo/data/constants/countries';

/**
 * Get the country flag code based on country name
 * @param countryName The full country name
 * @returns The two-letter country code in lowercase for use with flag CDNs
 */
export const getCountryFlagIcon = (countryName: string | undefined | null): string => {
  if (!countryName) return ''; // No flag if no country
  const country = Countries.find((c) => c.label === countryName);
  return country?.code.toLowerCase() || ''; // Convert code to lowercase
};
