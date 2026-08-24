import type { SignalCategoryId } from "./types";

const CATEGORY_ACTIONS: Record<SignalCategoryId, string[]> = {
  prize: [
    "Do not reply, click links, or pay any “claim” fee.",
    "Real raffles never require payment to release winnings.",
    "Verify with the organization’s official channels — never the contact details in the message.",
  ],
  financial: [
    "Do not send money or share wallet or bank details.",
    "Call the company’s official hotline to confirm any supposed charge.",
    "Legitimate companies never collect fees through personal e-wallet or remittance numbers.",
    "If you already paid, contact your e-wallet or bank immediately to attempt a recall.",
  ],
  credential: [
    "Do not open the link or enter your login details.",
    "If you already did, change your password and enable two-factor authentication right away.",
    "Open the official app or type the website address manually instead of trusting the message.",
  ],
  link: [
    "Do not tap the link.",
    "Inspect the domain closely — scammers use lookalike spellings of real sites.",
    "Access the service only through its official app or website.",
  ],
  job: [
    "Never pay to apply or to “activate” a work offer.",
    "Research the company; legitimate recruiters do not collect fees from applicants.",
    "Ask for an official company email address and verify the recruiter’s identity.",
  ],
  urgency: [
    "Slow down — artificial deadlines are a pressure tactic.",
    "Verify the claim through an official channel before acting on it.",
    "Talk to someone you trust before responding.",
  ],
  investment: [
    "Do not deposit money with anyone soliciting investments over chat or text.",
    "Check the company against the SEC’s advisory and registered lists (sec.gov.ph).",
    "Guaranteed high daily returns are impossible — that promise alone is disqualifying.",
  ],
  loan: [
    "Never pay advance “release” fees — legitimate lenders deduct fees from proceeds.",
    "Verify the lender against SEC-registered lending companies and BSP-accredited firms.",
    "Do not send ID photos or selfies to unverified lenders; they fuel identity fraud.",
  ],
  romance: [
    "Be cautious with online contacts who profess love quickly without meeting.",
    "Never pay customs, tickets, or hospital bills for someone you have not met in person.",
    "Request a spontaneous video call — scammers consistently avoid live verification.",
  ],
};

const SAFE_DEFAULT_ACTIONS = [
  "Stay cautious even without clear red flags.",
  "Never share OTPs, PINs, or passwords — no legitimate company will ask for them.",
];

const OTP_ACTION =
  "Never share OTPs, PINs, or passwords — no legitimate company will ask for them.";

const BLOCK_ACTION = "Block the number or account that sent this message.";

const REPORT_ACTION =
  "Report the message to the platform or telco you received it through.";

const WARN_ACTION =
  "Warn family and friends — especially seniors who receive these often.";

export function buildRecommendedActions(
  primaryCategory: SignalCategoryId | null,
  riskScore: number
): string[] {
  const actions = primaryCategory
    ? [...CATEGORY_ACTIONS[primaryCategory]]
    : [...SAFE_DEFAULT_ACTIONS];

  if (riskScore >= 50) {
    actions.push(OTP_ACTION, BLOCK_ACTION);
  }
  if (primaryCategory || riskScore >= 30) {
    actions.push(REPORT_ACTION);
  }
  if (riskScore >= 50) {
    actions.push(WARN_ACTION);
  }

  return actions.slice(0, 7);
}
