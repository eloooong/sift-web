import type { SignalCategoryId } from "./types";

type CustomMatch = { evidence: string };

export type SignalMatcher =
  | { kind: "pattern"; patterns: RegExp[] }
  | { kind: "custom"; run: (text: string) => CustomMatch | null };

export type SignalDefinition = {
  id: string;
  category: SignalCategoryId;
  label: string;
  explanation: string;
  weight: number;
  matcher: SignalMatcher;
};

const URL_REGEX = /\b(?:https?:\/\/|www\.)[^\s<>"']+/gi;

const BARE_DOMAIN_REGEX =
  /\b(?:[a-z0-9-]+\.)+(?:com|net|org|ph|info|xyz|top|site|online|club|link|live|buzz|click|io|co)\b(?:\/[^\s<>"']*)?/gi;

const URL_SHORTENER_HOSTS = new Set([
  "bit.ly",
  "tinyurl.com",
  "cutt.ly",
  "t.co",
  "is.gd",
  "rb.gy",
  "ow.ly",
  "bit.do",
  "rebrandly.com",
  "shorturl.at",
  "tiny.cc",
]);

const HIGH_RISK_TLDS = new Set([
  "xyz",
  "top",
  "info",
  "club",
  "online",
  "buzz",
  "click",
  "live",
]);

const OFFICIAL_BRAND_DOMAINS = [
  "gcash.com",
  "maya.ph",
  "paymaya.com",
  "bpi.com.ph",
  "bdo.com.ph",
  "securitybank.com",
  "metrobank.com.ph",
  "bancnetonline.com",
  "lbcexpress.com",
  "jtexpress.ph",
  "shopee.ph",
  "shopee.com",
  "lazada.com.ph",
  "grab.com",
  "sss.gov.ph",
  "pagcor.com.ph",
];

const IMPERSONATED_BRAND_TOKENS = [
  "gcash",
  "paymaya",
  "maya",
  "bpi",
  "bdo",
  "lbc",
  "jnt",
  "jtexpress",
  "shopee",
  "lazada",
  "grab",
];

function extractUrls(text: string): string[] {
  const matches = [...text.matchAll(URL_REGEX), ...text.matchAll(BARE_DOMAIN_REGEX)];
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const match of matches) {
    const value = match[0].replace(/[.,;:!?)\]]+$/, "");
    const key = value.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      urls.push(value);
    }
  }
  return urls;
}

