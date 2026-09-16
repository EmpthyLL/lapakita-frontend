import { Country } from "country-state-city";

export interface CountryPhoneOption {
  label: string; // "Indonesia +62" -> agar bisa dicari via search bar
  value: string; // "+62"
  name: string; // "Indonesia"
  code: string; // "ID"
  flag: string; // URL SVG bendera
}

export function getAllCountryPhoneOptions(): CountryPhoneOption[] {
  const countries = Country.getAllCountries();
  return countries.map((c) => {
    const isoLower = c.isoCode.toLowerCase();
    const flagUrl = `https://flagcdn.com/${isoLower}.svg`;
    const phoneCode = c.phonecode.startsWith("+")
      ? c.phonecode
      : `+${c.phonecode}`;

    return {
      label: `${c.name} ${phoneCode}`,
      value: phoneCode,
      name: c.name,
      code: c.isoCode,
      flag: flagUrl,
    };
  });
}
