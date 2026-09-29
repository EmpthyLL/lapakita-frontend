import { getAllCountryOptions } from "@/lib/countries";

export const formatDocType = (type: string) => {
  switch (type) {
    case "national_id":
      return "National ID (KTP)";
    case "passport":
      return "Passport";
    case "residence_permit":
      return "Residence Permit";
    default:
      return type;
  }
};

export const getDocumentTypeExamples = (type: string) => {
  switch (type) {
    case "national_id":
      return "Examples: National Identity Card (KTP), e-KTP, or State ID.";
    case "passport":
      return "Examples: Ordinary Passport, e-Passport, or Official Passport.";
    case "residence_permit":
      return "Examples: KITAS, KITAP, Green Card, or Residence Visa/Permit.";
    default:
      return "";
  }
};

export const getDocumentNumberLabel = (type: string) => {
  switch (type) {
    case "national_id":
      return "NIK";
    case "passport":
      return "Passport No";
    case "residence_permit":
      return "Permit No";
    default:
      return "Document No";
  }
};

export const getDocumentFieldMeta = (type: string) => {
  switch (type) {
    case "national_id":
      return {
        label: "NIK (National ID Number)",
        placeholder: "Enter 16 digits NIK",
        maxLength: 16,
        hint: "",
      };
    case "passport":
      return {
        label: "Passport Number",
        placeholder: "Enter passport number",
        maxLength: 12,
        hint: "",
      };
    case "residence_permit":
      return {
        label: "Residence Permit Number",
        placeholder: "Enter permit / KITAS / KITAP number",
        maxLength: 32,
        hint: "",
      };
    default:
      return {
        label: "Document Number",
        placeholder: "Enter document number",
        maxLength: 64,
        hint: "",
      };
  }
};

// Preset label dokumen spesifik untuk negara-negara populer/utama
const COUNTRY_DOCUMENT_LABEL_PRESETS: Record<
  string,
  Record<string, string[]>
> = {
  ID: {
    national_id: [
      "KTP",
      "e-KTP",
      "Surat Keterangan (Suket)",
      "IKD (Identitas Kependudukan Digital)",
    ],
    passport: [
      "Paspor Republik Indonesia",
      "Paspor Biasa",
      "Paspor Elektronik",
    ],
    residence_permit: ["KITAS", "KITAP", "Surat Izin Tinggal Terbatas"],
  },
  US: {
    national_id: [
      "Social Security Number (SSN)",
      "State ID Card",
      "Driver License ID",
    ],
    passport: ["US Passport", "US Passport Card"],
    residence_permit: [
      "Green Card (Permanent Resident Card)",
      "Employment Authorization Document (EAD)",
      "US Visa Stamp",
    ],
  },
  MY: {
    national_id: ["MyKad", "MyTentera", "MyPR", "MyKAS"],
    passport: ["Malaysia International Passport"],
    residence_permit: [
      "Malaysia Residence Pass (RP-T)",
      "Employment Pass (EP)",
      "MM2H Permit",
    ],
  },
  SG: {
    national_id: [
      "Singapore NRIC",
      "FIN (Foreign Identification Number)",
      "Singapore Birth Certificate",
    ],
    passport: ["Singapore Biometric Passport"],
    residence_permit: [
      "Singapore Employment Pass",
      "S Pass",
      "Long Term Visit Pass",
      "Permanent Resident Identity Card",
    ],
  },
  JP: {
    national_id: [
      "My Number Card (Individual Number Card)",
      "Notification Card",
    ],
    passport: ["Japanese Passport (Ryoken)", "Official Passport"],
    residence_permit: [
      "Residence Card (Zairyu Card)",
      "Special Permanent Resident Certificate",
    ],
  },
  GB: {
    national_id: [
      "National Insurance Number (NINO)",
      "BRP (Biometric Residence Permit)",
    ],
    passport: [
      "British Citizen Passport",
      "British Overseas Territories Passport",
    ],
    residence_permit: [
      "UK eVisa / Settled Status",
      "Skilled Worker Visa Permit",
    ],
  },
  AU: {
    national_id: [
      "Medicare Card",
      "Australian Driver Licence",
      "Proof of Age Card",
    ],
    passport: ["Australian Passport"],
    residence_permit: [
      "Permanent Resident Visa",
      "Temporary Graduate Visa",
      "Bridging Visa",
    ],
  },
  CN: {
    national_id: [
      "Resident Identity Card (居民身份证)",
      "Mainland Travel Permit (Home Return Permit)",
    ],
    passport: ["People's Republic of China Passport"],
    residence_permit: [
      "Permanent Residence Certificate",
      "Foreigner's Work Permit",
    ],
  },
  IN: {
    national_id: ["Aadhaar Card", "PAN Card", "Voter ID Card"],
    passport: ["Indian Passport"],
    residence_permit: [
      "OCI Card (Overseas Citizen of India)",
      "PIO Card",
      "Long Term Visa (LTV)",
    ],
  },
  KR: {
    national_id: [
      "Resident Registration Card (주민등록증)",
      "Driver's License",
    ],
    passport: ["South Korean Passport"],
    residence_permit: [
      "Alien Registration Card (ARC)",
      "Permanent Residence Card (F-5)",
    ],
  },
};

export function getDocumentLabelPresets(
  countryCode: string,
  docType: string,
): string[] {
  const upperCode = countryCode?.toUpperCase();
  const countryPresets = COUNTRY_DOCUMENT_LABEL_PRESETS[upperCode];

  if (countryPresets && countryPresets[docType]) {
    return countryPresets[docType];
  }

  const allCountries = getAllCountryOptions();
  const foundCountry = allCountries.find((c) => c.value === upperCode);
  const countryName = foundCountry ? foundCountry.name : "National";

  switch (docType) {
    case "national_id":
      return [
        `${countryName} National ID`,
        `${countryName} Identity Card`,
        `${countryName} Citizens ID`,
        `${countryName} State ID / Tax ID`,
      ];
    case "passport":
      return [
        `${countryName} Passport`,
        `${countryName} Ordinary Passport`,
        `${countryName} Electronic Passport`,
      ];
    case "residence_permit":
      return [
        `${countryName} Residence Permit`,
        `${countryName} Work Visa Permit`,
        `${countryName} Permanent Residence Visa`,
        `${countryName} Long Stay Permit`,
      ];
    default:
      return [
        `${countryName} Primary Document`,
        `${countryName} Official Identification`,
      ];
  }
}

export function getDefaultDocumentLabel(
  countryCode: string,
  docType: string,
): string {
  const presets = getDocumentLabelPresets(countryCode, docType);
  return presets[0] || "Official Document";
}
