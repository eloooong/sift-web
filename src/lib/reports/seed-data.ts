import type { CommunityReport, ModerationStatus } from "./types";
import type { ScamCategoryId } from "@/lib/scam-detector/categories";

export type SeedInput = {
  categoryId: ScamCategoryId;
  platform: CommunityReport["platform"];
  description: string;
  sender: string | null;
  daysAgo: number;
  riskScore: number;
  status?: ModerationStatus;
  confirmations?: number;
  rejectionReason?: string | null;
};

/**
 * Seeded demo reports — realistic Philippine scam formats written as
 * anonymized community submissions. The final entries demonstrate the
 * moderation states (pending / rejected) that never appear in the feed.
 */
export const REPORT_SEEDS: SeedInput[] = [
  {
    categoryId: "e-wallet-scam",
    platform: "sms",
    description:
      "Text claiming my GCash verification failed and the account would be permanently locked in 2 hours unless I replied with the OTP sent to me. The number was a regular prepaid SIM, not an official GCash sender ID.",
    sender: "+•••• •••••• •67",
    daysAgo: 1,
    riskScore: 92,
    confirmations: 41,
  },
  {
    categoryId: "prize-scam",
    platform: "sms",
    description:
      "Congratulations message saying my SIM number won P950,000 in a PCSO anniversary raffle I never joined. They asked for a P2,500 tax fee via e-wallet plus my full name and birthday to release the check.",
    sender: null,
    daysAgo: 2,
    riskScore: 88,
    confirmations: 27,
  },
  {
    categoryId: "investment-scam",
    platform: "viber",
    description:
      "Added to a VIP crypto trading group without joining. Admin posted screenshots of weekly 40% returns and pressured everyone to invest before midnight because registration closes tonight. A member who asked questions got removed.",
    sender: "Ad••• •n",
    daysAgo: 3,
    riskScore: 95,
    confirmations: 19,
  },
  {
    categoryId: "delivery-scam",
    platform: "sms",
    description:
      "LBC text saying my parcel is on hold for an unpaid P185 delivery fee, payable only through a personal GCash number. I wasn't expecting any package and the tracking number doesn't exist on LBC's site.",
    sender: null,
    daysAgo: 4,
    riskScore: 74,
    confirmations: 33,
  },
  {
    categoryId: "online-job-scam",
    platform: "messenger",
    description:
      "Recruited as an online product reviewer earning P4,000 daily for rating items from home. Before any tasks they required a P350 activation fee sent to a Maya account under a name that didn't match the company.",
    sender: "Ka••• 88",
    daysAgo: 5,
    riskScore: 81,
    confirmations: 22,
  },
  {
    categoryId: "bank-scam",
    platform: "sms",
    description:
      "Message from BDO Security about unusual logins, warning my access would be restricted in 12 hours. The link went to bdo-online-secure.xyz — clearly not the real domain. My actual banking app showed nothing wrong.",
    sender: "bdo-online-secure.xyz",
    daysAgo: 7,
    riskScore: 90,
    confirmations: 38,
  },
  {
    categoryId: "government-impersonation",
    platform: "email",
    description:
      "Email claiming SSS contribution records show a discrepancy, threatening suspension of benefits and a filed case unless I validate my membership within 24 hours through a .top domain link.",
    sender: "sss-member-revalidate.top",
    daysAgo: 8,
    riskScore: 86,
    confirmations: 12,
  },
  {
    categoryId: "loan-scam",
    platform: "sms",
    description:
      "Pre-approved P200,000 loan with no documents needed, released in 24 hours — but they demanded a P1,800 release fee first via e-wallet. The lender isn't in the SEC's registered list.",
    sender: null,
    daysAgo: 10,
    riskScore: 78,
    confirmations: 16,
  },
  {
    categoryId: "phishing",
    platform: "email",
    description:
      "Lazada refund notice for P1,240 with a 24-hour claim window. The link led to a lookalike login page asking for my email and password first to verify the wallet. Hovering the button showed a .buzz domain.",
    sender: "lazada-refund-claim.buzz",
    daysAgo: 12,
    riskScore: 83,
    confirmations: 25,
  },
  {
    categoryId: "romance-scam",
    platform: "dating-app",
    description:
      "Match claiming to be a doctor on a mission ship abroad. After two weeks of daily messages, customs suddenly held his gift box and he asked for P8,500 clearance fees. Refused every video call request.",
    sender: "Ja••• •s",
    daysAgo: 14,
    riskScore: 71,
    confirmations: 9,
  },
  // Pending — visible only to moderators until approved.
  {
    categoryId: "account-verification-scam",
    platform: "instagram",
    description:
      "DM from an account copying Meta's verified badge style, saying my profile was selected for verification but I must confirm via their link within 6 hours or lose the blue check. The link asked for my login.",
    sender: null,
    daysAgo: 3,
    riskScore: 69,
    status: "pending",
  },
  {
    categoryId: "other",
    platform: "marketplace",
    description:
      "Seller on a marketplace app insisted on moving to Telegram and paying through a sketchy buyer-protection site before shipping. The site looked days old and had no contact details.",
    sender: null,
    daysAgo: 5,
    riskScore: 58,
    status: "pending",
  },
  // Rejected by auto-moderation — link spam.
  {
    categoryId: "e-wallet-scam",
    platform: "whatsapp",
    description:
      "WINNER WINNER click here claim your bonus now now now limited slots click fast bit.ly/xxxx cutt.ly/yyyy gcash-win.top/claim",
    sender: null,
    daysAgo: 1,
    riskScore: 40,
    status: "rejected",
    rejectionReason: "spam-links",
  },
];
