import { Countries } from "@repo/data/constants/countries";

export const getCountryFlagIcon = (countryName: string | undefined): string => {
  if (!countryName) return ""; // No flag if no country
  const country = Countries.find((c) => c.label === countryName);
  return country?.code.toLowerCase() || ""; // Convert code to lowercase
};
