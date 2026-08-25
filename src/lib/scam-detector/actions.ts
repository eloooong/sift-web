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
  intel: [
    "Do not call back, reply to, or transact with this number.",
    "Block the number and report it through your messaging app or telco.",
    "Community reports are strong warnings, not legal findings; verify independently when money is involved.",
  ],
};

const CATEGORY_ACTIONS_FIL: Record<SignalCategoryId, string[]> = {
  prize: [
    "Huwag sumagot, mag-click ng link, o magbayad ng anumang “claim” fee.",
    "Ang tunay na raffle ay hindi humihingi ng bayad bago ibigay ang premyo.",
    "I-verify sa opisyal na channel ng organisasyon, hindi sa mga detalyeng nakasulat sa message.",
  ],
  financial: [
    "Huwag magpadala ng pera o magbigay ng detalye ng e-wallet o bangko.",
    "Tawagan ang opisyal na hotline ng company para i-confirm ang sinasabing singil.",
    "Walang lehitimong company na kumokolekta ng bayad sa personal na e-wallet o remittance number.",
    "Kung nagbayad ka na, makipag-ugnayan agad sa e-wallet o bangko mo para subukang maibalik ang pera.",
  ],
  credential: [
    "Huwag buksan ang link o maglagay ng login details mo.",
    "Kung nabuksan mo na, palitan agad ang password mo at i-enable ang two-factor authentication.",
    "Buksan ang opisyal na app o i-type nang mano-mano ang website address sa halip na maniwala sa message.",
  ],
  link: [
    "Huwag pindutin ang link.",
    "Suriin nang mabuti ang domain, dahil gumagamit ang scammers ng spelling na kamukha ng tunay na site.",
    "Pumasok lang sa serbisyo gamit ang opisyal na app o website nito.",
  ],
  job: [
    "Huwag magbayad para mag-apply o “i-activate” ang alok na trabaho.",
    "Alamin muna ang company; walang lehitimong recruiter na kumokolekta ng fee sa aplikante.",
    "Humingi ng opisyal na company email at i-verify ang pagkakakilanlan ng recruiter.",
  ],
  urgency: [
    "Huminto muna: ang artipisyal na deadline ay paraan ng panggigipit.",
    "I-verify ang claim sa opisyal na channel bago kumilos.",
    "Kausapin muna ang taong pinagkakatiwalaan mo bago sumagot.",
  ],
  investment: [
    "Huwag magdeposito sa kahit sinong naghahandog ng investimento sa chat o text.",
    "Tingnan ang company sa advisory at registered list ng SEC (sec.gov.ph).",
    "Imposible ang garantiyang mataas na tubo araw-araw, at sapat na itong dahilan para hindi ito tuloy.",
  ],
  loan: [
    "Huwag magbayad ng advance na “release” fee, dahil binabawas ng lehitimong lender ang fee sa loob ng loan.",
    "I-verify ang lender sa SEC-registered lending companies at BSP-accredited firms.",
    "Huwag magpadala ng ID photo o selfie sa di-veripikadong lender; ginagamit ito sa identity fraud.",
  ],
  romance: [
    "Mag-ingat sa online na kakilala na mabilis umamin ng pagmamahal nang hindi pa nagkikita.",
    "Huwag magbayad ng customs, tiket, o hospital bill para sa taong hindi mo pa personal na nakikita.",
    "Hilingin ang spontaneous na video call, dahil palaging iniiwasan ng scammers ang live na verification.",
  ],
  intel: [
    "Huwag tumawag, sumagot, o makipag-transaksyon sa numerong ito.",
    "I-block ang numero at i-report sa messaging app mo o telco.",
    "Ang community reports ay malakas na babala, hindi legal na hatol; mag-verify nang sarili kapag pera na ang usapan.",
  ],
};

const SAFE_DEFAULT_ACTIONS = [
  "Stay cautious even without clear red flags.",
  "Never share OTPs, PINs, or passwords, because no legitimate company will ask for them.",
];

const SAFE_DEFAULT_ACTIONS_FIL = [
  "Manatiling mapagbantay kahit walang malinaw na red flag.",
  "Huwag kailan magbabahagi ng OTP, PIN, o password dahil walang tunay na company na hihingi ng mga ito.",
];

const OTP_ACTION =
  "Never share OTPs, PINs, or passwords, because no legitimate company will ask for them.";

const OTP_ACTION_FIL =
  "Huwag kailan magbibigay ng OTP, PIN, o password dahil walang lehitimong company na hihingi ang mga ito.";

const BLOCK_ACTION = "Block the number or account that sent this message.";

const BLOCK_ACTION_FIL =
  "I-block ang numero o account na nagpadala ng message na ito.";

const REPORT_ACTION =
  "Report the message to the platform or telco you received it through.";

const REPORT_ACTION_FIL =
  "I-report ang message sa platform o telco kung saan mo natanggap.";

const WARN_ACTION =
  "Warn family and friends, especially seniors who receive these often.";

const WARN_ACTION_FIL =
  "Ipaalam sa pamilya at kaibigan, lalo na sa matatanda na madalas biktima nito.";

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
