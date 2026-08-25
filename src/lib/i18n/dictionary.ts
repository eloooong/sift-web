import type { Lang } from "./config";

export const DICT = {
  en: {
    "nav.home": "Home",
    "nav.scanner": "Scanner",
    "nav.scamLibrary": "Scam Library",
    "nav.reports": "Reports",
    "nav.dashboard": "Dashboard",
    "nav.about": "About",
    "nav.history": "History",
    "nav.settings": "Settings",
    "nav.account": "Account",
    "nav.signIn": "Sign in",
    "nav.signUp": "Sign up",
    "nav.language": "Language",

    "scanner.tab.message": "Scan Message",
    "scanner.tab.screenshot": "Check Screenshot",
    "scanner.tab.url": "Check URL",
    "scanner.aria.modeTabs": "Scanner input mode",

    "scanner.page.title": "Scam Scanner",
    "scanner.page.description":
      "Paste any suspicious message or link below. An AI analyst working with our rule-based engine checks it for Philippine scam patterns — impersonation, urgency pressure, pay-to-claim fees, phishing links, and more.",
    "screenshot.page.title": "Screenshot Scanner",
    "screenshot.page.description":
      "Upload a screenshot of the suspicious SMS, chat, or email instead of typing it out. We extract the text with OCR and run the same scam analysis on it.",
    "url.page.title": "Link Checker",
    "url.page.description":
      "Paste a suspicious link below. We break down the address itself — protocol, domain, impersonation tricks — without ever visiting it.",

    "url.severity.critical": "Critical",
    "url.severity.high": "High concern",
    "url.severity.medium": "Medium concern",
    "url.severity.low": "Low concern",
    "url.severity.info": "Info",
    "url.verdict.no-signals": "No obvious issues",
    "url.verdict.caution": "Minor concerns",
    "url.verdict.suspicious": "Suspicious link",
    "url.verdict.dangerous": "Dangerous link",
    "url.verdict.blocked": "Not a web address",
    "url.signalsFound": "security signals",
    "url.signalFound": "security signal",
    "url.signalsStrong": "strong",
    "url.neverVisited": "The link was never opened or visited",
    "url.addressBreakdown": "Address breakdown",
    "url.protocol": "Protocol",
    "url.domain": "Domain",
    "url.hostname": "Hostname",
    "url.subdomains": "Subdomains",
    "url.path": "Path",
    "url.queryParams": "Query parameters",
    "url.paramsNone": "None",
    "url.paramCount": "parameter",
    "url.paramCountPlural": "parameters",
    "url.showParams": "Show raw parameters",
    "url.hideParams": "Hide raw parameters",
    "url.securitySignals": "Security signals",
    "url.noSignalsBody":
      "Nothing suspicious was found in the address structure itself.",
    "url.impersonationTitle": "Potential impersonation",
    "url.imitates": "This address appears to imitate",
    "url.officialDomain": "Official domain:",
    "url.checkAnother": "Check Another Link",
    "url.disclaimer":
      "This assessment inspects the address itself — patterns, structure, and (if configured) reputation databases. The link is never visited by our servers, and page content can't be seen, so a clean result is not a guarantee of safety.",

    "screenshot.privacy.title": "Before you upload — privacy notes",
    "screenshot.privacy.sensitive.title": "Screenshots can contain sensitive details",
    "screenshot.privacy.sensitive.body":
      "Names, phone numbers, chat photos, balances — anything visible in the capture is readable text to our analyzer. Crop out anything you don't need checked before uploading.",
    "screenshot.privacy.noStore.title": "Nothing is permanently stored",
    "screenshot.privacy.noStore.body":
      "Your upload is processed in memory only for the duration of the scan and discarded right after your report is generated. We don't build a gallery of screenshots.",
    "screenshot.privacy.ocr.title": "OCR runs on our server",
    "screenshot.privacy.ocr.body":
      "Text extraction happens server-side so the analysis stays consistent with the text scanner. Expect up to about a minute for the full OCR-plus-analysis pipeline.",
    "screenshot.privacy.rules":
      "Upload rules: PNG, JPG, JPEG, or WebP images up to 5 MB. Files that fail type or size validation are rejected immediately and never processed.",

    "url.note.zeroClick.title": "Zero-click analysis.",
    "url.note.zeroClick.body":
      "The link is parsed as text on our server — we never visit it, resolve it, or render it, so checking is completely safe.",
    "url.note.reputation.title": "Reputation-aware.",
    "url.note.reputation.body":
      "Where a reputation service is configured, results are cross-checked against known phishing and malware databases.",
    "url.note.fairScoring.title": "Fair scoring.",
    "url.note.fairScoring.body":
      "A single weak signal (like a shortened link) never labels an address dangerous on its own — verdicts require multiple independent or strong indicators.",

    "input.label": "Suspicious message or link",
    "input.placeholder":
      "Paste the SMS, email, chat message, or link you want to check…",
    "input.keyboardHint": "Press Control plus Enter to run the analysis.",
    "input.clear": "Clear",
    "input.analyze": "Analyze Message",
    "input.exampleLead": "No message handy? Load a real-world example:",
    "input.emptyTitle": "Nothing to analyze yet",
    "input.emptyBody":
      "Paste a suspicious SMS, email, chat message, or link above — or tap one of the example scams to see how ScamShield breaks down a threat.",

    "report.scannedWith": "Scanned with",
    "report.whatThisMeans": "What this means",
    "report.redFlags": "Red flags found",
    "report.redFlagsEmpty":
      "Nothing in this message was identified as a red flag. Review the sender carefully anyway — new scams appear all the time.",
    "report.foundInMessage": "Found in your message",
    "report.howScoreCalculated": "How the score was calculated",
    "report.breakdownNone":
      "No points were added — nothing suspicious matched.",
    "report.totalScore": "Total risk score",
    "report.pointsNote.ai":
      "The points above come from the rule-engine pre-scan of your message. The final score combines that pre-scan with the AI analyst's independent assessment.",
    "report.pointsNote.rules":
      "Each matched pattern adds points based on how dangerous it is. Points are combined and scaled into the final 0–100 score shown above.",
    "report.whatToDo": "What you should do",
    "report.analyzeAnother": "Analyze Another Message",
    "report.analyzeAnotherScreenshot": "Analyze Another Screenshot",
    "report.copyReport": "Copy Report",
    "report.copied": "Copied",
    "report.originalMessage": "Original message",
    "report.extractedText": "Extracted text from screenshot",
    "report.characters": "characters",
    "report.ocrNote":
      "Text recovered with OCR — minor misreads are possible. The analysis above is based on this extracted content.",
    "report.highlightNote": "Highlighted phrases matched the red flags above.",
    "report.engineConfidence": "Engine confidence",
    "report.flagsFound": "red flags found",
    "report.flag": "red flag",
    "report.engineAi": "AI judgment cross-checked with the rule engine",
    "report.engineRules": "Rule-based engine",
    "report.fromScreenshot": "Analyzed from screenshot",
    "report.chip.ai": "AI analysis",
    "report.chip.rules": "Rule-based engine",
    "report.disclaimer.ai":
      "This report was produced by an AI analyst working alongside our rule-based engine. AI can misjudge unusual wording — treat it as guidance, not a verdict, and independently verify important information through official channels.",
    "report.disclaimer.rules":
      "This result comes from ScamShield's transparent rule-based engine — pattern matching, not AI. Rules can miss new tactics or flag unusual wording. Treat it as guidance and verify through official channels before acting.",

    "risk.low": "Low Risk",
    "risk.medium": "Moderate Risk",
    "risk.high": "High Risk",
    "risk.critical": "Critical",

    "a11y.skipToContent": "Skip to main content",

    "hero.badge": "Free to use · No sign-up required",
    "hero.title.pre": "Think it's a scam?",
    "hero.title.highlight": "Let ScamShield check.",
    "hero.subhead":
      "AI-powered scam detection built to help Filipinos identify suspicious messages, links, and online threats.",
    "hero.cta.scan": "Scan Something Suspicious",
    "hero.cta.how": "How It Works",
    "hero.check.builtForPh": "Built for Philippine scam patterns",
    "hero.check.plainLanguage": "Explains red flags in plain language",
    "hero.check.free": "Free to use — no account required",
    "hero.sample.reportLabel": "Analysis Report",
    "hero.sample.category": "Category",
    "hero.sample.categoryValue": "Fake Prize / Lottery (SMS)",
    "hero.sample.evidence": "Evidence",
    "hero.sample.recommended": "Recommended:",
    "hero.sample.recommendedBody":
      "Do not reply and do not pay any fee. Block the number, then report the message to your telco and the NTC.",
    "hero.sample.note": "Sample output — run your own scan on the",
    "hero.sample.noteLink": "scanner page",

    "footer.tagline":
      "AI-powered scam detection built to help Filipinos identify suspicious messages, links, and online threats — with clear explanations, not just labels.",
    "footer.product": "Product",
    "footer.resources": "Resources",
    "footer.link.scanner": "Scam Scanner",
    "footer.link.screenshot": "Screenshot Scanner",
    "footer.link.library": "Scam Library",
    "footer.link.scanTypes": "Supported Scan Types",
    "footer.link.howItWorks": "How It Works",
    "footer.link.about": "About ScamShield",
    "footer.link.examples": "Common PH Scam Patterns",
    "footer.link.privacy": "Privacy Principles",
    "footer.disclaimer":
      "ScamShield PH is an independent educational tool. It is not affiliated with, endorsed by, or connected to GCash, Maya, any bank, Shopee, Lazada, LBC, J&T Express, Grab, or any government agency mentioned in examples or sample content. Brand names appear only to illustrate impersonation tactics commonly used by scammers. Analysis output is informational only and is not legal, financial, or security advice.",
    "footer.copyright": "All rights reserved.",
    "auth.displayName": "Display name",
    "auth.nameHint": "Optional · how you'll appear in the app",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.passwordHint": "At least 8 characters",
    "auth.signingIn": "Signing in…",
    "auth.creating": "Creating account…",
    "auth.submitUp": "Create account",
    "auth.newHere": "New here?",
    "auth.createLink": "Create an account",
    "auth.haveAccount": "Already have an account?",
    "auth.genericError": "Something went wrong. Please try again.",
    "auth.networkError": "Network error — check your connection and try again.",
    "auth.signin.title": "Welcome back",
    "auth.signin.body": "Sign in to open your private scan history.",
    "auth.signup.title": "Create your account",
    "auth.signup.body": "Free, no personal details beyond an email — scans made while signed in are saved to your private history.",
  },

  fil: {
    "nav.home": "Home",
    "nav.scanner": "Scanner",
    "nav.scamLibrary": "Scam Library",
    "nav.reports": "Mga Report",
    "nav.dashboard": "Dashboard",
    "nav.about": "About",
    "nav.history": "History",
    "nav.settings": "Settings",
    "nav.account": "Account",
    "nav.signIn": "Sign in",
    "nav.signUp": "Sign up",
    "nav.language": "Wika",

    "scanner.tab.message": "I-scan ang Message",
    "scanner.tab.screenshot": "Tingnan ang Screenshot",
    "scanner.tab.url": "I-check ang Link",
    "scanner.aria.modeTabs": "Paraan ng pag-scan",

    "scanner.page.title": "Scam Scanner",
    "scanner.page.description":
      "I-paste ang kahina-hinalang message o link sa ibaba. Titingnan ito ng AI analyst kasama ang aming rule-based engine para sa mga scam na karaniwan sa Pilipinas — panlilinlang na kunwari company o ahensya ng gobyerno, panggigipit na \"kailangan ngayon\", bayad bago makuhang premyo, at peke o mapanlinlang na link.",
    "screenshot.page.title": "Screenshot Scanner",
    "screenshot.page.description":
      "Mag-upload ng screenshot ng kahina-hinalang SMS, chat, o email para hindi mo na kailangang i-type. Kukunin namin ang teksto gamit ang OCR at sasuriin gamit ang parehong scam analysis.",
    "url.page.title": "Link Checker",
    "url.page.description":
      "I-paste ang kahina-hinalang link sa ibaba. Susuriin namin ang mismong address — protocol, domain, at mga pandarayang ginagaya ang totoong brand — nang hindi binibisita ang link.",

    "url.severity.critical": "Kritikal",
    "url.severity.high": "Mataas na alalahanin",
    "url.severity.medium": "Katamtamang alalahanin",
    "url.severity.low": "Mababang alalahanin",
    "url.severity.info": "Impormasyon",
    "url.verdict.no-signals": "Walang kapansin-pansing problema",
    "url.verdict.caution": "May kaunting alalahanin",
    "url.verdict.suspicious": "Kahina-hinalang link",
    "url.verdict.dangerous": "Mapanganib na link",
    "url.verdict.blocked": "Hindi web address",
    "url.signalsFound": "security signals",
    "url.signalFound": "security signal",
    "url.signalsStrong": "malakas",
    "url.neverVisited": "Hindi kailanman binuksan o binisita ang link",
    "url.addressBreakdown": "Pagsira ng address",
    "url.protocol": "Protocol",
    "url.domain": "Domain",
    "url.hostname": "Hostname",
    "url.subdomains": "Mga subdomain",
    "url.path": "Path",
    "url.queryParams": "Mga query parameter",
    "url.paramsNone": "Wala",
    "url.paramCount": "parameter",
    "url.paramCountPlural": "mga parameter",
    "url.showParams": "Ipakita ang raw parameters",
    "url.hideParams": "Itago ang raw parameters",
    "url.securitySignals": "Mga security signal",
    "url.noSignalsBody":
      "Walang nakitang kahina-hinala sa mismong istruktura ng address.",
    "url.impersonationTitle": "Posibleng pagpapanggap",
    "url.imitates": "Mukhang kinokopya ng address na ito ang",
    "url.officialDomain": "Opisyal na domain:",
    "url.checkAnother": "I-check ang Ibang Link",
    "url.disclaimer":
      "Ang pagsusuring ito ay sa mismong address — pattern, istruktura, at (kung naka-set up) reputation databases. Hindi kailanman binibisita ng aming server ang link, at hindi namin nakikita ang laman ng page, kaya ang malinis na resulta ay hindi garantiya na ligtas.",

    "screenshot.privacy.title": "Bago mag-upload — mga paalala sa privacy",
    "screenshot.privacy.sensitive.title": "Maaaring may sensitibong detalye ang screenshot",
    "screenshot.privacy.sensitive.body":
      "Pangalan, numero ng telepono, chat photos, balance — lahat ng nakikita sa capture ay nababasang teksto para sa aming analyzer. I-crop muna ang mga hindi mo kailangang ipa-check bago mag-upload.",
    "screenshot.privacy.noStore.title": "Walang permanenteng naka-store",
    "screenshot.privacy.noStore.body":
      "Ang upload mo ay pinoproseso lang sa memorya habang nag-scan at tinatapon agad pagkatapos makabuo ang report mo. Hindi kami gumagawa ng gallery ng mga screenshot.",
    "screenshot.privacy.ocr.title": "Sa aming server tumatakbo ang OCR",
    "screenshot.privacy.ocr.body":
      "Nasa server side ang text extraction para consistent ang analysis sa text scanner. Maaaring umabot nang humigit-kumulang isang minuto ang buong OCR-plus-analysis pipeline.",
    "screenshot.privacy.rules":
      "Mga panuntunan sa upload: PNG, JPG, JPEG, o WebP na hanggang 5 MB. Agad tinatanggihan at hindi pinoproseso ang files na hindi pumasa sa type o size validation.",

    "url.note.zeroClick.title": "Zero-click analysis.",
    "url.note.zeroClick.body":
      "Ang link ay binabasa bilang teksto sa aming server — hindi namin ito binibisita, rina-resolve, o rina-render, kaya lubos na ligtas ang pag-check.",
    "url.note.reputation.title": "Naka-check sa reputation.",
    "url.note.reputation.body":
      "Kung may naka-set up na reputation service, kinukumpara ang resulta sa mga kilalang phishing at malware database.",
    "url.note.fairScoring.title": "Patas na scoring.",
    "url.note.fairScoring.body":
      "Isang mahinang signal lang (tulad ng shortened link) ay hindi sapat para tawaging mapanganib ang address — kailangan ng maraming malalakas o magkakahiwalay na indikasyon.",

    "input.label": "Kahina-hinalang message o link",
    "input.placeholder":
      "I-paste ang SMS, email, chat message, o link na gusto mong ipa-check…",
    "input.keyboardHint":
      "Pindutin ang Control katabi ng Enter para simulan ang pagsusuri.",
    "input.clear": "Burahin",
    "input.analyze": "Suriin ang Message",
    "input.exampleLead": "Walang maisamaing message? Subukan ang mga tunay na halimbawa:",
    "input.emptyTitle": "Wala pang sasuriin",
    "input.emptyBody":
      "I-paste ang kahina-hinalang SMS, email, chat message, o link sa itaas — o pindutin ang isa sa mga halimbawang scam para makita kung paano sinusuri ng ScamShield ang isang banta.",

    "report.scannedWith": "Sinuri gamit ang",
    "report.whatThisMeans": "Ano ang ibig sabihin nito",
    "report.redFlags": "Mga pulang bandila na nakita",
    "report.redFlagsEmpty":
      "Walang nakitang red flag sa message na ito. Pero mag-ingat pa rin sa sender — laging may bagong modus ang mga scammer.",
    "report.foundInMessage": "Makikita sa message mo",
    "report.howScoreCalculated": "Paano nabuo ang score",
    "report.breakdownNone":
      "Walang nadagdag na puntos — walang tumugma na kahina-hinalaan.",
    "report.totalScore": "Kabuuang risk score",
    "report.pointsNote.ai":
      "Ang mga puntos sa itaas ay galing sa rule-engine na paunang scan ng message mo. Ang final score ay pinagsama ng pre-scan na iyon at ng sariling pagtataya ng AI analyst.",
    "report.pointsNote.rules":
      "Bawat pattern na tumugma ay may dagdag na puntos depende sa kalapastapan nito. Pinagsasama ang mga punto at ginagawang final score na 0–100.",
    "report.whatToDo": "Ang dapat mong gawin",
    "report.analyzeAnother": "Sumuri ng Ibang Message",
    "report.analyzeAnotherScreenshot": "Sumuri ng Ibang Screenshot",
    "report.copyReport": "Kopyahin ang Report",
    "report.copied": "Nakopya na",
    "report.originalMessage": "Orihinal na message",
    "report.extractedText": "Tekstong nakuha mula sa screenshot",
    "report.characters": "characters",
    "report.ocrNote":
      "Nakuha ang tekstong ito gamit ang OCR — maaaring may maliit na pagkakamali sa pagbasa. Batay sa nilalaman na ito ang pagsusuri sa itaas.",
    "report.highlightNote": "Ang mga naka-highlight na bahagi ang tumugma sa mga red flag sa itaas.",
    "report.engineConfidence": "Kumpiyansa ng engine",
    "report.flagsFound": "pulang bandila na nakita",
    "report.flag": "pulang bandila",
    "report.engineAi": "Pinag-krus ng rule engine ang judgment ng AI",
    "report.engineRules": "Rule-based engine",
    "report.fromScreenshot": "Galing sa screenshot",
    "report.chip.ai": "AI analysis",
    "report.chip.rules": "Rule-based engine",
    "report.disclaimer.ai":
      "Ang report na ito ay gawa ng AI analyst na katulong ng aming rule-based engine. Maaaring magkamali ang AI sa pambihirang phrasing — ituring itong gabay, hindi hatol, at i-verify ang mahahalagang impormasyon sa opisyal na channel.",
    "report.disclaimer.rules":
      "Ang resulta na ito ay galing sa transparent na rule-based engine ng ScamShield — pattern matching, hindi AI. Maaaring makalusot ang bagong modus o maflag ang pambihirang phrasing. Ituring na gabay at i-verify muna sa opisyal na channel bago kumilos.",

    "risk.low": "Mababang Panganib",
    "risk.medium": "Katamtamang Panganib",
    "risk.high": "Mataas na Panganib",
    "risk.critical": "Kritikal",

    "a11y.skipToContent": "Laktawan ang pangunahing nilalaman",

    "hero.badge": "Libreng gamitin · Walang kailangang sign-up",
    "hero.title.pre": "Mukhang scam?",
    "hero.title.highlight": "Ipa-check sa ScamShield.",
    "hero.subhead":
      "AI-powered na scam detection na ginawa para matulungan ang mga Pilipino na makilala ang kahina-hinalang messages, links, at online threats.",
    "hero.cta.scan": "Mag-scan ng Kahina-hinala",
    "hero.cta.how": "Paano Ito Gumagana",
    "hero.check.builtForPh": "Ginawa para sa mga scam na karaniwan sa Pilipinas",
    "hero.check.plainLanguage": "Ipinapaliwanag ang mga red flag nang malinaw",
    "hero.check.free": "Libre — walang kailangang account",
    "hero.sample.reportLabel": "Ulat ng Pagsusuri",
    "hero.sample.category": "Kategorya",
    "hero.sample.categoryValue": "Peke na Premyo / Lottery (SMS)",
    "hero.sample.evidence": "Ebidensya",
    "hero.sample.recommended": "Rekomendasyon:",
    "hero.sample.recommendedBody":
      "Huwag sumagot at huwag magbayad ng anumang fee. I-block ang numero, tapos i-report ang message sa telco mo at sa NTC.",
    "hero.sample.note": "Halimbawang output — sumuri ng sarili mong message sa",
    "hero.sample.noteLink": "scanner page",

    "footer.tagline":
      "AI-powered na scam detection na ginawa para matulungan ang mga Pilipino na makilala ang kahina-hinalang messages, links, at online threats — may malinaw na paliwanag, hindi lang mga label.",
    "footer.product": "Produkto",
    "footer.resources": "Mga Resource",
    "footer.link.scanner": "Scam Scanner",
    "footer.link.screenshot": "Screenshot Scanner",
    "footer.link.library": "Scam Library",
    "footer.link.scanTypes": "Mga Sinusuportahang Uri ng Scan",
    "footer.link.howItWorks": "Paano Ito Gumagana",
    "footer.link.about": "Tungkol sa ScamShield",
    "footer.link.examples": "Mga Karaniwang Scam sa Pilipinas",
    "footer.link.privacy": "Mga Prinsipyo sa Privacy",
    "footer.disclaimer":
      "Ang ScamShield PH ay isang independenteng educational tool. Hindi ito kaakibat, inendorso, o konektado sa GCash, Maya, kahit anong bangko, Shopee, Lazada, LBC, J&T Express, Grab, o kahit anong ahensya ng gobyerno na binabanggit sa mga halimbawa o sample content. Ang mga brand name ay lumilitaw lamang para ipakita ang mga modus ng pagpapanggap na karaniwang ginagamit ng mga scammer. Ang output ng pagsusuri ay para sa impormasyon lamang at hindi legal, pinansyal, o security advice.",
    "footer.copyright": "Nakalaan ang lahat ng karapatan.",
    "auth.displayName": "Pangalang ipapakita",
    "auth.nameHint": "Opsyonal · ganito ka makikita sa app",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.passwordHint": "Hindi bababa sa 8 characters",
    "auth.signingIn": "Nag-sign in…",
    "auth.creating": "Gumagawa ng account…",
    "auth.submitUp": "Gumawa ng account",
    "auth.newHere": "Wala ka pang account?",
    "auth.createLink": "Gumawa ng account",
    "auth.haveAccount": "May account na?",
    "auth.genericError": "May naganap na mali. Pakisubukan muli.",
    "auth.networkError": "Error sa network — tingnan ang koneksyon mo at subukan muli.",
    "auth.signin.title": "Maligayang pagbabalik",
    "auth.signin.body": "Mag-sign in para buksan ang pribado mong scan history.",
    "auth.signup.title": "Gumawa ng account",
    "auth.signup.body": "Libre, walang personal na detalye bukod sa email — ang mga scan mo habang naka-sign in ay nase-save sa pribado mong history.",
  },
} satisfies Record<Lang, Record<string, string>>;

export type DictKey = keyof (typeof DICT)["en"];

export function t(lang: Lang, key: DictKey): string {
  return DICT[lang][key] ?? DICT.en[key];
}
