export type ScamCategoryId =
  | "bank-scam"
  | "e-wallet-scam"
  | "prize-scam"
  | "delivery-scam"
  | "online-job-scam"
  | "loan-scam"
  | "government-impersonation"
  | "account-verification-scam"
  | "investment-scam"
  | "romance-scam"
  | "phishing"
  | "other";

export type ScamCategoryDef = {
  id: ScamCategoryId;
  label: string;
  description: string;
  warningSigns: string[];
  whatToDo: string[];
  exampleChannel: string;
  exampleText: string;
};

export const SCAM_CATEGORIES: ScamCategoryDef[] = [
  {
    id: "bank-scam",
    label: "Bank Scam",
    description:
      "Messages pretending to be BDO, BPI, Metrobank, Security Bank, Landbank, and other Philippine banks. They invent account problems to make you confirm details or move money through fake links and hotlines.",
    warningSigns: [
      "“Your account will be closed/deactivated today”",
      "A bank you don’t use suddenly texts you about a “problem”",
      "Links that look almost like the real online banking site",
      "Requests for your PIN, OTP, or card number",
      "“Confirm your identity” instructions inside SMS or Viber",
    ],
    whatToDo: [
      "Never click links or call numbers inside the message.",
      "Open your bank’s official app or type its website yourself.",
      "Call only the hotline printed on your card or passbook.",
      "If you already replied, call the bank immediately to freeze access.",
    ],
    exampleChannel: "SMS",
    exampleText:
      "[BDO] Unusual login detected on your account. Your access will be RESTRICTED within 12 hours unless you confirm at bdo-online-secure.xyz/login immediately. - BDO Security Team",
  },
  {
    id: "e-wallet-scam",
    label: "E-wallet Scam",
    description:
      "Fake GCash, Maya, or Coins.ph alerts claiming verification failures, expired wallets, or refunds. The goal is your MPIN, OTP, or a “verification” payment straight to the scammer’s wallet.",
    warningSigns: [
      "“Your GCash/Maya account will be permanently closed”",
      "MPIN or OTP requested “for verification”",
      "Lookalike domains like gcash-verifyy.cc or maya1-login.site",
      "Refund or cashback you never requested",
      "Payment “released” to a wrong number, asking you to “return” it",
    ],
    whatToDo: [
      "Treat any MPIN/OTP request as theft and share it with no one.",
      "Verify only inside the official GCash/Maya app.",
      "Screenshot the message and report via the app’s official help center.",
      "Warn family members; e-wallet texts are the most common scam format in PH.",
    ],
    exampleChannel: "SMS",
    exampleText:
      "[GCASH] Your wallet verification has FAILED. Send the OTP sent to you plus your MPIN to 0969XXX4567 within 2 hours or your account will be permanently locked. Reply STOP to opt out.",
  },
  {
    id: "prize-scam",
    label: "Prize Scam",
    description:
      "The classic Filipino text scam: you “won” a PCSO, PAGCOR, or TV-show raffle you never joined, yet you must first pay a processing or tax fee to release winnings that never existed.",
    warningSigns: [
      "You joined no raffle, yet you “won”",
      "Fees for “processing”, “tax”, or “release” before payout",
      "DTI/PAGCOR permit numbers copied from real notices",
      "24-hour claim deadlines with heavy pressure",
      "Prizes in the hundreds of thousands of pesos",
    ],
    whatToDo: [
      "Real raffles never ask winners to pay anything to claim.",
      "Verify draws only on PAGCOR/PCSO official pages or hotlines.",
      "Do not send your name, address, or birthday to strangers.",
      "Report to the NTC or your telco’s spam report channel.",
    ],
    exampleChannel: "SMS",
    exampleText:
      "CONGRATULATIONS! Your SIM no. was picked in the PCSO Anniversary Raffle. You WON P950,000.00! Pay the P2,500 tax fee via GCash TODAY to release your check. DTI Permit 0842 s.2026.",
  },
  {
    id: "delivery-scam",
    label: "Delivery Scam",
    description:
      "Courier-themed texts from “LBC”, “J&T Express”, or marketplace orders claiming an unpaid delivery or customs fee on a package you never ordered, payable to a personal e-wallet number.",
    warningSigns: [
      "Package on hold for an unpaid fee of ₱50–₱300",
      "Tracking numbers you can’t find on the courier’s real site",
      "Payment demanded to a personal GCash/Maya number",
      "“Return to sender” threats with short ultimatums",
      "You have no pending order from that shop",
    ],
    whatToDo: [
      "Track the tracking number only on the courier’s official site or app.",
      "Real couriers collect fees on delivery, never by advance transfer.",
      "Ignore and block; do not call numbers in the message.",
      "If expecting a parcel, verify through the seller’s official chat.",
    ],
    exampleChannel: "SMS",
    exampleText:
      "[LBC EXPRESS] Parcel LB8837465210 is ON HOLD due to an UNPAID DELIVERY FEE of P185. Settle via GCash 0918XXX2231 within 6 hours or item returns to sender. Thank you!",
  },
  {
    id: "online-job-scam",
    label: "Online Job Scam",
    description:
      "Unsolicited offers to earn ₱2,000–₱10,000 daily rating products or encoding data from home. They always begin with an “activation”, “membership”, or “registration” fee, then disappear.",
    warningSigns: [
      "Job offer you never applied for",
      "High pay for simple tasks (“rate products, earn daily”)",
      "Upfront fees via e-wallet to an admin’s personal account",
      "Recruitment through Messenger/Viber with generic names like “Admin Karen”",
      "Pressure about limited slots",
    ],
    whatToDo: [
      "Legitimate employers never charge applicants anything.",
      "Search the company name plus “scam” before engaging.",
      "Never pay to “activate” tasks or withdraw earnings.",
      "Report the account to the platform (Messenger, TikTok, etc.).",
    ],
    exampleChannel: "Messenger",
    exampleText:
      "GOOD NEWS! You are SELECTED as Online Product Reviewer. Earn PHP4,000 DAILY rating products, work from home! Pay PHP350 activation fee via Maya to Admin Karen now! Only 5 slots left!",
  },
  {
    id: "loan-scam",
    label: "Loan Scam",
    description:
      "Too-easy “pre-approved” loans from lending apps or texters who demand advance “release fees”, insurance, or processing payments, then vanish once paid. Some harvest your IDs for other fraud.",
    warningSigns: [
      "Loan approved instantly without documents or credit check",
      "Release/processing/insurance fee required BEFORE payout",
      "Lender not in SEC’s registered list or BSP-accredited firms",
      "Requests for ID photos plus a selfie “for validation”",
      "Guaranteed approval regardless of income",
    ],
    whatToDo: [
      "Legit lenders deduct fees from proceeds instead of collecting them upfront.",
      "Check SEC (sec.gov.ph) for registered lending companies.",
      "Never send ID photos to unverified lenders; they fuel scam databases.",
      "Compare offers only through banks’ official apps or websites.",
    ],
    exampleChannel: "SMS",
    exampleText:
      "Instant Cash Loan APPROVED! Get up to P200,000 with no collateral, released in 24hrs! Just settle the P1,800 release fee via GCash 0906XXX8842 to receive your loan TODAY.",
  },
  {
    id: "government-impersonation",
    label: "Government Impersonation",
    description:
      "Texts posing as SSS, PhilHealth, Pag-IBIG, BIR, PNP, NBI, LTO, or other agencies, citing fake penalties, unreleased benefits, or warrant threats to panic you into links or payments.",
    warningSigns: [
      "Penalties, warrants, or “cases” threatened over SMS",
      "Benefits/refunds requiring “re-validation” through a link",
      "Agencies texting from regular 09XX mobile numbers",
      "Urgent deadlines to avoid “legal action”",
      "Payment channels that are personal e-wallets",
    ],
    whatToDo: [
      "Agencies serve formal notices by mail or official portals, not SMS threats.",
      "Log in only through official websites (.gov.ph) you type yourself.",
      "Call the agency’s published hotline to verify any claim.",
      "No government office collects fines via personal GCash/Maya numbers.",
    ],
    exampleChannel: "SMS",
    exampleText:
      "[SSS ADVISORY] Your contribution records show a DISCREPANCY. Validate your membership within 24 hours at sss-member-revalidate.top or benefits will be SUSPENDED and a case filed. - SSS Compliance",
  },
  {
    id: "account-verification-scam",
    label: "Account Verification Scam",
    description:
      "Any message demanding urgent “verification” or re-activation of an account (email, wallet, social media, bank), usually with a link or an OTP request. It exists to hijack your login.",
    warningSigns: [
      "“Verify within X hours or lose access”",
      "OTP/MPIN/password requests framed as “confirmation”",
      "Login pages reached from SMS/chat links",
      "Generic greetings with mismatched branding",
      "Verification demanded right after a scary warning",
    ],
    whatToDo: [
      "Real services verify inside their own app, never via random links.",
      "If you entered credentials anywhere suspicious, change passwords NOW.",
      "Enable two-factor authentication on important accounts.",
      "Check haveibeenpwned.com if you suspect leaked emails.",
    ],
    exampleChannel: "Email",
    exampleText:
      "Account Alert: We detected a new device sign-in. Kailangan mong i-verify ang account mo within 12 hours o ma-lo-lock ito permanently. Confirm here: secure-verify-login.click/confirm?id=8842",
  },
  {
    id: "investment-scam",
    label: "Investment Scam",
    description:
      "Crypto, forex, or “trading group” pitches promising doubled money or fixed daily returns. Early “payouts” are theater; deposits eventually vanish, often alongside celebrity deepfake endorsements.",
    warningSigns: [
      "“Double your money in 30 days” / guaranteed % returns",
      "VIP trading groups with screenshots of huge profits",
      "Unregistered entities absent from SEC’s advisories list",
      "Recruit friends for “bonus capital” (pyramid structure)",
      "Payments to personal e-wallets or crypto addresses",
    ],
    whatToDo: [
      "Check the company against SEC and BSP advisory lists first.",
      "Assume every guaranteed high return is a scam, because mathematically it is.",
      "Never invest through group admins’ personal accounts.",
      "If already in, stop depositing; warn co-members quietly.",
    ],
    exampleChannel: "Viber",
    exampleText:
      "Boss, last slot for our VIP crypto pool! Invest P10,000 → guaranteed 40% return EVERY WEEK, doble mo pera mo in 1 month. Members already withdrawing! Mag-invest ka na, close registration tonight.",
  },
  {
    id: "romance-scam",
    label: "Romance Scam",
    description:
      "Long-con affection from “OFWs, soldiers abroad, or foreign engineers” who fall in love fast, then need help with customs fees, hospital bills, or a plane ticket. The person never arrives.",
    warningSigns: [
      "Rapid declarations of love without meeting",
      "Profession abroad: soldier, doctor on a ship, engineer",
      "Sudden emergencies: customs-held package, hospital, bail",
      "Always a reason video calls fail",
      "Money requests via remittance centers or e-wallets",
    ],
    whatToDo: [
      "Never send money to someone you haven’t met in person.",
      "Reverse-image-search their photos; most are stolen.",
      "Insist on a spontaneous video call; watch how they dodge.",
      "Talk to family before sending anything; isolation is their tool.",
    ],
    exampleChannel: "Chat",
    exampleText:
      "Hello dear, I’m Dr. James stationed abroad on a mission ship. I sent you my gift box but customs is holding it, please send P8,500 clearance fee so it can finally reach you, my love.",
  },
  {
    id: "phishing",
    label: "Phishing",
    description:
      "Catch-all for fake links designed to steal logins or card details: lookalike domains, shortened URLs, and cloned login pages for Shopee, Lazada, Grab, email providers, and more.",
    warningSigns: [
      "Domains mimicking real ones: shopee-pay.xyz, grabkash.site",
      "Shortened links (bit.ly, cutt.ly) hiding destinations",
      "Non-HTTPS pages asking for logins or card numbers",
      "Urgency attached to clicking (“within 1 hour”)",
      "Mismatch between claimed brand and actual domain",
    ],
    whatToDo: [
      "Read domains character-by-character before tapping anything.",
      "Access accounts only through official apps or typed URLs.",
      "Never enter card details on pages arrived at via chat/SMS.",
      "If compromised, change passwords and enable 2FA everywhere reused.",
    ],
    exampleChannel: "Email",
    exampleText:
      "Your Lazada wallet refund of P1,240.00 is ready! Claim within 24 hours: http://lazada-refund-claim.buzz/wallet and log in with your registered email to receive your cashback.",
  },
  {
    id: "other",
    label: "Other Scam Pattern",
    description:
      "Suspicious messages that don’t fit a known mold: unusual payment demands, odd impersonations, or pressure tactics. New scam formats appear constantly; caution still applies.",
    warningSigns: [
      "Unexpected requests involving money or codes",
      "Pressure, threats, or too-good-to-be-true claims",
      "Sender identity you cannot verify independently",
      "Payment via e-wallet, load cards, or crypto only",
    ],
    whatToDo: [
      "Apply the universal rule: verify through an official channel first.",
      "Don’t reply; engagement confirms your number is active.",
      "Ask someone you trust before acting.",
      "Report and block the sender after documenting it.",
    ],
    exampleChannel: "SMS",
    exampleText:
      "Pahabol! Last day ng promo! Send 3 load pins worth P50 each to 0977XXX0912 and get DOUBLE load back guaranteed within the hour. Kailangan magbayad ngayon para makuha mo agad!",
  },
];

const CATEGORY_BY_SLUG = new Map<string, ScamCategoryDef>(
  SCAM_CATEGORIES.map((category) => [
    category.label.toLowerCase().replace(/[^a-z]+/g, ""),
    category,
  ])
);

export function scamCategoryById(id: ScamCategoryId): ScamCategoryDef {
  const found = SCAM_CATEGORIES.find((category) => category.id === id);
  return found ?? SCAM_CATEGORIES[SCAM_CATEGORIES.length - 1];
}

export function scamCategoryFromLabel(label: string): ScamCategoryDef {
  const slug = label.toLowerCase().replace(/[^a-z]+/g, "");
  return (
    CATEGORY_BY_SLUG.get(slug) ??
    scamCategoryById("other")
  );
}
