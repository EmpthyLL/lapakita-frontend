import { Country } from "country-state-city";

export interface CountryOption {
  label: string; // "Indonesia" (Nama murni negara untuk pilihan/search)
  value: string; // ISO Code (misal: "ID")
  name: string; // "Indonesia"
  code: string; // "ID"
  phoneCode: string; // "+62" (Disimpan terpisah untuk kebutuhan telepon jika diperlukan)
  flag: string; // URL SVG bendera
}

// 1. Fungsi General Utama untuk mengambil seluruh opsi negara
export function getAllCountryOptions(): CountryOption[] {
  const countries = Country.getAllCountries();
  return countries.map((c) => {
    const isoLower = c.isoCode.toLowerCase();
    const flagUrl = `https://flagcdn.com/${isoLower}.svg`;
    const phoneCode = c.phonecode.startsWith("+")
      ? c.phonecode
      : `+${c.phonecode}`;

    return {
      label: c.name,
      value: c.isoCode,
      name: c.name,
      code: c.isoCode,
      phoneCode: phoneCode,
      flag: flagUrl,
    };
  });
}

// 2. Satu fungsi general pintar untuk Get berdasarkan Code (ISO) ATAU Dial Code
export function getCountryBy(query: string): CountryOption | undefined {
  if (!query) return undefined;

  const cleanQuery = query.trim();
  const options = getAllCountryOptions();

  // Cek apakah query berupa dial code (diawali "+" atau berupa angka telepon) atau ISO code
  const isDialCode = cleanQuery.startsWith("+") || /^\d+$/.test(cleanQuery);
  const normalizedDialCode = cleanQuery.startsWith("+")
    ? cleanQuery
    : `+${cleanQuery}`;

  return options.find((opt) => {
    if (isDialCode) {
      return opt.phoneCode === normalizedDialCode;
    } else {
      return opt.code.toLowerCase() === cleanQuery.toLowerCase();
    }
  });
}

// Helper khusus bendera menggunakan fungsi universal di atas
export function getCountryFlag(query: string): string {
  const found = getCountryBy(query);
  return found?.flag || "https://flagcdn.com/id.svg";
}

export const countrySearchList = getAllCountryOptions().map((opt) => ({
  label: opt.label,
  value: opt.value,
  icon: opt.flag,
}));