function getHost(url: string): string {
  return url
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split(/[/?#]/)[0]
    .toLowerCase();
}

function truncateEvidence(text: string, maxLength = 48): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength)}…` : trimmed;
}

const CURRENCY_AMOUNT_REGEX =
  /(?:₱|PHP|P)\s?(\d{1,3}(?:,\d{3})+|\d{4,})(?:\.\d{2})?|\b(\d{1,3}(?:,\d{3})+|\d{4,})\s*(?:pesos?|php)\b/gi;

function findLargeAmount(text: string): CustomMatch | null {
  for (const match of text.matchAll(CURRENCY_AMOUNT_REGEX)) {
    const digits = (match[1] ?? match[2] ?? "").replace(/,/g, "");
    if (Number.parseInt(digits, 10) >= 10000) {
      return { evidence: truncateEvidence(match[0]) };
    }
  }
  return null;
}

const PHONE_NUMBER_REGEX = /(?:09\d{2}|\+639\d{2})[\s.-]?\d{3}[\s.-]?\d{4}/g;

function maskPhone(value: string): string {
  return `${value.slice(0, 5)}•••${value.slice(-4)}`;
}

export const SIGNALS: SignalDefinition[] = [
  {
    id: "urgency.act-now",
    category: "urgency",
    label: "“Act now” call to action",
    explanation:
      "Rushed calls to action are meant to stop you from thinking twice before doing anything.",
    weight: 10,
    matcher: { kind: "pattern", patterns: [/act\s+now/i] },
  },
  {
    id: "urgency.immediate",
    category: "urgency",
    label: "Demands immediate action",
    explanation:
      "Demanding instant action pressures you before you can verify if the message is real.",
    weight: 8,
    matcher: {
      kind: "pattern",
      patterns: [/\bimmediately\b/i, /\bright away\b/i, /\bat once\b/i],
    },
  },
  {
    id: "urgency.urgent",
    category: "urgency",
    label: "Explicitly marked urgent",
    explanation:
      "The word “urgent” pushes you to react emotionally instead of carefully.",
    weight: 8,
    matcher: { kind: "pattern", patterns: [/\burgent(?:ly)?\b/i] },
  },
  {
    id: "urgency.deadline",
    category: "urgency",
    label: "Tight countdown deadline",
    explanation:
      "Very short deadlines create panic so you send money or details before checking the facts.",
    weight: 13,
    matcher: {
      kind: "pattern",
      patterns: [
        /(?:within|in|after)\s+\d{1,2}\s*-?\s*(?:hours?|hrs?|minutes?|mins?|days?)\b/i,
        /\b\d{1,2}\s*(?:hours?|hrs?)\b/i,
      ],
    },
  },
  {
    id: "urgency.last-chance",
    category: "urgency",
    label: "“Last chance” pressure",
    explanation:
      "“Last chance” warnings make the offer feel rare so you skip asking questions.",
    weight: 11,
    matcher: {
      kind: "pattern",
      patterns: [
        /last\s+chance/i,
        /final\s+(?:notice|warning)/i,
        /huling\s+abiso/i,
        /\bpahabol\b/i,
      ],
    },
  },
  {
    id: "urgency.taglish",
    category: "urgency",
    label: "Taglish urgency (“kailangan ngayon”)",
    explanation:
      "Taglish pressure phrases are common in local scam texts to sound familiar while rushing you.",
    weight: 10,
    matcher: {
      kind: "pattern",
      patterns: [/kailangan\s+ngayon/i, /kelangan\s+ngayon/i, /\bngayon\s+na\b/i],
    },
  },
  {
    id: "urgency.hurry",
    category: "urgency",
    label: "“Hurry” rush wording",
    explanation:
      "Telling you to hurry keeps you from double-checking the sender and the claim.",
    weight: 6,
    matcher: {
      kind: "pattern",
      patterns: [/\bhurry\b/i, /\bdali(?:li)?\b/i, /\bbilisan\b/i],
    },
  },
  {
    id: "urgency.scarcity",
    category: "urgency",
    label: "Artificial scarcity (“only X slots left”)",
    explanation:
      "Fake scarcity (“only a few slots”) pushes you to decide fast without verifying.",
    weight: 8,
    matcher: {
      kind: "pattern",
      patterns: [/only\s+\d+\s+slots?\b/i, /limited\s+slots?\b/i],
    },
  },

  {
    id: "prize.congratulations",
    category: "prize",
    label: "Congratulations opener",
    explanation:
      "Unexpected congratulations often open scam messages — they excite you before you think.",
    weight: 10,
    matcher: {
      kind: "pattern",
      patterns: [/\bcongratulations?\b/i, /\bcongrats\b/i],
    },
  },
  {
    id: "prize.winner",
    category: "prize",
    label: "“You won” announcement",
    explanation:
      "Real prizes don’t arrive by text from numbers or names you don’t recognize.",
    weight: 15,
    matcher: {
      kind: "pattern",
      patterns: [
        /\byou(?:'ve| have| r)?\s+won\b/i,
        /\bwinner\b/i,
        /\bnanalo\s+(?:ka|kayo|si)\b/i,
        /\bpanalo\s+ka\b/i,
      ],
    },
  },
  {
    id: "prize.claim",
    category: "prize",
    label: "Prize-claim instruction",
    explanation:
      "Prize-claim steps usually lead to paying “fees” or handing over personal information.",
    weight: 14,
    matcher: {
      kind: "pattern",
      patterns: [
        /claim\b[^.?!]{0,24}\bprize/i,
        /claim\s+(?:your\s+)?(?:winnings|reward)/i,
        /kunin\s+ang\s+premyo/i,
        /\b(?:ma-?|pa-?|i-?)claim\s+(?:na\s+)?(?:ang|your)\b/i,
        /claim\s+ng\s+premyo/i,
        /para\s+ma-?claim/i,
      ],
    },
  },
  {
    id: "prize.big-money",
    category: "prize",
    label: "Promises a large cash amount",
    explanation:
      "Huge cash offers are bait — too-good-to-be-true amounts are the oldest scam trick there is.",
    weight: 12,
    matcher: { kind: "custom", run: findLargeAmount },
  },
  {
    id: "prize.raffle",
    category: "prize",
    label: "Raffle / lottery framing",
    explanation:
      "Winning a raffle you never joined is one of the strongest signs of a prize scam.",
    weight: 8,
    matcher: {
      kind: "pattern",
      patterns: [
        /\braffle\b/i,
        /\blotto\b/i,
        /\blottery\b/i,
        /\bsweepstakes\b/i,
        /\bpagcor\b/i,
        /\bpcso\b/i,
        /electronic\s+draw/i,
      ],
    },
  },
  {
    id: "prize.reward",
    category: "prize",
    label: "“Reward” bait wording",
    explanation:
      "Dangling a reward lowers your guard so you follow the sender’s instructions.",
    weight: 6,
    matcher: {
      kind: "pattern",
      patterns: [/\breward\b/i, /\bpremyo\b/i],
    },
  },

  {
    id: "financial.send-money",
    category: "financial",
    label: "Asks to send or transfer money",
    explanation:
      "Any message asking you to send money should be verified through official channels first.",
    weight: 13,
    matcher: {
      kind: "pattern",
      patterns: [
        /send(?:\s+\w+){0,3}\s+money/i,
        /transfer\s+(?:money|funds|amount)/i,
        /magpadala\s+ng\s+pera/i,
        /ipadala\s+ang\s+pera/i,
      ],
    },
  },
  {
    id: "financial.fees",
    category: "financial",
    label: "Processing / membership / delivery fee",
    explanation:
      "Scammers invent fees — processing, release, customs — that real companies don’t collect this way.",
    weight: 11,
    matcher: {
      kind: "pattern",
      patterns: [
        /\b(?:processing|registration|membership|shipping|delivery|handling|service|claim|customs|clearance|release)\s+fee\b/i,
        /\bbayaran\b/i,
        /\bbayad(?:an)?\b/i,
        /\bmagbayad\s+ka\b/i,
        /\bkailangan\s+magbayad\b/i,
      ],
    },
  },
  {
    id: "financial.ewallet",
    category: "financial",
    label: "Names GCash / Maya / e-wallet channels",
    explanation:
      "E-wallet payments go straight to the scammer’s wallet and are very hard to reverse.",
    weight: 10,
    matcher: {
      kind: "custom",
      run: (text) => {
        const direct = text.match(/\bgcash\b/i);
        if (direct) return { evidence: truncateEvidence(direct[0]) };
        const remittance = text.match(
          /\bcebuana\b|\bmlhuillier\b|\bpalawan\s+pawnshop\b|\bcoins\.?ph\b/i
        );
        if (remittance) return { evidence: truncateEvidence(remittance[0]) };
        const mayaWithPaymentContext = text.match(
          /\bmaya\b(?=.{0,40}\b(?:pay|fee|send|via|wallet|account|number)\b)/i
        );
        if (mayaWithPaymentContext) {
          return { evidence: truncateEvidence(mayaWithPaymentContext[0]) };
        }
        return null;
      },
    },
  },
  {
    id: "financial.bank",
    category: "financial",
    label: "Bank account / deposit instructions",
    explanation:
      "Deposit instructions inside unexpected messages are a common way to steal funds.",
    weight: 10,
    matcher: {
      kind: "pattern",
      patterns: [/bank\s+account/i, /\bdeposit\b.{0,20}\baccount\b/i, /\bideposit\b/i],
    },
  },
  {
    id: "financial.otp",
    category: "financial",
    label: "Requests OTP / MPIN / card codes",
    explanation:
      "Your OTP unlocks your accounts. No legitimate company will ever ask you to share it — anyone who does is taking over your account.",
    weight: 22,
    matcher: {
      kind: "pattern",
      patterns: [
        /\botp\b/i,
        /\bmpin\b/i,
        /\bone[- ]time\s+(?:pin|password)\b/i,
        /\bcvv\b/i,
        /\bcard\s+(?:pin|code)\b/i,
        /\bpin\s+code\b/i,
        /i[\s-]?send\s+ang\s+(?:otp|pin|code)\b/i,
        /\bipadala\s+ang\s+(?:otp|code)\b/i,
        /\bisend\s+(?:ang|mo)\b.{0,20}\botp\b/i,
      ],
    },
  },
  {
    id: "financial.load",
    category: "financial",
    label: "“Pa-load” / mobile load request",
    explanation:
      "Load requests from strangers are small tests — paying them marks you as an easy target.",
    weight: 7,
    matcher: {
      kind: "pattern",
      patterns: [
        /\bpa[- ]?load\b/i,
        /send\s+a?\s*load\b/i,
        /bili(?:han)?\s+(?:mo\s+(?:ako|kami)\s+)?ng\s+load/i,
      ],
    },
  },
  {
    id: "financial.phone-number",
    category: "financial",
    label: "Contains a Philippine mobile number",
    explanation:
      "Unknown mobile numbers paired with instructions are typical of scam formats.",
    weight: 6,
    matcher: {
      kind: "custom",
      run: (text) => {
        const match = text.match(PHONE_NUMBER_REGEX);
        if (!match) return null;
        return { evidence: maskPhone(match[0]) };
      },
    },
  },

  {
    id: "credential.verify-account",
    category: "credential",
    label: "Verification demand for account or identity",
    explanation:
      "Real companies verify accounts inside their official app — never through random links or texts.",
    weight: 14,
    matcher: {
      kind: "pattern",
      patterns: [
        /verify\s+your\s+(?:account|identity|email|phone|number)/i,
        /account\s+verification/i,
        /confirm\s+your\s+identity/i,
        /i[- ]?verify\s+ang\s+account/i,
        /(?:identity|kyc)\s+verification/i,
        /kailangan(?:ng|\s+mo|\s+mong)?[^.?!]{0,20}\bmag[\s-]?verify\b/i,
        /\bmagpa[\s-]?verify\b/i,
        /\bi[\s-]?verify\s+(?:ang|mo)\b/i,
      ],
    },
  },
  {
    id: "credential.impersonation",
    category: "credential",
    label: "Pretends to be a bank or security team",
    explanation:
      "Claiming to be bank staff or a “security team” builds false trust so you comply.",
    weight: 12,
    matcher: {
      kind: "pattern",
      patterns: [
        /\bthis\s+is\b.{0,25}\bsecurity\b/i,
        /\bsecurity\s+(?:team|department|center|centre)\b/i,
        /\b(?:bank|bangko)\s+(?:representative|officer|manager)\b/i,
      ],
    },
  },
  {
    id: "credential.suspension",
    category: "credential",
    label: "Threatens account closure or suspension",
    explanation:
      "Fear of losing your account makes people click fake links before thinking.",
    weight: 13,
    matcher: {
      kind: "pattern",
      patterns: [
        /\b(?:permanent(?:ly)?\s+)?(?:suspend\w*|deactivat\w*|clos\w*|lock\w*)\b/i,
        /\bsuspended\b/i,
        /isasara\s+ang/i,
        /ma[\s-]?(?:lo|blo)[\s-]?lock\b/i,
        /ma[\s-]?de[\s-]?activate\b/i,
        /ma[\s-]?ca[\s-]?cancel\b/i,
      ],
    },
  },
  {
    id: "credential.password",
    category: "credential",
    label: "Asks for password or login details",
    explanation:
      "No real company will ever ask for your password or login details by message.",
    weight: 9,
    matcher: {
      kind: "pattern",
      patterns: [
        /\bpassword\b/i,
        /\blog[- ]?in\s+(?:details|credentials)\b/i,
        /\busername\s+and\s+password\b/i,
      ],
    },
  },
  {
    id: "credential.personal-info",
    category: "credential",
    label: "Requests personal details",
    explanation:
      "Collecting your name, address, or birthday enables identity theft and more targeted scams later.",
    weight: 9,
    matcher: {
      kind: "pattern",
      patterns: [
        /\bfull\s+name\b/i,
        /\bhome\s+address\b/i,
        /\bcomplete\s+address\b/i,
        /\bdate\s+of\s+birth\b/i,
        /\bbirthday\b/i,
        /ilagay\s+ang\s+(?:pangalan|address)/i,
      ],
    },
  },

  {
    id: "link.click-taglish",
    category: "link",
    label: "Taglish click instruction (“i-click mo ang link”)",
    explanation:
      "Instructions telling you to open a link are how fake pages harvest your logins.",
    weight: 8,
    matcher: {
      kind: "pattern",
      patterns: [
        /i[\s-]?click(?:\s+(?:mo|nyo))?\b/i,
        /\bpindutin\s+ang\b/i,
        /\bbuksan\s+ang\s+(?:link|site)\b/i,
      ],
    },
  },
  {
    id: "link.any-url",
    category: "link",
    label: "Contains a web link",
    explanation:
      "Links in unexpected messages can lead to fake login pages built to steal your details.",
    weight: 4,
    matcher: {
      kind: "custom",
      run: (text) => {
        const url = extractUrls(text)[0];
        return url ? { evidence: truncateEvidence(url, 40) } : null;
      },
    },
  },
  {
    id: "link.shortener",
    category: "link",
    label: "Shortened URL hides the destination",
    explanation:
      "Shortened links hide where they really go — exactly what scammers rely on.",
    weight: 13,
    matcher: {
      kind: "custom",
      run: (text) => {
        for (const url of extractUrls(text)) {
          if (URL_SHORTENER_HOSTS.has(getHost(url))) {
            return { evidence: truncateEvidence(url, 40) };
          }
        }
        return null;
      },
    },
  },
  {
    id: "link.high-risk-tld",
    category: "link",
    label: "Link uses a high-risk domain ending",
    explanation:
      "Certain domain endings are cheap to register and are favorites for throwaway scam sites.",
    weight: 12,
    matcher: {
      kind: "custom",
      run: (text) => {
        for (const url of extractUrls(text)) {
          const host = getHost(url);
          const tld = host.split(".").pop() ?? "";
          if (HIGH_RISK_TLDS.has(tld)) {
            return { evidence: truncateEvidence(host, 40) };
          }
        }
        return null;
      },
    },
  },
  {
    id: "link.brand-mimic",
    category: "link",
    label: "Link imitates an official brand domain",
    explanation:
      "The address imitates a real company’s name — a hallmark of fake login pages.",
    weight: 20,
    matcher: {
      kind: "custom",
      run: (text) => {
        for (const url of extractUrls(text)) {
          const host = getHost(url);
          const isOfficial = OFFICIAL_BRAND_DOMAINS.some(
            (domain) => host === domain || host.endsWith(`.${domain}`)
          );
          if (isOfficial) continue;
          const brand = IMPERSONATED_BRAND_TOKENS.find((token) =>
            host.includes(token)
          );
          if (brand) return { evidence: truncateEvidence(host, 40) };
        }
        return null;
      },
    },
  },
  {
    id: "link.ip-address",
    category: "link",
    label: "Link points to a raw IP address",
    explanation:
      "Legitimate companies never send links that point to bare IP addresses.",
    weight: 18,
    matcher: {
      kind: "custom",
      run: (text) => {
        for (const url of extractUrls(text)) {
          const host = getHost(url);
          if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) {
            return { evidence: truncateEvidence(host, 40) };
          }
        }
        return null;
      },
    },
  },
  {
    id: "link.insecure-http",
    category: "link",
    label: "Non-HTTPS (insecure) link",
    explanation:
      "Without HTTPS the connection isn’t encrypted — real services always use secure sites.",
    weight: 5,
    matcher: {
      kind: "custom",
      run: (text) => {
        for (const url of extractUrls(text)) {
          if (/^http:\/\//i.test(url)) {
            return { evidence: truncateEvidence(url, 40) };
          }
        }
        return null;
      },
    },
  },

  {
    id: "job.work-from-home",
    category: "job",
    label: "Work-from-home job pitch",
    explanation:
      "Unsolicited home-based job offers are frequently fronts for fee-based scams.",
    weight: 8,
    matcher: {
      kind: "pattern",
      patterns: [
        /work(?:ing)?\s+(?:from|at)\s+home/i,
        /\bhome[- ]based\b/i,
        /\bwfh\b/i,
      ],
    },
  },
  {
    id: "job.unrealistic-earnings",
    category: "job",
    label: "Unrealistic daily earnings claim",
    explanation:
      "Pay far above normal rates for simple tasks is bait used to reel job seekers in.",
    weight: 17,
    matcher: {
      kind: "pattern",
      patterns: [
        /(?:₱|PHP)\s?\d[\d,]*(?:\.\d{2})?\s*(?:\/|-|per\s)?\s*(?:day|week|hour|araw)/i,
        /\d[\d,]{2,}\s*(?:a|per|\/)\s*day/i,
        /\d[\d,]*\s*[-–]\s*(?:PHP|₱)?\s?\d[\d,]*\s+(?:daily|a\s+day|per\s+day)/i,
        /daily\s+(?:payout|income|salary|earnings)/i,
        /kita\s+(?:ka\s+ng\s+)?araw[- ]?araw/i,
      ],
    },
  },
  {
    id: "job.easy-hook",
    category: "job",
    label: "“Easy money / no experience” hook",
    explanation:
      "“Easy money, no experience” hooks target people who need income — then demand payments from them.",
    weight: 9,
    matcher: {
      kind: "pattern",
      patterns: [
        /easy\s+money/i,
        /no\s+experience\s+(?:needed|required)/i,
        /walang\s+karanasan/i,
        /instantly\s+hired?/i,
        /hiring\s+immediately/i,
      ],
    },
  },
  {
    id: "job.task-offer",
    category: "job",
    label: "Generic task-based job offer",
    explanation:
      "Vague product-rating or encoding jobs are the standard format of task scams.",
    weight: 8,
    matcher: {
      kind: "pattern",
      patterns: [
        /product\s+reviewer/i,
        /rates?\s+products/i,
        /rating\s+products/i,
        /data\s+entry/i,
        /encoding\s+job/i,
        /simple\s+tasks?\b/i,
      ],
    },
  },

  {
    id: "investment.double-money",
    category: "investment",
    label: "“Double your money” promise",
    explanation:
      "Doubling money quickly is impossible in real investing — it is the core hook of investing scams.",
    weight: 14,
    matcher: {
      kind: "pattern",
      patterns: [
        /(?:double|triple|dob[l]eh?|dobol)\s+(?:your\s+|ang\s+)?(?:money|investment|pera|kapital)/i,
        /\bdoble(?:ng)?\s+(?:pera|salapi|kapital)\b/i,
      ],
    },
  },
  {
    id: "investment.guaranteed-return",
    category: "investment",
    label: "Guaranteed high-return claim",
    explanation:
      "Legitimate investments never guarantee fixed high returns — guarantees are the scammer’s signature.",
    weight: 13,
    matcher: {
      kind: "pattern",
      patterns: [
        /guaranteed\s+(?:\d+\s*%?\s*)?(?:return|profit|income|kita)/i,
        /siguradong\s+kita/i,
        /\b\d{1,3}\s*%\s*(?:daily|weekly|monthly|per\s+(?:day|week|month)|kita|return|profit)/i,
      ],
    },
  },
  {
    id: "investment.trading-group",
    category: "investment",
    label: "Crypto / forex trading group pitch",
    explanation:
      "VIP trading groups with screenshots of profits are staged sets for deposit-collecting scams.",
    weight: 10,
    matcher: {
      kind: "pattern",
      patterns: [
        /\b(?:crypto|forex|bitcoin|btc|stock)\s*(?:trading|investing?|group|signals?|class|mentor|pool)\b/i,
        /trading\s+signals?\b/i,
      ],
    },
  },
  {
    id: "investment.recruit",
    category: "investment",
    label: "Direct invitation to invest",
    explanation:
      "Unsolicited invitations to “invest now” come from strangers precisely because no licensed seller works this way.",
    weight: 9,
    matcher: {
      kind: "pattern",
      patterns: [
        /\bpa[\s-]?invest\b/i,
        /\bmag[\s-]?invest\s+(?:ka|na|rin|tayong)\b/i,
        /invite(?:d)?\s+(?:you|ka)\s+to\s+invest/i,
      ],
    },
  },

  {
    id: "loan.instant-offer",
    category: "loan",
    label: "Instant / pre-approved loan offer",
    explanation:
      "Real lenders assess documents and capacity first — instant approval texts are bait.",
    weight: 12,
    matcher: {
      kind: "pattern",
      patterns: [
        /\b(?:instant|fast|quick|pre[\s-]?approved|approved)\s+(?:cash\s+)?loan\b/i,
        /\bloan\s+offer\b/i,
        /\bcash\s+loan\b/i,
        /\bpautang\b/i,
      ],
    },
  },
  {
    id: "loan.release-fee",
    category: "loan",
    label: "Advance fee to release a loan",
    explanation:
      "Fees collected before a loan is released go straight to scammers — legitimate lenders deduct fees from proceeds.",
    weight: 12,
    matcher: {
      kind: "pattern",
      patterns: [
        /\b(?:release|processing)\s+fee\b[^.?!]{0,40}\bloan/i,
        /\bloan\b[^.?!]{0,40}\b(?:release|processing)\s+fee/i,
        /bayaran\s+(?:muna|bago)[^.?!]{0,30}ma[- ]?i?release/i,
        /\binsurance\b[^.?!]{0,30}\bloan\b.{0,30}\bfee\b/i,
      ],
    },
  },

  {
    id: "romance.affection",
    category: "romance",
    label: "Affectionate stranger (“dear”, “my love”)",
    explanation:
      "Rapid affection from someone you have never met is how romance scams build false trust before asking for money.",
    weight: 6,
    matcher: {
      kind: "pattern",
      patterns: [
        /(?:hello|hi|hey)\s+dear\b/i,
        /\bmy\s+dear\b/i,
        /\bmy\s+love\b/i,
        /\bmahal\s+ko\b/i,
        /\bhoney\b/i,
      ],
    },
  },
  {
    id: "romance.overseas-package",
    category: "romance",
    label: "Overseas lover with held package or emergency",
    explanation:
      "The “soldier/engineer abroad with a customs-held package or sudden emergency” story is a scripted romance-scam playbook.",
    weight: 12,
    matcher: {
      kind: "pattern",
      patterns: [
        /\b(?:deployed|stationed|working)\s+abroad\b/i,
        /\bcustoms?\s+(?:fee|clearance)\b/i,
        /\b(?:package|box|gift|balikbayan)\b[^.?!]{0,50}\b(?:customs|held|detained|released?)\b/i,
      ],
    },
  },
];
