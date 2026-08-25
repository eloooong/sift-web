import { analyzeMessage, type RiskLevel } from "@/lib/scam-detector";

export type { RiskLevel };

export type ScamExample = {
  id: string;
  label: string;
  labelFil?: string;
  category: string;
  channel: string;
  riskLevel: RiskLevel;
  riskScore: number;
  summary: string;
  summaryFil?: string;
  redFlags: string[];
  sampleText: string;
};

const EXAMPLE_SEEDS = [
  {
    id: "prize-scam",
    label: "Prize Scam",
    labelFil: "Premyong Nanalo Ka Daw",
    category: "Prize Scam",
    channel: "SMS",
    summary:
      "A text claiming you won a raffle you never joined, demanding a fee before you can claim your winnings.",
    summaryFil:
      "Text na nagsasabing nanalo ka daw sa raffle na hindi mo naman sinabihan, pero may bayad muna bago makuhang premyo.",
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
    summaryFil:
      "Peking GCash alert na naghahatid sa kopyang verification page para nakawin ang login at MPIN mo.",
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
    id: "otp-scam",
    label: "OTP Scam",
    labelFil: "Panloloko sa OTP",
    category: "Phishing",
    channel: "SMS",
    summary:
      "A message forwarding you a real one-time PIN, then tricking you into \"confirming\" or sending it back so the scammer can take over your wallet.",
    summaryFil:
      "Ipinapadala sa iyo ang tunay na OTP code tapos pinipilit kang \"i-confirm\" o ipadala pabalik para magamit ng scammer ang account mo.",
    redFlags: [
      "One-time PIN included in the text",
      "Urgent request to reply or confirm",
      "\"Kung hindi ikaw\" reverse-psychology trick",
      "No real provider asks you to share an OTP",
    ],
    sampleText:
      "GCash: DO NOT SHARE this code with anyone. Your one-time PIN is 839201. A request to CHANGE YOUR MPIN was made on your account. Kung HINDI ikaw ang nag-request, i-reply ang \"NO\" dito o tawag ang 2882 ngayon din.",
  },
  {
    id: "shopee-points-scam",
    label: "Shopee Reward Scam",
    labelFil: "Shopee Points Scam",
    category: "Phishing",
    channel: "SMS",
    summary:
      "A shopping-app impersonation claiming free reward points that must be \"claimed\" through a lookalike page asking for your login.",
    summaryFil:
      "Kunwari customer service ng shopping app, nagbibigay daw ng libreng points, pero ang \"claim page\" ay nangongolekta ng login mo.",
    redFlags: [
      "Reward points you never earned",
      "Lookalike domain (shopee-ph.club)",
      "Login page harvests credentials",
      "Artificial expiry countdown",
    ],
    sampleText:
      "[Shopee] Maligayang kaarawan! You have been chosen for our LOYALTY REWARD: 50,000 Shopee Coins credited to your account. Claim before they expire TODAY at https://shopee-rewardsph.club/login using your Shopee username and password. Unclaimed coins will be forfeited. Thank you, Shopee Cares!",
  },
  {
    id: "lazada-delivery-scam",
    label: "Lazada Order Scam",
    labelFil: "Pekeng Problema sa Order (Lazada)",
    category: "Delivery Scam",
    channel: "SMS",
    summary:
      "A courier-themed text inventing a small re-delivery fee for an order you never placed, paid straight to a personal e-wallet.",
    summaryFil:
      "Text na may \"problema sa delivery\" ng order na hindi mo naman inorder, kasama ang maliliit na bayaran na dapat ipadala sa personal na e-wallet number.",
    redFlags: [
      "Order you never placed",
      "Tiny fee to make it look harmless",
      "Payment to a personal GCash number",
      "Countdown before \"auto-return\"",
    ],
    sampleText:
      "[Lazada Express] Hi customer, your order LZ7745192623 FAILED DELIVERY due to an incorrect address. Pay the P15 re-delivery fee via GCash to 0995-XXX-XXXX within 4 hours or your package will be automatically returned. Re-send your correct address by replying to this SMS. - Lazada Logistics",
  },
  {
    id: "sss-advisory-scam",
    label: "Fake Government Text",
    labelFil: "Pekeng Abiso Mula sa Gobyerno",
    category: "Government Impersonation",
    channel: "SMS",
    summary:
      "An agency-themed advisory threatening suspension of benefits unless you \"update\" records on a fake government site.",
    summaryFil:
      "Abisong kunwari galing sa ahensya ng gobyerno na nagsasabing isuspinde ang benepisyo mo kung hindi ka mag-\"update\" sa pekeng website nito.",
    redFlags: [
      "Threatens suspension of benefits",
      "Fake .xyz domain mimicking gov.ph",
      "Asks for personal details and fee",
      "Real agencies do not collect fees by text",
    ],
    sampleText:
      "[SSS ADVISORY] Your SSS contribution records are INCOMPLETE and your membership will be SUSPENDED within 48 hours. Update and validate your records now at https://sss-contribution-update.xyz/member to avoid interruption of benefits. Processing fee of P225 applies payable online. This is an official government notice.",
  },
  {
    id: "delivery-scam",
    label: "Delivery Scam",
    category: "Delivery Scam",
    channel: "SMS",
    summary:
      "A courier-themed text inventing an unpaid shipping fee, paid straight to a personal e-wallet number.",
    summaryFil:
      "Text na kunwari courier, may \"hindi nabayarang shipping fee\" daw na ipinapadala sa personal na e-wallet number.",
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
    labelFil: "Pekeng Job Offer",
    category: "Online Job Scam",
    channel: "Messenger",
    summary:
      "An unsolicited work-from-home offer with unrealistic pay that starts with a registration fee.",
    summaryFil:
      "Di-hiniling na work-from-home offer na sobrang laki ng sahod, pero may membership fee muna bago magsimula.",
    redFlags: [
      "Job offer you never applied for",
      "High daily pay for simple tasks",
      "Upfront membership fee via Maya",
      "Scarcity pressure (limited slots)",
    ],
    sampleText:
      "GOOD NEWS! You have been SELECTED as an Online Product Reviewer for a top shopping platform. Work from home and earn PHP3,000-PHP5,000 DAILY just by rating products! No experience needed. To activate your account, register now and pay the membership fee of PHP299 via Maya. Only 10 slots left. Message Admin Karen to reserve.",
  },
  {
    id: "maya-wallet-scam",
    label: "Maya Wallet Scam",
    labelFil: "Maya Verification Scam",
    category: "Account Verification Scam",
    channel: "SMS",
    summary:
      "A wallet impersonation claiming your identity verification expired, routing you to a fake KYC page.",
    summaryFil:
      "Nagpapanggap na Maya: expired daw ang verification mo at kailangan mong mag-update sa pekeng KYC page.",
    redFlags: [
      "Expired-KYC scare tactic",
      "High-risk .top domain",
      "Wallet limit threat",
      "Link does not match maya.ph",
    ],
    sampleText:
      "[MAYA] Paumanhin: Your account VERIFICATION has EXPIRED. Para maiwasan ang pagka-limit ng wallet mo, i-verify ulit within 12 hours sa https://maya-kyc-verify.top/idcheck gamit ang iyong registered mobile number at 1 valid ID. - Maya Customer Care",
  },
  {
    id: "facebook-buyer-scam",
    label: "Facebook Buyer Scam",
    labelFil: "Scam sa FB Marketplace",
    category: "Phishing",
    channel: "Facebook",
    summary:
      "A too-eager Marketplace \"buyer\" who insists on paying through a link that actually steals your e-wallet login.",
    summaryFil:
      "\"Buyer\" sa Marketplace na sobrang eager magbayad pero sa link daw, kunwari payout page, peke pala at nangongolekta ng e-wallet login mo.",
    redFlags: [
      "Buyer refuses to meet or use in-app checkout",
      "\"Claim your payment\" link before any sale",
      "Page asks for your GCash login",
      "Rushed, scripted messages",
    ],
    sampleText:
      "Hi po! Ako po yung interested buyer ng iPhone mo sa FB Marketplace. Confirmed po ako buy. Para safe po tayo, send ko muna ang full payment through this official GCash payout portal: https://gcash-payout-secure.cyou/claim. Just log in with your mobile number and MPIN para makuha mo agad ang pera bago ko pa i-book ang rider bukas.",
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
