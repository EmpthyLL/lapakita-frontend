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
