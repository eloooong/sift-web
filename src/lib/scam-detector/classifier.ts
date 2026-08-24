import {
  scamCategoryById,
  type ScamCategoryDef,
} from "./categories";
import { findBrandMentions, summarizeBrandGroups } from "./brands";
import type { DetectedSignal, SignalCategoryId } from "./types";

const DELIVERY_CONTEXT_REGEX =
  /parcel|package|delivery|shipment|courier|padala|balikbayan/i;

function hasSignal(signals: DetectedSignal[], id: string): boolean {
  return signals.some((signal) => signal.id === id);
}

export function classifyScam(
  text: string,
  signals: DetectedSignal[],
  totals: Array<{ category: SignalCategoryId; total: number }>,
  primary: SignalCategoryId | null
): ScamCategoryDef | null {
  if (signals.length === 0) return null;

  const lower = text.toLowerCase();
  const groups = summarizeBrandGroups(findBrandMentions(lower));

  const indicatorTotal = (category: SignalCategoryId): number =>
    totals.find((row) => row.category === category)?.total ?? 0;

  // Government impersonation (SSS, PhilHealth, BIR, PNP, NBI, LTO, PAGCOR…)
  const government = groups.get("government");
  if (government && !government.paymentOnly) {
    if (indicatorTotal("prize") >= 20) return scamCategoryById("prize-scam");
    return scamCategoryById("government-impersonation");
  }

  // E-wallet impersonation (GCash / Maya / Coins.ph as the target account)
  const ewallet = groups.get("ewallet");
  if (ewallet && !ewallet.paymentOnly) {
    return scamCategoryById("e-wallet-scam");
  }

  // Bank impersonation or bank context with credential threats
  const bank = groups.get("bank");
  if (
    bank &&
    (!bank.paymentOnly ||
      hasSignal(signals, "credential.suspension") ||
      hasSignal(signals, "credential.verify-account"))
  ) {
    return scamCategoryById("bank-scam");
  }

  // Courier / parcel fee scams (LBC, J&T Express…)
  const courier = groups.get("courier");
  const marketplace = groups.get("marketplace");
  const transport = groups.get("transport");

  if (courier && (!courier.paymentOnly || DELIVERY_CONTEXT_REGEX.test(lower))) {
    return scamCategoryById("delivery-scam");
  }
  if (
    marketplace &&
    !marketplace.paymentOnly &&
    DELIVERY_CONTEXT_REGEX.test(lower)
  ) {
    return scamCategoryById("delivery-scam");
  }
  if (marketplace && !marketplace.paymentOnly) {
    return scamCategoryById("phishing");
  }
  if (transport && !transport.paymentOnly) {
    return scamCategoryById("phishing");
  }

  // Content-driven classification when no brand is impersonated
  if (indicatorTotal("investment") >= 10) {
    return scamCategoryById("investment-scam");
  }
  if (indicatorTotal("loan") >= 10) {
    return scamCategoryById("loan-scam");
  }
  if (indicatorTotal("romance") >= 8) {
    return scamCategoryById("romance-scam");
  }
  if (hasSignal(signals, "financial.otp")) {
    return scamCategoryById("account-verification-scam");
  }

  switch (primary) {
    case "prize":
      return scamCategoryById("prize-scam");
    case "job":
      return scamCategoryById("online-job-scam");
    case "credential":
      return scamCategoryById("account-verification-scam");
    case "link":
      return scamCategoryById("phishing");
    case "financial": {
      const paysViaEwallet = groups.get("ewallet") !== undefined;
      const mentionsBank = groups.get("bank") !== undefined;
      if (paysViaEwallet) return scamCategoryById("e-wallet-scam");
      if (mentionsBank) return scamCategoryById("bank-scam");
      return scamCategoryById("other");
    }
    case "urgency":
      return scamCategoryById(lower.includes("http") || lower.includes("www.") ? "phishing" : "other");
    default:
      return scamCategoryById("other");
  }
}
