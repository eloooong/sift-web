import { analyzeMessage, type RiskLevel } from "@/lib/scam-detector";

export type { RiskLevel };

export type ScamExample = {
  id: string;
  label: string;
  category: string;
  channel: string;
  riskLevel: RiskLevel;
  riskScore: number;
  summary: string;
  redFlags: string[];
  sampleText: string;
};

const EXAMPLE_SEEDS = [
  {
    id: "prize-scam",
    label: "Prize Scam",
    category: "Prize Scam",
    channel: "SMS",
    summary:
      "A text claiming you won a raffle you never joined, demanding a fee before you can claim your winnings.",
    redFlags: [
      "Raffle you never joined",
      "Pay-to-claim fee via GCash",
      "24-hour deadline pressure",
      "Recycled DTI permit number",
    ],
    sampleText:
      "CONGRATULATIONS! Your SIM number was picked in the PAGCOR Anniversary Raffle. You have WON P850,000.00! To claim your cash prize, text your FULL NAME, ADDRESS and BIRTHDAY to 0969-XXX-XXXX and pay the PHP1,500 processing fee through GCash TODAY. Claim period ends in 24 HOURS. This is not a joke. DTI-NCR Permit No. 0892 Series of 2026.",
  },
  {
    id: "gcash-scam",
    label: "GCash Scam",
    category: "E-wallet Scam",
    channel: "SMS",
    summary:
      "A fake GCash security alert pushing you to a lookalike verification link to steal your login and MPIN.",
    redFlags: [
      "Impersonates GCash support",
      "Threatens permanent account closure",
      "Suspicious shortened link (bit.ly)",
      "Panic-inducing language",
    ],
    sampleText:
      "[GCASH] ALERT: Your account will be PERMANENTLY DEACTIVATED within 24 hours because your identity verification FAILED. Immediately confirm your account here: https://bit.ly/gcash-verifyy to avoid losing access to your money. Reply STOP to opt out. - GCash Team",
  },
  {
    id: "delivery-scam",
    label: "Delivery Scam",
    category: "Delivery Scam",
    channel: "SMS",
    summary:
      "A courier-themed text inventing an unpaid shipping fee, paid straight to a personal e-wallet number.",
    redFlags: [
      "Unexpected package you did not order",
      "Unpaid fee paid to personal number",
      "6-hour ultimatum",
      "Courier branding used loosely",
    ],
    sampleText:
      "[J&T EXPRESS] Dear customer, your parcel No. JT2639845710 is ON HOLD at our hub due to UNPAID DELIVERY FEE of P180.00. Settle the amount via GCash to 0917-XXX-XXXX within 6 hours or your parcel will be RETURNED TO SENDER. Thank you!",
  },
  {
    id: "fake-job-scam",
    label: "Fake Job Scam",
    category: "Online Job Scam",
    channel: "Messenger",
    summary:
      "An unsolicited work-from-home offer with unrealistic pay that starts with a registration fee.",
    redFlags: [
      "Job offer you never applied for",
      "High daily pay for simple tasks",
      "Upfront membership fee via Maya",
      "Scarcity pressure (limited slots)",
    ],
    sampleText:
      "GOOD NEWS! You have been SELECTED as an Online Product Reviewer for a top shopping platform. Work from home and earn PHP3,000-PHP5,000 DAILY just by rating products! No experience needed. To activate your account, register now and pay the membership fee of PHP299 via Maya. Only 10 slots left. Message Admin Karen to reserve.",
  },
] as const;

function buildExample(seed: (typeof EXAMPLE_SEEDS)[number]): ScamExample {
  const report = analyzeMessage(seed.sampleText);
  return {
    ...seed,
    redFlags: [...seed.redFlags],
    riskLevel: report.riskLevel,
    riskScore: report.riskScore,
  };
}

export const EXAMPLE_SCAMS: ScamExample[] = EXAMPLE_SEEDS.map(buildExample);

export const MAX_INPUT_CHARS = 5000;
