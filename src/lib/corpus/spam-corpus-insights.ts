/**
 * Aggregate patterns mined offline from the public Kaggle dataset
 * "Philippine Spam SMS Messages" by bwandowando (CC BY-NC-SA 4.0).
 *
 * Only derived statistics are stored here — no verbatim corpus text.
 * Families were classified with mutually-exclusive keyword rules
 * (priority: telco rewards > job > bank > gambling > e-wallet > prize),
 * so each message lands in exactly one bucket.
 */

export type CorpusFamilyId =
  | "gambling"
  | "other"
  | "bank-alerts"
  | "ewallet"
  | "prize"
  | "job-earn"
  | "telco-rewards";

export type CorpusFamily = {
  id: CorpusFamilyId;
  label: string;
  hint: string;
  count: number;
};

export type CorpusKeyword = {
  term: string;
  /** Messages whose text contains this term (case-insensitive). */
  count: number;
};

export type CorpusTld = {
  tld: string;
  count: number;
};

export const SPAM_CORPUS = {
  source: {
    name: "Philippine Spam SMS Messages",
    publisher: "bwandowando",
    url: "https://www.kaggle.com/datasets/bwandowando/philippine-spam-sms-messages",
    license: "CC BY-NC-SA 4.0",
  },

  totals: {
    messages: 1021,
    withLinks: 229,
    withPesoAmounts: 261,
    numericSenders: 970,
  },

  families: [
    {
      id: "gambling",
      label: "Betting & casino promos",
      hint: "Jackpot, slots, deposit bonuses, “trusted website” betting invites",
      count: 409,
    },
    {
      id: "other",
      label: "Mixed ads & notices",
      hint: "Real estate, events, deliveries, loan texts — spam beyond outright scams",
      count: 406,
    },
    {
      id: "bank-alerts",
      label: "Fake bank alerts",
      hint: "Account restricted / re-verification demands, often naming BDO",
      count: 70,
    },
    {
      id: "ewallet",
      label: "E-wallet credit bait",
      hint: "Unexpected GCash/Maya credits that require you to register",
      count: 54,
    },
    {
      id: "prize",
      label: "Prize & raffle hooks",
      hint: "Congratulations, winners, raffle draws with claim instructions",
      count: 37,
    },
    {
      id: "job-earn",
      label: "Earn-from-home offers",
      hint: "“Kumita habang nanonood ng YouTube”-style daily income pitches",
      count: 27,
    },
    {
      id: "telco-rewards",
      label: "Telco reward-points phishing",
      hint: "Points “expiring today” pushing fake Smart/Globe redemption pages",
      count: 18,
    },
  ] satisfies CorpusFamily[],

  keywords: [
    { term: "bonus", count: 286 },
    { term: "free", count: 153 },
    { term: "claim", count: 106 },
    { term: "register", count: 79 },
    { term: "jackpot", count: 78 },
    { term: "account", count: 69 },
    { term: "click", count: 63 },
    { term: "slot", count: 59 },
    { term: "reward", count: 57 },
    { term: "bdo", count: 57 },
  ] satisfies CorpusKeyword[],

  /** High-risk domain endings found in linked hosts (generic .com/.ph excluded). */
  tlds: [
    { tld: ".xyz", count: 23 },
    { tld: ".icu", count: 13 },
    { tld: ".online", count: 8 },
    { tld: ".live", count: 5 },
    { tld: ".cyou", count: 4 },
    { tld: ".bond", count: 3 },
    { tld: ".click", count: 3 },
    { tld: ".shop", count: 3 },
    { tld: ".buzz", count: 3 },
    { tld: ".help", count: 2 },
  ] satisfies CorpusTld[],
} as const;

export function corpusShare(count: number): number {
  return count / SPAM_CORPUS.totals.messages;
}
