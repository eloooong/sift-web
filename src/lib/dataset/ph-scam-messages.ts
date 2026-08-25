/**
 * Aggregated statistics from the public dataset
 * "Sino 'To?! — ScamMessagesPhilippines" by Anton Reyes.
 *
 * https://github.com/AGR-Yes/ScamMessagesPhilippines
 *
 * Only derived statistics are stored here — no verbatim message text.
 * Figures were computed from the processed CSVs (select.csv, proof_cleaned.csv,
 * top100_words.csv, incidents.csv) in the repository.
 */

export type NetworkSlice = {
  network: string;
  count: number;
  share: number;
};

export type RegionalIncident = {
  region: string;
  /** Incidents per 100,000 population */
  rate: number;
};

export type ScamTypeSlice = {
  /** Raw label from the dataset */
  rawType: string;
  count: number;
  share: number;
};

export type KeywordEntry = {
  word: string;
  count: number;
};

export const PH_SCAM_MESSAGES = {
  source: {
    name: "Sino 'To?! — ScamMessagesPhilippines",
    publisher: "Anton Reyes (AGR-Yes)",
    url: "https://github.com/AGR-Yes/ScamMessagesPhilippines",
    license: "Public",
  },

  totals: {
    /** select.csv — unique report records with phone number, network, and scam type */
    reports: 5545,
    /** proof_cleaned.csv — NLP-classified messages with extracted tokens */
    classified: 1415,
    /** spam.csv — raw message texts with timestamps */
    rawMessages: 259,
  },
} as const;

/**
 * Telecom network distribution from select.csv (5,351 records with valid network).
 * Smart/TNT dominates at 65%, Globe/TM at 23%.
 */
export const NETWORK_DISTRIBUTION: NetworkSlice[] = [
  { network: "Smart / Talk 'N Text", count: 3494, share: 3494 / 5351 },
  { network: "Globe / TM", count: 1240, share: 1240 / 5351 },
  { network: "Sun Cellular", count: 134, share: 134 / 5351 },
  { network: "Other / Unknown", count: 483, share: 483 / 5351 },
];

/**
 * Regional incident rates from incidents.csv.
 * Values are incidents per 100,000 population.
 * NCR, Region 3, and Region 6 have the highest rates.
 */
export const REGIONAL_INCIDENTS: RegionalIncident[] = [
  { region: "NCR", rate: 2739.52 },
  { region: "Region 3", rate: 3484.73 },
  { region: "Region 6", rate: 2778.36 },
  { region: "Region 4-A", rate: 2426.91 },
  { region: "Region 7", rate: 1366.43 },
  { region: "CARAGA", rate: 500.0 },
  { region: "BARMM", rate: 390.48 },
  { region: "Region 12", rate: 390.41 },
  { region: "Region 4-B", rate: 386.18 },
  { region: "Region 10", rate: 374.01 },
  { region: "Region 8", rate: 367.73 },
  { region: "Region 11", rate: 189.71 },
  { region: "Region 1", rate: 113.3 },
  { region: "Region 9", rate: 116.92 },
  { region: "CAR", rate: 112.6 },
  { region: "Region 5", rate: 94.22 },
  { region: "Region 2", rate: 83.33 },
];

/**
 * Scam type breakdown from proof_cleaned.csv (1,415 classified records).
 * Top categories only — small categories grouped as "other".
 */
export const SCAM_TYPE_BREAKDOWN: ScamTypeSlice[] = [
  { rawType: "Casino / Gambling", count: 632, share: 632 / 1415 },
  { rawType: "Others", count: 597, share: 597 / 1415 },
  { rawType: "Not Specified", count: 512, share: 512 / 1415 },
  { rawType: "Online Games", count: 354, share: 354 / 1415 },
  { rawType: "Work / Job Offer", count: 313, share: 313 / 1415 },
  { rawType: "Money / Investment", count: 272, share: 272 / 1415 },
  { rawType: "Loan / Bank", count: 256, share: 256 / 1415 },
  { rawType: "Raffle / Play", count: 234, share: 234 / 1415 },
  { rawType: "Products", count: 206, share: 206 / 1415 },
  { rawType: "Online Shopping", count: 181, share: 181 / 1415 },
  { rawType: "Email", count: 150, share: 150 / 1415 },
  { rawType: "Claiming / Unclaimed Bonus", count: 241, share: 241 / 1415 },
];

/** Top 20 keywords from top100_words.csv. */
export const TOP_KEYWORDS: KeywordEntry[] = [
  { word: "now", count: 157 },
  { word: "bonus", count: 122 },
  { word: "message", count: 68 },
  { word: "lights", count: 67 },
  { word: "register", count: 64 },
  { word: "cash", count: 63 },
  { word: "makakuha", count: 63 },
  { word: "screenshot", count: 62 },
  { word: "compiled", count: 61 },
  { word: "spam", count: 61 },
  { word: "get", count: 55 },
  { word: "free", count: 51 },
  { word: "click", count: 46 },
  { word: "solar", count: 45 },
  { word: "win", count: 42 },
  { word: "name", count: 42 },
  { word: "proof", count: 40 },
  { word: "buy", count: 39 },
  { word: "manalo", count: 38 },
  { word: "play", count: 37 },
];
