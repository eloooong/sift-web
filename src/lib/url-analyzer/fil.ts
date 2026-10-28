type UrlSignalCopy = { label: string; explanation: string };

export const URL_SIGNAL_FIL: Record<string, UrlSignalCopy> = {
  "insecure-transport": {
    label: "HTTP ang gamit ng link",
    explanation:
      "Walang encryption ang koneksyon. Huwag maglagay ng password o personal na detalye rito.",
  },
  "ip-literal-host": {
    label: "IP address ang gamit",
    explanation:
      "Numero ang ginagamit sa halip na pangalan ng website. Alamin muna kung inaasahan mo ang address na ito.",
  },
  "punycode-host": {
    label: "May espesyal na pagkakasulat ang domain",
    explanation:
      "Puwedeng gumamit ng magkakahawig na letra para gayahin ang pangalan ng isang brand.",
  },
  "excessive-subdomains": {
    label: "Maraming dagdag sa pangalan ng site",
    explanation:
      "Baka itinatago ng mahabang address kung anong website talaga ang bubuksan.",
  },
  "embedded-credentials": {
    label: "May login details sa mismong link",
    explanation:
      "Puwedeng gamitin ang bahaging ito para magmukhang iba ang website na pupuntahan mo.",
  },
  "unusual-port": {
    label: "Hindi karaniwan ang port number",
    explanation:
      "May kakaibang setting ng koneksyon ang address. Isama ito sa iba pang babalang nakita.",
  },
  "hyphen-heavy-host": {
    label: "Maraming gitling sa address",
    explanation:
      "Puwedeng idagdag ang mga gitling para magmukhang pangalan ng totoong brand ang site.",
  },
  "shortened-url": {
    label: "Pinaikling link",
    explanation:
      "Hindi agad makikita kung saang website papunta ang link.",
  },
  "brand-lookalike": {
    label: "Ginagaya ang address ng isang brand",
    explanation:
      "May kahawig itong kilalang pangalan, pero hindi ito ang opisyal na address.",
  },
  "known-official-domain": {
    label: "Tugma sa opisyal na address",
    explanation:
      "Tugma ang domain sa kilalang opisyal na address ng serbisyo.",
  },
  "suspicious-keywords": {
    label: "May mga salitang dapat bantayan",
    explanation:
      "May salitang gaya ng login, verify, o free sa link. Puwedeng gamitin ang mga ito sa pekeng page.",
  },
  "suspicious-tld": {
    label: "Kahina-hinalang dulo ng domain",
    explanation:
      "May ganitong dulo ng address sa ilang scam site. Hindi ito sapat na patunay nang mag-isa.",
  },
  "encoded-content": {
    label: "May bahaging mahirap basahin",
    explanation:
      "May naka-encode na text na puwedeng magtago ng laman o pupuntahan ng link.",
  },
  "risky-query-params": {
    label: "May kahina-hinalang dagdag sa link",
    explanation:
      "Baka may utos sa link na dalhin ka sa ibang website o subaybayan ang pagbisita mo.",
  },
  "very-long-url": {
    label: "Napakahaba ng link",
    explanation:
      "Mas mahirap makita ang tunay na pupuntahan kapag maraming dagdag sa address.",
  },
  "dangerous-scheme": {
    label: "Hindi ito karaniwang web link",
    explanation:
      "Mga link na nagsisimula sa http:// o https:// lang ang puwedeng i-check dito.",
  },
  "reputation-unsafe": {
    label: "May naunang babala sa link",
    explanation:
      "May babala ang Google Safe Browsing na mapanganib ang address na ito.",
  },
  "reputation-clean": {
    label: "Walang naitalang babala sa link",
    explanation:
      "Walang babala ang Google Safe Browsing para rito. Hindi ito garantiya na ligtas, lalo na kung bago pa ang site.",
  },
};

export const VERDICT_SUMMARY_FIL: Record<
  string,
  (domain: string) => string
> = {
  dangerous: () =>
    "Maraming malalakas na babala sa link na ito. Huwag itong buksan o lagyan ng password, OTP, o detalye ng bayad.",
  suspicious: (domain) =>
    `May ilang palatandaan ng scam sa “${domain}”. Huwag munang buksan. Gamitin ang opisyal na app o website para makasiguro.`,
  caution: (domain) =>
    `May kaunting dapat bantayan sa “${domain}”, pero hindi pa sapat para masabing scam. Alamin muna kung sino ang nagpadala at kung inaasahan mo ang link.`,
  "no-signals": (domain) =>
    `Walang nakitang kahina-hinala sa address na “${domain}”. Address lang ang nasuri, hindi ang laman ng website. Mag-ingat pa rin bago magbigay ng anumang detalye.`,
  blocked: () =>
    "Hindi ito web link na puwedeng i-check dito. Gumamit ng link na nagsisimula sa http:// o https://.",
};
