import type { Lang } from "@/lib/i18n/config";
import type { SignalCategoryId } from "./types";

const CATEGORY_ACTIONS: Record<SignalCategoryId, string[]> = {
  prize: [
    "Do not reply, click links, or pay any “claim” fee.",
    "Real raffles never require payment to release winnings.",
    "Verify with the organization’s official channels, never the contact details in the message.",
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
    "Inspect the domain closely; scammers use lookalike spellings of real sites.",
    "Access the service only through its official app or website.",
  ],
  job: [
    "Never pay to apply or to “activate” a work offer.",
    "Research the company; legitimate recruiters do not collect fees from applicants.",
    "Ask for an official company email address and verify the recruiter’s identity.",
  ],
  urgency: [
    "Slow down: artificial deadlines are a pressure tactic.",
    "Verify the claim through an official channel before acting on it.",
    "Talk to someone you trust before responding.",
  ],
  investment: [
    "Do not deposit money with anyone soliciting investments over chat or text.",
    "Check the company against the SEC’s advisory and registered lists (sec.gov.ph).",
    "Guaranteed high daily returns are impossible; that promise alone is disqualifying.",
  ],
  loan: [
    "Never pay advance “release” fees; legitimate lenders deduct fees from proceeds.",
    "Verify the lender against SEC-registered lending companies and BSP-accredited firms.",
    "Do not send ID photos or selfies to unverified lenders; they fuel identity fraud.",
  ],
  romance: [
    "Be cautious with online contacts who profess love quickly without meeting.",
    "Never pay customs, tickets, or hospital bills for someone you have not met in person.",
    "Request a spontaneous video call, since scammers consistently avoid live verification.",
  ],
  gambling: [
    "Do not deposit money on betting sites promoted through random texts.",
    "Licensed Philippine casinos do not advertise through SMS links.",
    "Unlicensed sites can refuse withdrawals anytime; treat every “bonus” as bait.",
  ],
  intel: [
    "Do not call back, reply to, or transact with this number.",
    "Block the number and report it through your messaging app or telco.",
    "Community reports are strong warnings, not legal findings; verify independently when money is involved.",
  ],
};

const CATEGORY_ACTIONS_FIL: Record<SignalCategoryId, string[]> = {
  prize: [
    "Huwag munang sumagot, magbukas ng link, o magbayad para makuha ang premyo.",
    "Mag-ingat kung may bayad muna bago ibigay ang sinasabing napanalunan.",
    "Hanapin mo mismo ang opisyal na app, website, o numero ng organisasyon at doon magtanong.",
  ],
  financial: [
    "Huwag munang magpadala ng pera o magbigay ng detalye ng e-wallet o bangko.",
    "Tawagan ang kumpanyang binanggit gamit ang opisyal nitong numero para alamin kung totoo ang singil.",
    "Tiyaking sa totoong kumpanya mapupunta ang bayad, lalo na kung personal na numero ang ibinigay.",
    "Kung nagbayad ka na, tawagan agad ang bangko o e-wallet mo at itanong kung puwede pang mapigilan o mabawi ang padala.",
  ],
  credential: [
    "Huwag buksan ang link o ilagay ang login details mo.",
    "Kung naibigay mo na ang password, palitan ito agad at i-on ang two-factor authentication kung mayroon.",
    "Buksan mo mismo ang opisyal na app o i-type ang website address para tingnan ang account mo.",
  ],
  link: [
    "Huwag munang pindutin ang link.",
    "Tingnang mabuti ang spelling ng address. Baka may binagong letra para magmukhang opisyal.",
    "Gamitin ang opisyal na app o website para puntahan ang serbisyo.",
  ],
  job: [
    "Huwag magbayad para mag-apply o para raw ma-activate ang trabaho.",
    "Alamin muna kung totoo ang kumpanya at ang alok bago magbigay ng pera o personal na detalye.",
    "Humingi ng opisyal na email ng kumpanya at doon kumpirmahin kung nagtatrabaho talaga ang recruiter.",
  ],
  urgency: [
    "Huwag magpadala sa pagmamadali. Puwedeng panggigipit lang ang deadline.",
    "Magtanong muna sa opisyal na app, website, o numero kung totoo ang sinasabi.",
    "Kausapin ang taong pinagkakatiwalaan mo bago sumagot.",
  ],
  investment: [
    "Huwag munang magdeposito sa nag-aalok ng investment sa text o chat.",
    "Tingnan ang mga babala at opisyal na listahan ng SEC sa sec.gov.ph.",
    "Mag-ingat sa pangakong siguradong mataas ang tubo araw-araw. Alamin muna kung saan galing ang sinasabing kita.",
  ],
  loan: [
    "Huwag munang magpadala ng release fee para makuha ang loan.",
    "Hanapin ang nagpapautang sa mga opisyal na listahan ng SEC o BSP.",
    "Huwag magpadala ng larawan ng ID o selfie hangga't hindi mo natitiyak kung sino ang tatanggap at para saan ito.",
  ],
  romance: [
    "Mag-ingat kung mabilis magpahayag ng pagmamahal ang online mong kakilala kahit hindi pa kayo nagkikita.",
    "Huwag magpadala ng pera para sa customs, tiket, o ospital kung hindi mo pa natitiyak ang kuwento.",
    "Mag-aya ng video call. Kung lagi itong iniiwasan, huwag munang magpadala ng pera o personal na detalye.",
  ],
  gambling: [
    "Huwag magdeposito sa betting site dahil lang may nag-text ng promo.",
    "Alamin muna kung sino ang may-ari ng site at kung may lisensya ito.",
    "Basahin ang mga kondisyon sa bonus at pag-withdraw bago magpadala ng pera.",
  ],
  intel: [
    "Huwag munang tumawag pabalik, sumagot, o makipagtransaksyon sa numerong ito.",
    "I-block ang numero at i-report sa messaging app o telco mo.",
    "Babala ang mga naunang report, hindi patunay ng pagkakasala. Magsiguro muna sa ibang paraan kung may perang hinihingi.",
  ],
};

