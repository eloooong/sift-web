type UrlSignalCopy = { label: string; explanation: string };

export const URL_SIGNAL_FIL: Record<string, UrlSignalCopy> = {
  "insecure-transport": {
    label: "Hindi secure na http:// link",
    explanation:
      "Walang encryption ang connection, kaya hindi ligtas maglagay ng anumang personal na detalye dito.",
  },
  "ip-literal-host": {
    label: "IP address ang host",
    explanation:
      "Bihirang lehitimo ang website na gumagamit ng IP address sa halip na pangalan ng site.",
  },
  "punycode-host": {
    label: "Naka-encode na pangalan ng domain (punycode)",
    explanation:
      "Maaaring ginamit ito para kamukha ang isang kilalang brand gamit ang magkakahawig na titik.",
  },
  "excessive-subdomains": {
    label: "Sobrang daming subdomain",
    explanation:
      "Ginagamit ang mahabang subdomain para itago ang tunay at kahina-hinalang domain.",
  },
  "embedded-credentials": {
    label: "May username/password sa link mismo",
    explanation:
      "May nakaipit na login details ang link, karaniwang paraan ito para linlangin ang mga tao.",
  },
  "unusual-port": {
    label: "Di-karaniwang port number",
    explanation:
      "Ang di-standard na port ay senyales ng hindi ordinaryong server.",
  },
  "hyphen-heavy-host": {
    label: "Sobrang daming hyphen sa domain",
    explanation:
      "Madalas gamitin ang maraming gitling para kamukha ang pangalan ng tunay na site.",
  },
  "shortened-url": {
    label: "Shortened link (bit.ly at iba pa)",
    explanation:
      "Itinatago ng shortener ang tunay na destinasyon, paboritong gamit ng scammers.",
  },
  "brand-lookalike": {
    label: "Kamukha ng opisyal na brand",
    explanation:
      "Malapit sa spelling ng kilalang company ang domain pero hindi ito ang opisyal na site nito.",
  },
  "known-official-domain": {
    label: "Kilala at opisyal na domain",
    explanation: "Ang address na ito ay tugma sa opisyal na domain ng serbisyo.",
  },
  "suspicious-keywords": {
    label: "Kahina-hinalang mga salita sa link",
    explanation:
      "May mga salita tulad ng \"login\", \"verify\", o \"free\" sa URL, na madalas gamitin sa phishing page.",
  },
  "suspicious-tld": {
    label: "Kahina-hinalang domain ending (.xyz, .top, atbp.)",
    explanation:
      "Madalas gamitin ang murang domain endings sa mabilisang gawaing scam site.",
  },
  "encoded-content": {
    label: "May naka-encode na bahagi ang link",
    explanation:
      "Ginagamit ang encoding para itago ang tunay na nilalaman o destinasyon ng link.",
  },
  "risky-query-params": {
    label: "May kahina-hinalang parameters ang link",
    explanation:
      "Maaaring nagtatago ang link ng redirect o tracking parameter papunta sa ibang site.",
  },
  "very-long-url": {
    label: "Sobrang habang link",
    explanation:
      "Ang sobrang habang URL ay madalas paraan para itago ang tunay na destinasyon.",
  },
  "dangerous-scheme": {
    label: "Hindi web address ang input",
    explanation:
      "Tanging http:// at https:// lang ang pwedeng suriin. Tinatanggihan ang javascript:, data:, file:, at iba pa para sa kaligtasan mo.",
  },
  "reputation-unsafe": {
    label: "Na-flag sa reputation database",
    explanation:
      "Nakarehistro ang address na ito bilang mapanganib sa Google Safe Browsing.",
  },
  "reputation-clean": {
    label: "Wala sa listahan ng banta",
    explanation:
      "Walang naitalang banta sa address na ito sa Google Safe Browsing. Hindi pa rin ito garantiya, dahil maaari pa ring bagong gawa ang scam site.",
  },
};

export const VERDICT_SUMMARY_FIL: Record<
  string,
  (domain: string) => string
> = {
  dangerous: () =>
    "Maraming malalakas na palatandaan ng phishing o scam page ang address na ito. Huwag itong buksan, at huwag kailan maglagay ng login, OTP, o detalye ng bayad dito.",
  suspicious: (domain) =>
    `Maraming babala ang “${domain}” na karaniwan sa mga scam link. Ituring itong hindi pinagkakatiwalaan hangga't hindi mo na-verify ang destinasyon sa opisyal na app o website.`,
  caution: (domain) =>
    `May maliliit na bahala sa “${domain}” pero walang paniniyak. Buksan lang kung inaasahan mo ito, at i-double-check ang spelling ng domain bago maglagay ng anumang impormasyon.`,
  "no-signals": (domain) =>
    `Walang natukoy na istruktural na red flag sa “${domain}”. Sinusuri lang nito ang address mismo, hindi nito nakikita ang laman ng page, kaya manatiling alerto pagkatapos buksan ang link.`,
  blocked: () =>
    "Hindi ito web address na kayang suriin. Tanging http/https link lang ang sinusuportahan.",
};
