import type { Lang } from "./config";

export const DICT = {
  en: {
    "progress.text.title": "Checking your message",
    "progress.text.body":
      "Looking for warning signs. Your result and recommended next steps will appear here.",
    "progress.screenshot.title": "Reading your screenshot",
    "progress.screenshot.body":
      "Extracting the text and checking it for warning signs. Larger images can take longer.",
    "progress.url.title": "Checking the link",
    "progress.url.body":
      "Inspecting the address without opening the link. Your result will appear here.",
    "progress.cancel": "Cancel check",
    "input.historyNotice":
      "Scans made while signed in are saved to your private history.",
    "history.storage.saved": "Saved scans are private to your account.",
    "history.storage.local":
      "Local mode: history is kept on this server and clears when it restarts.",
    "history.reportUnavailable":
      "The full report for this scan is unavailable. Run it again to create a new report.",
    "nav.signOutFailed": "Couldn't sign out. Try again.",

    "theme.nightMode": "Night mode",
    "theme.switchLight": "Switch to day mode",
    "theme.switchDark": "Switch to night mode",
    "theme.on": "On",
    "theme.off": "Off",
    "nav.signOut": "Sign out",
    "nav.signingOut": "Signing out...",
    "nav.communityReports": "Community reports",
    "nav.myHistory": "My history",
    "nav.scamInsights": "Scam insights",
    "nav.mainNavigation": "Main navigation",
    "nav.mobileNavigation": "Mobile navigation",
    "nav.openMenu": "Open navigation menu",
    "nav.guestHint": "Free scans. No sign-up required.",
    "nav.saveHistoryHint": "Sign in to save and revisit your scans.",
    "auth.createToSave": "Create an account to save your scan history.",

    "risk.meter.label": "Risk score",
    "risk.meter.low": "Low",
    "risk.meter.medium": "Moderate",
    "risk.meter.high": "High",
    "risk.meter.critical": "Critical",
    "home.walkthrough.steps": "Explore the three steps",
    "home.walkthrough.label": "Example walkthrough",
    "home.walkthrough.received": "First, look at the message.",
    "home.walkthrough.evidence": "Three reasons to pause.",
    "home.walkthrough.action": "You have a safer option.",
    "home.walkthrough.fee": "A processing fee before receiving a prize.",
    "home.walkthrough.identity":
      "A request for your name, address, and birthday.",
    "home.walkthrough.deadline":
      "A 24-hour deadline to pressure you into acting.",
    "home.walkthrough.advice":
      "Don't pay the fee or send personal details. Verify the claim through the organization's official website or app, using an address you find independently.",
    "home.walkthrough.next": "Next step",
    "home.walkthrough.again": "Start again",

    "library.title": "Recognize the pattern.",
    "library.body":
      "A practical guide to common Philippine scams. Choose a category to learn the warning signs, inspect an example, and find a safer next step.",
    "library.signs": "What to watch for",
    "library.sample": "An illustrative message",

    "home.hero.title": "A second look. A safer next step.",
    "home.hero.body":
      "A strange text. An urgent request. A link that feels off. Check it with Sift before you click, pay, or reply.",
    "home.checkMessage": "Check a message",
    "home.checkScreenshot": "Check a screenshot",
    "home.hero.note": "Free scans. No sign-up required.",
    "home.sample.label": "A closer look",
    "home.sample.example": "Illustrative sample",
    "home.sample.choose": "Choose a sample message",
    "home.sample.prize": "Prize offer",
    "home.sample.wallet": "Wallet alert",
    "home.sample.otp": "OTP request",
    "home.sample.risk": "Risk score",
    "home.sample.next":
      "Pause before responding. Verify the message through the organization's official app or website.",
    "home.sample.try": "See the full breakdown",
    "home.tool.text": "Messages",
    "home.tool.textBody": "SMS, email, Messenger, and other copied text.",
    "home.tool.image": "Screenshots",
    "home.tool.imageBody": "Upload an image. Sift reads the message for you.",
    "home.tool.link": "Links",
    "home.tool.linkBody": "Inspect a suspicious address without opening it.",
    "home.how.title": "Know what feels wrong. And why.",
    "home.how.body":
      "A warning is more useful when you understand it. Sift looks for familiar Philippine scam patterns and explains the signals behind the result.",
    "home.step.paste": "Bring the message",
    "home.step.pasteBody":
      "Paste the text, upload a screenshot, or check a link. You can start without signing up.",
    "home.step.look": "Look at the evidence",
    "home.step.lookBody":
      "See the requests, links, and pressure tactics that contributed to the risk assessment.",
    "home.step.act": "Choose a safer next step",
    "home.step.actBody":
      "Get practical guidance on what to avoid and how to verify through official channels.",
    "home.examples.title": "Familiar messages. Recognizable patterns.",
    "home.examples.body":
      "Scams change their wording. The tactics tend to repeat. Learn a few you might find in your own inbox.",
    "home.examples.all": "Explore the scam library",
    "home.examples.inspect": "Inspect this example",
    "home.examples.note":
      "Samples are reconstructed for education. They are not real messages or endorsements of the brands mentioned.",
    "home.privacy.title": "Your trust deserves a clear explanation.",
    "home.privacy.body":
      "Sift is an independent educational tool for Filipino internet users. It helps you assess a message; it cannot guarantee that a sender or offer is safe.",
    "home.privacy.account": "Start without an account",
    "home.privacy.accountBody":
      "The scanner is open to everyone. Sign in if you want to keep your scans in your private history.",
    "home.privacy.data": "Know what is saved",
    "home.privacy.dataBody":
      "Signed-in scans are saved to your account history. Avoid including passwords, OTPs, or full account numbers in what you submit.",
    "home.privacy.explain": "Evidence you can review",
    "home.privacy.explainBody":
      "Read what was flagged and why. Always verify important requests through an official channel.",
    "home.cta.title": "Something in your inbox feels off?",
    "home.cta.body": "Take a moment to check it before you act.",
    "nav.scanNow": "Check a message",
    "footer.note": "Independent guidance for a safer next step.",
    "auth.aside.title": "A little more clarity. Every time.",
    "auth.aside.body":
      "Keep your scan history in one place, revisit the evidence, and recognize the patterns next time.",
    "auth.aside.note": "You can always use the scanner without an account.",

    "nav.home": "Home",
    "nav.scanner": "Scanner",
    "nav.scamLibrary": "Scam Library",
    "nav.reports": "Reports",
    "nav.more": "More",
    "nav.scamIntelligence": "Scam Intelligence",
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
    "scanner.mode.text": "Paste Text",
    "scanner.mode.textShort": "Text",
    "scanner.mode.screenshot": "Upload Screenshot",
    "scanner.mode.screenshotShort": "Screenshot",
    "scanner.mode.url": "Check URL",
    "scanner.mode.urlShort": "Link",

    "scanner.page.title": "Scam Scanner",
    "scanner.page.description":
      "Paste any suspicious message or link below. An AI analyst working with our rule-based engine checks it for Philippine scam patterns: impersonation, urgency pressure, pay-to-claim fees, phishing links, and more.",
    "screenshot.page.title": "Screenshot Scanner",
    "screenshot.page.description":
      "Upload a screenshot of the suspicious SMS, chat, or email instead of typing it out. We extract the text with OCR and run the same scam analysis on it.",
    "url.page.title": "Link Checker",
    "url.page.description":
      "Paste a suspicious link below. We break down the address itself (protocol, domain, impersonation tricks) without ever visiting it.",

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
      "This assessment inspects the address itself: patterns, structure, and (if configured) reputation databases. The link is never visited by our servers, and page content can't be seen, so a clean result is not a guarantee of safety.",

    "screenshot.privacy.title": "Before you upload: privacy notes",
    "screenshot.privacy.sensitive.title":
      "Screenshots can contain sensitive details",
    "screenshot.privacy.sensitive.body":
      "Names, phone numbers, chat photos, balances: anything visible in the capture is readable text to our analyzer. Crop out anything you don't need checked before uploading.",
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
      "The link is parsed as text on our server; we never visit it, resolve it, or render it, so checking is completely safe.",
    "url.note.reputation.title": "Reputation-aware.",
    "url.note.reputation.body":
      "Where a reputation service is configured, results are cross-checked against known phishing and malware databases.",
    "url.note.fairScoring.title": "Fair scoring.",
    "url.note.fairScoring.body":
      "A single weak signal (like a shortened link) never labels an address dangerous on its own; verdicts require multiple independent or strong indicators.",

    "input.label": "Suspicious message or link",
    "input.placeholder":
      "Paste the SMS, email, chat message, or link you want to check…",
    "input.keyboardHint": "Press Control plus Enter to run the analysis.",
    "input.clear": "Clear",
    "input.analyze": "Analyze Message",
    "input.exampleLead": "No message handy? Load a real-world example:",
    "input.moreExamples": "More examples",
    "input.fewerExamples": "Fewer examples",
    "input.emptyHint": "Not sure what to scan? Try an example below.",
    "input.emptyTitle": "Nothing to analyze yet",
    "input.emptyBody":
      "Paste a suspicious SMS, email, chat message, or link above, or tap one of the example scams to see how Sift breaks down a threat.",

    "report.scannedWith": "Scanned with",
    "report.whatThisMeans": "What this means",
    "report.redFlags": "Red flags found",
    "report.redFlagsEmpty":
      "Nothing in this message was identified as a red flag. Review the sender carefully anyway; new scams appear all the time.",
    "report.foundInMessage": "Found in your message",
    "report.howScoreCalculated": "How the score was calculated",
    "report.breakdownNone":
      "No points were added because nothing suspicious matched.",
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
      "Text recovered with OCR; minor misreads are possible. The analysis above is based on this extracted content.",
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
      "This report was produced by an AI analyst working alongside our rule-based engine. AI can misjudge unusual wording, so treat it as guidance, not a verdict, and independently verify important information through official channels.",
    "report.disclaimer.rules":
      "This result comes from Sift's transparent rule-based engine (pattern matching, not AI). Rules can miss new tactics or flag unusual wording. Treat it as guidance and verify through official channels before acting.",

    "risk.low": "Low Risk",
    "risk.medium": "Moderate Risk",
    "risk.high": "High Risk",
    "risk.critical": "Critical",

    "a11y.skipToContent": "Skip to main content",

    "hero.badge": "Free to use · No sign-up required",
    "hero.title.pre": "Think it's a scam?",
    "hero.title.highlight": "Let Sift check.",
    "hero.subhead":
      "AI-assisted scam risk assessment built to help Filipinos evaluate suspicious messages, links, and online threats.",
    "hero.cta.scan": "Scan Something Suspicious",
    "hero.cta.how": "How It Works",
    "hero.check.builtForPh": "Built for Philippine scam patterns",
    "hero.check.plainLanguage": "Explains red flags in plain language",
    "hero.check.free": "Free to use, no account required",
    "hero.sample.reportLabel": "Analysis Report",
    "hero.sample.category": "Category",
    "hero.sample.categoryValue": "Fake Prize / Lottery (SMS)",
    "hero.sample.evidence": "Evidence",
    "hero.sample.recommended": "Recommended:",
    "hero.sample.recommendedBody":
      "Do not reply and do not pay any fee. Block the number, then report the message to your telco and the NTC.",
    "hero.sample.note": "Sample output; run your own scan on the",
    "hero.sample.noteLink": "scanner page",

    "footer.tagline":
      "AI-assisted scam risk assessment built to help Filipinos evaluate suspicious messages, links, and online threats, with clear explanations rather than just labels.",
    "footer.product": "Product",
    "footer.resources": "Resources",
    "footer.link.scanner": "Scam Scanner",
    "footer.link.screenshot": "Screenshot Scanner",
    "footer.link.library": "Scam Library",
    "footer.link.scanTypes": "Supported Scan Types",
    "footer.link.howItWorks": "How It Works",
    "footer.link.about": "About Sift",
    "footer.link.examples": "Common PH Scam Patterns",
    "footer.link.privacy": "Privacy Principles",
    "footer.disclaimer":
      "Sift is an independent educational tool. It is not affiliated with, endorsed by, or connected to GCash, Maya, any bank, Shopee, Lazada, LBC, J&T Express, Grab, or any government agency mentioned in examples or sample content. Brand names appear only to illustrate impersonation tactics commonly used by scammers. Analysis output is informational only and is not legal, financial, or security advice.",
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
    "auth.networkError": "Network error. Check your connection and try again.",
    "auth.signin.title": "Welcome back",
    "auth.signin.body": "Sign in to open your private scan history.",
    "auth.signup.title": "Create your account",
    "auth.signup.body":
      "Free, no personal details beyond an email; scans made while signed in are saved to your private history.",
  },

  fil: {
    "progress.text.title": "Sinusuri ang iyong message",
    "progress.text.body":
      "Hinahanap ang mga babala. Lalabas dito ang resulta at mga susunod na hakbang.",
    "progress.screenshot.title": "Binabasa ang iyong screenshot",
    "progress.screenshot.body":
      "Kinukuha at sinusuri ang text para sa mga babala. Maaaring mas matagal ang malalaking larawan.",
    "progress.url.title": "Sinusuri ang link",
    "progress.url.body":
      "Sinusuri ang address nang hindi binubuksan ang link. Lalabas dito ang resulta.",
    "progress.cancel": "Kanselahin ang pagsusuri",
    "input.historyNotice":
      "Naka-save sa pribadong history mo ang mga scan kapag naka-sign in.",
    "history.storage.saved":
      "Pribado sa iyong account ang mga naka-save na scan.",
    "history.storage.local":
      "Lokal na mode: nasa server na ito ang history at nabubura kapag nag-restart ito.",
    "history.reportUnavailable":
      "Wala na ang buong report ng scan na ito. Suriin ulit para gumawa ng bagong report.",
    "nav.signOutFailed": "Hindi nakapag-sign out. Subukan ulit.",

    "theme.nightMode": "Mode sa gabi",
    "theme.switchLight": "Lumipat sa mode sa araw",
    "theme.switchDark": "Lumipat sa mode sa gabi",
    "theme.on": "Bukas",
    "theme.off": "Patay",
    "nav.signOut": "Mag-sign out",
    "nav.signingOut": "Nagsa-sign out...",
    "nav.communityReports": "Mga ulat ng komunidad",
    "nav.myHistory": "Aking history",
    "nav.scamInsights": "Mga pag-aaral sa scam",
    "nav.mainNavigation": "Pangunahing nabigasyon",
    "nav.mobileNavigation": "Nabigasyon sa mobile",
    "nav.openMenu": "Buksan ang menu",
    "nav.guestHint": "Libreng pag-scan. Hindi kailangang mag-sign up.",
    "nav.saveHistoryHint":
      "Mag-sign in para i-save at balikan ang iyong mga scan.",
    "auth.createToSave":
      "Gumawa ng account para i-save ang iyong scan history.",

    "risk.meter.label": "Antas ng panganib",
    "risk.meter.low": "Mababa",
    "risk.meter.medium": "Katamtaman",
    "risk.meter.high": "Mataas",
    "risk.meter.critical": "Kritikal",
    "home.walkthrough.steps": "Tuklasin ang tatlong hakbang",
    "home.walkthrough.label": "Halimbawa ng pagsusuri",
    "home.walkthrough.received": "Una, basahin ang message.",
    "home.walkthrough.evidence": "Tatlong dahilan para huminto muna.",
    "home.walkthrough.action": "May mas ligtas na pagpipilian.",
    "home.walkthrough.fee": "May processing fee bago makuha ang premyo.",
    "home.walkthrough.identity":
      "Hinihingi ang iyong pangalan, address, at kaarawan.",
    "home.walkthrough.deadline": "May 24 na oras na deadline para madaliin ka.",
    "home.walkthrough.advice":
      "Huwag magbayad o magpadala ng personal na detalye. I-verify ang alok sa opisyal na website o app ng organisasyon gamit ang address na ikaw mismo ang naghanap.",
    "home.walkthrough.next": "Susunod na hakbang",
    "home.walkthrough.again": "Magsimula ulit",

    "library.title": "Kilalanin ang modus.",
    "library.body":
      "Gabay sa mga karaniwang scam sa Pilipinas. Pumili ng kategorya upang matutunan ang mga babala, suriin ang halimbawa, at malaman ang mas ligtas na hakbang.",
    "library.signs": "Mga dapat bantayan",
    "library.sample": "Halimbawang message",

    "home.hero.title": "Suriin muna. Mas ligtas ang susunod na hakbang.",
    "home.hero.body":
      "Kakaibang text. Apurahang pakiusap. Link na kahina-hinala. I-check sa Sift bago mag-click, magbayad, o sumagot.",
    "home.checkMessage": "Suriin ang message",
    "home.checkScreenshot": "Suriin ang screenshot",
    "home.hero.note": "Libreng pag-scan. Hindi kailangang mag-sign up.",
    "home.sample.label": "Masusing pagtingin",
    "home.sample.example": "Halimbawang mensahe",
    "home.sample.choose": "Pumili ng halimbawang message",
    "home.sample.prize": "Alok na premyo",
    "home.sample.wallet": "Abiso sa wallet",
    "home.sample.otp": "Hiling na OTP",
    "home.sample.risk": "Antas ng panganib",
    "home.sample.next":
      "Huwag munang sumagot. I-verify ang message sa opisyal na app o website ng organisasyon.",
    "home.sample.try": "Tingnan ang buong pagsusuri",
    "home.tool.text": "Mga message",
    "home.tool.textBody": "SMS, email, Messenger, at iba pang kinopyang text.",
    "home.tool.image": "Mga screenshot",
    "home.tool.imageBody":
      "Mag-upload ng larawan. Babasahin ng Sift ang message.",
    "home.tool.link": "Mga link",
    "home.tool.linkBody":
      "Suriin ang kahina-hinalang address nang hindi binubuksan.",
    "home.how.title": "Alamin kung ano ang kahina-hinala. At kung bakit.",
    "home.how.body":
      "Mas kapaki-pakinabang ang babala kapag nauunawaan mo ito. Sinusuri ng Sift ang mga karaniwang scam sa Pilipinas at ipinapaliwanag ang resulta.",
    "home.step.paste": "Ilagay ang message",
    "home.step.pasteBody":
      "I-paste ang text, mag-upload ng screenshot, o magsuri ng link. Hindi kailangan ng account.",
    "home.step.look": "Suriin ang ebidensya",
    "home.step.lookBody":
      "Tingnan ang mga pakiusap, link, at pamimilit na nakaapekto sa pagsusuri ng panganib.",
    "home.step.act": "Pumili ng mas ligtas na hakbang",
    "home.step.actBody":
      "Alamin kung ano ang dapat iwasan at kung paano mag-verify sa mga opisyal na channel.",
    "home.examples.title": "Pamilyar na message. Paulit-ulit na modus.",
    "home.examples.body":
      "Nagbabago ang salita, pero madalas pareho ang taktika. Kilalanin ang mga puwedeng dumating sa iyong inbox.",
    "home.examples.all": "Tingnan ang scam library",
    "home.examples.inspect": "Suriin ang halimbawang ito",
    "home.examples.note":
      "Ginawang muli ang mga halimbawa para sa edukasyon. Hindi ito tunay na message o pag-endorso sa mga nabanggit na brand.",
    "home.privacy.title":
      "Karapat-dapat sa malinaw na paliwanag ang tiwala mo.",
    "home.privacy.body":
      "Ang Sift ay malayang kasangkapang pang-edukasyon para sa mga Pilipino. Tumutulong ito sa pagsusuri; hindi nito ginagarantiyang ligtas ang sender o alok.",
    "home.privacy.account": "Magsimula nang walang account",
    "home.privacy.accountBody":
      "Bukas sa lahat ang scanner. Mag-sign in kung gusto mong itago ang mga scan sa pribadong history mo.",
    "home.privacy.data": "Alamin kung ano ang naka-save",
    "home.privacy.dataBody":
      "Naka-save sa account history ang mga scan kapag naka-sign in. Iwasang magsama ng password, OTP, o buong account number sa isusumite.",
    "home.privacy.explain": "Ebidensyang masusuri mo",
    "home.privacy.explainBody":
      "Basahin kung ano ang na-flag at kung bakit. I-verify ang mahahalagang pakiusap sa opisyal na channel.",
    "home.cta.title": "May kahina-hinala sa inbox mo?",
    "home.cta.body": "Maglaan ng sandali upang suriin bago kumilos.",
    "nav.scanNow": "Suriin ang message",
    "footer.note": "Malayang gabay para sa mas ligtas na hakbang.",
    "auth.aside.title": "Mas malinaw. Sa bawat pagsusuri.",
    "auth.aside.body":
      "Itago ang scan history sa isang lugar, balikan ang ebidensya, at kilalanin ang mga modus sa susunod.",
    "auth.aside.note": "Laging magagamit ang scanner kahit walang account.",

    "nav.home": "Home",
    "nav.scanner": "Scanner",
    "nav.scamLibrary": "Scam Library",
    "nav.reports": "Mga Report",
    "nav.more": "More",
    "nav.scamIntelligence": "Scam Intelligence",
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
    "scanner.mode.text": "I-paste ang Text",
    "scanner.mode.textShort": "Text",
    "scanner.mode.screenshot": "Mag-upload ng Screenshot",
    "scanner.mode.screenshotShort": "Screenshot",
    "scanner.mode.url": "I-check ang Link",
    "scanner.mode.urlShort": "Link",
    "scanner.aria.modeTabs": "Paraan ng pag-scan",

    "scanner.page.title": "Scam Scanner",
    "scanner.page.description":
      'I-paste ang kahina-hinalang message o link sa ibaba. Titingnan ito ng AI analyst kasama ang aming rule-based engine para sa mga scam na karaniwan sa Pilipinas: panlilinlang na kunwari company o ahensya ng gobyerno, panggigipit na "kailangan ngayon", bayad bago makuhang premyo, at peke o mapanlinlang na link.',
    "screenshot.page.title": "Screenshot Scanner",
    "screenshot.page.description":
      "Mag-upload ng screenshot ng kahina-hinalang SMS, chat, o email para hindi mo na kailangang i-type. Kukunin namin ang teksto gamit ang OCR at sasuriin gamit ang parehong scam analysis.",
    "url.page.title": "Link Checker",
    "url.page.description":
      "I-paste ang kahina-hinalang link sa ibaba. Susuriin namin ang mismong address (protocol, domain, at mga pandarayang ginagaya ang totoong brand) nang hindi binibisita ang link.",

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
      "Ang pagsusuring ito ay sa mismong address: pattern, istruktura, at (kung naka-set up) reputation databases. Hindi kailanman binibisita ng aming server ang link, at hindi namin nakikita ang laman ng page, kaya ang malinis na resulta ay hindi garantiya na ligtas.",

    "screenshot.privacy.title": "Bago mag-upload: mga paalala sa privacy",
    "screenshot.privacy.sensitive.title":
      "Maaaring may sensitibong detalye ang screenshot",
    "screenshot.privacy.sensitive.body":
      "Pangalan, numero ng telepono, chat photos, balance: lahat ng nakikita sa capture ay nababasang teksto para sa aming analyzer. I-crop muna ang mga hindi mo kailangang ipa-check bago mag-upload.",
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
      "Ang link ay binabasa bilang teksto sa aming server; hindi namin ito binibisita, rina-resolve, o rina-render, kaya lubos na ligtas ang pag-check.",
    "url.note.reputation.title": "Naka-check sa reputation.",
    "url.note.reputation.body":
      "Kung may naka-set up na reputation service, kinukumpara ang resulta sa mga kilalang phishing at malware database.",
    "url.note.fairScoring.title": "Patas na scoring.",
    "url.note.fairScoring.body":
      "Isang mahinang signal lang (tulad ng shortened link) ay hindi sapat para tawaging mapanganib ang address, dahil kailangan ng maraming malalakas o magkakahiwalay na indikasyon.",

    "input.label": "Kahina-hinalang message o link",
    "input.placeholder":
      "I-paste ang SMS, email, chat message, o link na gusto mong ipa-check…",
    "input.keyboardHint":
      "Pindutin ang Control katabi ng Enter para simulan ang pagsusuri.",
    "input.clear": "Burahin",
    "input.analyze": "Suriin ang Message",
    "input.exampleLead":
      "Walang maisamaing message? Subukan ang mga tunay na halimbawa:",
    "input.moreExamples": "Iba pang halimbawa",
    "input.fewerExamples": "Mas kaunting halimbawa",
    "input.emptyHint":
      "Hindi sigurado kung ano ang susuriin? Subukan ang isang halimbawa sa ibaba.",
    "input.emptyTitle": "Wala pang sasuriin",
    "input.emptyBody":
      "I-paste ang kahina-hinalang SMS, email, chat message, o link sa itaas, o pindutin ang isa sa mga halimbawang scam para makita kung paano sinusuri ng Sift ang isang banta.",

    "report.scannedWith": "Sinuri gamit ang",
    "report.whatThisMeans": "Ano ang ibig sabihin nito",
    "report.redFlags": "Mga pulang bandila na nakita",
    "report.redFlagsEmpty":
      "Walang nakitang red flag sa message na ito. Pero mag-ingat pa rin sa sender, laging may bagong modus ang mga scammer.",
    "report.foundInMessage": "Makikita sa message mo",
    "report.howScoreCalculated": "Paano nabuo ang score",
    "report.breakdownNone":
      "Walang nadagdag na puntos dahil walang tumugma na kahina-hinalaan.",
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
      "Nakuha ang tekstong ito gamit ang OCR, pero maaaring may maliit na pagkakamali sa pagbasa. Batay sa nilalaman na ito ang pagsusuri sa itaas.",
    "report.highlightNote":
      "Ang mga naka-highlight na bahagi ang tumugma sa mga red flag sa itaas.",
    "report.engineConfidence": "Kumpiyansa ng engine",
    "report.flagsFound": "pulang bandila na nakita",
    "report.flag": "pulang bandila",
    "report.engineAi": "Pinag-krus ng rule engine ang judgment ng AI",
    "report.engineRules": "Rule-based engine",
    "report.fromScreenshot": "Galing sa screenshot",
    "report.chip.ai": "AI analysis",
    "report.chip.rules": "Rule-based engine",
    "report.disclaimer.ai":
      "Ang report na ito ay gawa ng AI analyst na katulong ng aming rule-based engine. Maaaring magkamali ang AI sa pambihirang phrasing, kaya ituring itong gabay, hindi hatol, at i-verify ang mahahalagang impormasyon sa opisyal na channel.",
    "report.disclaimer.rules":
      "Ang resulta na ito ay galing sa transparent na rule-based engine ng Sift (pattern matching, hindi AI). Maaaring makalusot ang bagong modus o maflag ang pambihirang phrasing. Ituring na gabay at i-verify muna sa opisyal na channel bago kumilos.",

    "risk.low": "Mababang Panganib",
    "risk.medium": "Katamtamang Panganib",
    "risk.high": "Mataas na Panganib",
    "risk.critical": "Kritikal",

    "a11y.skipToContent": "Laktawan ang pangunahing nilalaman",

    "hero.badge": "Libreng gamitin · Walang kailangang sign-up",
    "hero.title.pre": "Mukhang scam?",
    "hero.title.highlight": "Ipa-check sa Sift.",
    "hero.subhead":
      "AI-assisted na risk assessment para matulungan ang mga Pilipino na tasahin ang kahina-hinalang messages, links, at online threats.",
    "hero.cta.scan": "Mag-scan ng Kahina-hinala",
    "hero.cta.how": "Paano Ito Gumagana",
    "hero.check.builtForPh":
      "Ginawa para sa mga scam na karaniwan sa Pilipinas",
    "hero.check.plainLanguage": "Ipinapaliwanag ang mga red flag nang malinaw",
    "hero.check.free": "Libre, walang kailangang account",
    "hero.sample.reportLabel": "Ulat ng Pagsusuri",
    "hero.sample.category": "Kategorya",
    "hero.sample.categoryValue": "Peke na Premyo / Lottery (SMS)",
    "hero.sample.evidence": "Ebidensya",
    "hero.sample.recommended": "Rekomendasyon:",
    "hero.sample.recommendedBody":
      "Huwag sumagot at huwag magbayad ng anumang fee. I-block ang numero, tapos i-report ang message sa telco mo at sa NTC.",
    "hero.sample.note": "Halimbawang output; sumuri ng sarili mong message sa",
    "hero.sample.noteLink": "scanner page",

    "footer.tagline":
      "AI-assisted na risk assessment para matulungan ang mga Pilipino na tasahin ang kahina-hinalang messages, links, at online threats, may malinaw na paliwanag at hindi lang mga label.",
    "footer.product": "Produkto",
    "footer.resources": "Mga Resource",
    "footer.link.scanner": "Scam Scanner",
    "footer.link.screenshot": "Screenshot Scanner",
    "footer.link.library": "Scam Library",
    "footer.link.scanTypes": "Mga Sinusuportahang Uri ng Scan",
    "footer.link.howItWorks": "Paano Ito Gumagana",
    "footer.link.about": "Tungkol sa Sift",
    "footer.link.examples": "Mga Karaniwang Scam sa Pilipinas",
    "footer.link.privacy": "Mga Prinsipyo sa Privacy",
    "footer.disclaimer":
      "Ang Sift ay isang independenteng educational tool. Hindi ito kaakibat, inendorso, o konektado sa GCash, Maya, kahit anong bangko, Shopee, Lazada, LBC, J&T Express, Grab, o kahit anong ahensya ng gobyerno na binabanggit sa mga halimbawa o sample content. Ang mga brand name ay lumilitaw lamang para ipakita ang mga modus ng pagpapanggap na karaniwang ginagamit ng mga scammer. Ang output ng pagsusuri ay para sa impormasyon lamang at hindi legal, pinansyal, o security advice.",
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
    "auth.networkError":
      "Error sa network. Tingnan ang koneksyon mo at subukan muli.",
    "auth.signin.title": "Maligayang pagbabalik",
    "auth.signin.body":
      "Mag-sign in para buksan ang pribado mong scan history.",
    "auth.signup.title": "Gumawa ng account",
    "auth.signup.body":
      "Libre, walang personal na detalye bukod sa email; ang mga scan mo habang naka-sign in ay nase-save sa pribado mong history.",
  },
} satisfies Record<Lang, Record<string, string>>;

export type DictKey = keyof (typeof DICT)["en"];

export function t(lang: Lang, key: DictKey): string {
  return DICT[lang][key] ?? DICT.en[key];
}
