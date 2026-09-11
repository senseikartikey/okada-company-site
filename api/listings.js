// Sample listings for the demo. These are invented for the hackathon demo and
// are not real availabilities; the assistant is told to say so.
export const LISTINGS = [
  {
    id: "OKC-101",
    address: "1412 Broadway, 22nd Floor",
    neighborhood: "Garment District, Manhattan",
    use: "Office",
    sizeSqFt: 4200,
    askingRentPsf: 62,
    term: "5–10 years",
    availability: "Immediate",
    features: ["Pre-built suite", "12 offices + open floor", "Two conference rooms", "Views south to Herald Square"],
  },
  {
    id: "OKC-118",
    address: "260 Madison Avenue, 8th Floor",
    neighborhood: "Murray Hill, Manhattan",
    use: "Office",
    sizeSqFt: 2650,
    askingRentPsf: 55,
    term: "3–7 years",
    availability: "1 March 2026",
    features: ["Corner unit", "Polished concrete", "Pantry", "24/7 building access"],
  },
  {
    id: "OKC-204",
    address: "45-18 Court Square West, Ground Floor",
    neighborhood: "Long Island City, Queens",
    use: "Retail / showroom",
    sizeSqFt: 1900,
    askingRentPsf: 48,
    term: "5 years",
    availability: "Immediate",
    features: ["30 ft of frontage", "14 ft ceilings", "Roll-down gate", "Steps from Court Sq station"],
  },
  {
    id: "OKC-233",
    address: "72 Allen Street, 2nd Floor",
    neighborhood: "Lower East Side, Manhattan",
    use: "Creative loft",
    sizeSqFt: 3100,
    askingRentPsf: 51,
    term: "3–5 years",
    availability: "15 February 2026",
    features: ["Exposed brick", "Skylights", "Freight elevator", "Wet pantry"],
  },
  {
    id: "OKC-310",
    address: "195 Montague Street, 14th Floor",
    neighborhood: "Brooklyn Heights, Brooklyn",
    use: "Office",
    sizeSqFt: 6800,
    askingRentPsf: 58,
    term: "7–10 years",
    availability: "1 June 2026",
    features: ["Full floor", "Harbour views", "Raised floor", "Bike room"],
  },
  {
    id: "OKC-402",
    address: "530 Seventh Avenue, 19th Floor",
    neighborhood: "Midtown South, Manhattan",
    use: "Office / showroom",
    sizeSqFt: 5400,
    askingRentPsf: 66,
    term: "5–10 years",
    availability: "Immediate",
    features: ["Showroom front", "Sample storage", "Two freight elevators", "Penn Station in 5 minutes"],
  },
];

export const listingsAsText = () =>
  LISTINGS.map(
    (l) =>
      `${l.id} — ${l.address} (${l.neighborhood}). ${l.use}, ${l.sizeSqFt.toLocaleString()} sq ft, asking $${l.askingRentPsf}/sq ft/year, term ${l.term}, available ${l.availability}. Features: ${l.features.join(", ")}.`,
  ).join("\n");
