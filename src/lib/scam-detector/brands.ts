export type BrandGroup =
  | "ewallet"
  | "bank"
  | "government"
  | "courier"
  | "marketplace"
  | "transport";

type BrandEntry = { group: BrandGroup; name: string; regex: RegExp };

const BRAND_NAMES: Record<BrandGroup, string[]> = {
  ewallet: ["gcash", "paymaya", "maya", "coins.ph", "coinsph"],
  bank: [
    "bdo",
    "bpi",
    "metrobank",
    "security bank",
    "landbank",
    "unionbank",
    "pnb",
    "chinabank",
    "eastwest",
    "rcbc",
    "psbank",
    "gotyme",
    "philippine bank",
  ],
  government: [
    "sss",
    "philhealth",
    "pag-ibig",
    "pagibig",
    "bir",
    "pnp",
    "nbi",
    "lto",
    "dole",
    "dfa",
    "pagcor",
    "pcso",
  ],
  courier: [
    "lbc",
    "j&t express",
    "jt express",
    "jnt express",
    "j&t",
    "flash express",
    "ninja van",
    "dhl",
    "fedex",
  ],
  marketplace: ["shopee", "lazada", "tiktok shop", "tiktokshop"],
  transport: ["grab", "angkas", "joyride", "moveit"],
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const BRAND_ENTRIES: BrandEntry[] = Object.entries(BRAND_NAMES).flatMap(
  ([group, names]) =>
    [...names]
      .sort((a, b) => b.length - a.length)
      .map((name) => ({
        group: group as BrandGroup,
        name,
        regex: new RegExp(
          `(?<![a-z0-9])${escapeRegex(name)}(?![a-z0-9])`,
          "gi"
        ),
      }))
);

const PAYMENT_CHANNEL_BEFORE_REGEX =
  /\b(?:via|through|using|per|to|sa|kung)\s*(?:the\s*)?$/i;
const PAYMENT_CHANNEL_AFTER_REGEX =
  /^\s*(?:wallet|number|account|mo|ko|nya|niya)\b/i;

export type BrandMention = {
  group: BrandGroup;
  name: string;
  index: number;
  paymentChannel: boolean;
};

export function findBrandMentions(text: string): BrandMention[] {
  const lower = text.toLowerCase();
  const mentions: BrandMention[] = [];

  for (const entry of BRAND_ENTRIES) {
    entry.regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = entry.regex.exec(lower)) !== null) {
      const before = lower.slice(Math.max(0, match.index - 28), match.index);
      const after = lower.slice(
        match.index + match[0].length,
        match.index + match[0].length + 12
      );
      const paymentChannel =
        PAYMENT_CHANNEL_BEFORE_REGEX.test(before) ||
        PAYMENT_CHANNEL_AFTER_REGEX.test(after);
      mentions.push({
        group: entry.group,
        name: entry.name,
        index: match.index,
        paymentChannel,
      });
    }
  }

  return mentions.sort((a, b) => a.index - b.index);
}

export type GroupMentionSummary = {
  group: BrandGroup;
  names: string[];
  impersonationNames: string[];
  paymentOnly: boolean;
};

export function summarizeBrandGroups(
  mentions: BrandMention[]
): Map<BrandGroup, GroupMentionSummary> {
  const summary = new Map<BrandGroup, GroupMentionSummary>();

  for (const mention of mentions) {
    const entry = summary.get(mention.group) ?? {
      group: mention.group,
      names: [],
      impersonationNames: [],
      paymentOnly: true,
    };
    if (!entry.names.includes(mention.name)) entry.names.push(mention.name);
    if (!mention.paymentChannel) {
      entry.paymentOnly = false;
      if (!entry.impersonationNames.includes(mention.name)) {
        entry.impersonationNames.push(mention.name);
      }
    }
    summary.set(mention.group, entry);
  }

  return summary;
}