const SAFE_DEFAULT_ACTIONS = [
  "Stay cautious even without clear red flags.",
  "Never share OTPs, PINs, or passwords, because no legitimate company will ask for them.",
];

const SAFE_DEFAULT_ACTIONS_FIL = [
  "Mag-ingat pa rin kahit walang malinaw na palatandaan ng scam.",
  "Para sa iyo lang ang OTP, PIN, at password. Huwag ibigay ang mga ito sa kausap mo.",
];

const OTP_ACTION =
  "Never share OTPs, PINs, or passwords, because no legitimate company will ask for them.";

const OTP_ACTION_FIL =
  "Para sa iyo lang ang OTP, PIN, at password. Huwag ibigay ang mga ito sa kausap mo.";

const BLOCK_ACTION = "Block the number or account that sent this message.";

const BLOCK_ACTION_FIL =
  "I-block ang numero o account na nagpadala ng mensahe.";

const REPORT_ACTION =
  "Report the message to the platform or telco you received it through.";

const REPORT_ACTION_FIL =
  "I-report ang mensahe sa app o telco kung saan mo ito natanggap.";

const WARN_ACTION =
  "Warn family and friends, especially seniors who receive these often.";

const WARN_ACTION_FIL =
  "Ipaalam ang modus sa pamilya at mga kaibigan para makapag-ingat din sila.";

export function buildRecommendedActions(
  primaryCategory: SignalCategoryId | null,
  riskScore: number,
  lang: Lang = "en"
): string[] {
  const fil = lang === "fil";
  const actions = primaryCategory
    ? [...(fil ? CATEGORY_ACTIONS_FIL : CATEGORY_ACTIONS)[primaryCategory]]
    : [...(fil ? SAFE_DEFAULT_ACTIONS_FIL : SAFE_DEFAULT_ACTIONS)];

  if (riskScore >= 50) {
    actions.push(fil ? OTP_ACTION_FIL : OTP_ACTION, fil ? BLOCK_ACTION_FIL : BLOCK_ACTION);
  }
  if (primaryCategory || riskScore >= 30) {
    actions.push(fil ? REPORT_ACTION_FIL : REPORT_ACTION);
  }
  if (riskScore >= 50) {
    actions.push(fil ? WARN_ACTION_FIL : WARN_ACTION);
  }

  return actions.slice(0, 7);
}
