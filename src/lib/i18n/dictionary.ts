import type { Lang } from "./config";

export const DICT = {
  en: {
    "report.complete": "Scan complete",
    "scan.error.title": "Scan didn’t finish",
    "scan.error.body": "We couldn’t complete your scan. Please check your connection and try again.",
    "scan.retry": "Try Again",
    "scan.reset": "Start Over",
    "url.input.label": "Link you want checked",
    "url.input.enter": "Press Enter to run the analysis.",
    "url.input.analyze": "Analyze URL",
    "url.input.examples": "No link handy? Load a typical scam-link example:",
    "image.upload": "Upload a screenshot by clicking or dropping a file",
    "image.drop": "Drop your screenshot here",
    "image.drag": "Drag & drop a screenshot here",
    "image.browse": "or click to browse your files",
    "image.preview": "Screenshot preview of the message you want analyzed",
    "image.remove": "Remove image",
    "image.replace": "Replace",
    "image.analyze": "Analyze Screenshot",
    "image.choose": "Choose a screenshot file",
    "image.different": "Choose a Different Image",
    "image.how": "How it works",
    "image.howBody": "Take a screenshot of the suspicious message, drop it above, and we extract the text with OCR before running the full scam analysis: same engine, same explainable report.",
    "image.error.missing_file": "Choose a screenshot to analyze first.",
    "image.error.too_large": "That image is too large. Please upload a screenshot of 5 MB or less.",
    "image.error.empty_file": "That file appears to be empty or corrupted. Please try a different screenshot.",
    "image.error.unsupported_type": "Unsupported file type. Please upload a PNG, JPG, or WebP image.",
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
    "report.complete": "Tapos na ang pag-check",
    "scan.error.title": "Hindi natuloy ang pag-check",
    "scan.error.body": "Hindi natuloy ang pag-check. Tingnan ang internet mo at subukan ulit.",
    "scan.retry": "Subukan ulit",
    "scan.reset": "Magsimula ulit",
    "url.input.label": "Link na gusto mong ipa-check",
    "url.input.enter": "Pindutin ang Enter para mag-check.",
    "url.input.analyze": "I-check ang link",
    "url.input.examples": "Gusto mo munang subukan? Pumili ng halimbawa:",
    "image.upload": "Pumili o mag-drag ng screenshot dito",
    "image.drop": "Bitawan dito ang screenshot",
    "image.drag": "I-drag dito ang screenshot",
    "image.browse": "O pindutin dito para pumili ng larawan",
    "image.preview": "Screenshot na gusto mong ipa-check",
    "image.remove": "Alisin ang larawan",
    "image.replace": "Palitan",
    "image.analyze": "I-check ang screenshot",
    "image.choose": "Pumili ng screenshot",
    "image.different": "Pumili ng ibang larawan",
    "image.how": "Paano ito gumagana?",
    "image.howBody": "Kunan ng screenshot ang mensahe at i-upload dito. Babasahin muna ng Sift ang text, saka titingnan kung may palatandaan ng scam.",
    "image.error.missing_file": "Pumili muna ng screenshot na ipa-check.",
    "image.error.too_large": "Masyadong malaki ang larawan. Pumili ng screenshot na hanggang 5 MB lang.",
    "image.error.empty_file": "Hindi mabasa ang file. Subukan ang ibang screenshot.",
    "image.error.unsupported_type": "PNG, JPG, JPEG, o WebP lang ang puwedeng i-upload.",
    "progress.text.title": "Tinitingnan ang mensahe mo",
    "progress.text.body":
      "Hinahanap ang mga posibleng palatandaan ng scam. Dito lalabas ang resulta at mga puwede mong gawin.",
    "progress.screenshot.title": "Binabasa ang screenshot mo",
    "progress.screenshot.body":
      "Kinukuha muna ang text bago i-check ang mensahe. Mas malaking larawan, mas matagal basahin.",
    "progress.url.title": "Tinitingnan ang link",
    "progress.url.body":
      "Tinitingnan ang address, pero hindi binubuksan ang website. Dito lalabas ang resulta.",
    "progress.cancel": "Kanselahin",
    "input.historyNotice":
      "Kapag naka-sign in ka, mase-save sa pribadong history mo ang mga resulta.",
    "history.storage.saved":
      "Ikaw lang ang makakakita ng mga naka-save mong resulta.",
    "history.storage.local":
      "Pansamantala lang ang history sa server na ito. Mabubura ito kapag nag-restart ang server.",
    "history.reportUnavailable":
      "Hindi na mabuksan ang buong resulta. I-check ulit ang mensahe para makakuha ng bago.",
    "nav.signOutFailed": "Hindi ka na-sign out. Subukan ulit.",

    "theme.nightMode": "Madilim na tema",
    "theme.switchLight": "Gamitin ang maliwanag na tema",
    "theme.switchDark": "Gamitin ang madilim na tema",
    "theme.on": "Naka-on",
    "theme.off": "Naka-off",
    "nav.signOut": "Mag-sign out",
    "nav.signingOut": "Sandali, nagsa-sign out…",
    "nav.communityReports": "Mga naiulat na scam",
    "nav.myHistory": "Mga nasuri mo",
    "nav.scamInsights": "Datos tungkol sa scam",
    "nav.mainNavigation": "Pangunahing menu",
    "nav.mobileNavigation": "Menu sa mobile",
    "nav.openMenu": "Buksan ang menu",
    "nav.guestHint": "Libre ang pag-check. Kahit walang account.",
    "nav.saveHistoryHint":
      "Mag-sign in para ma-save at mabalikan mo ang mga resulta.",
    "auth.createToSave":
      "Gumawa ng account para ma-save mo ang mga resulta.",

    "risk.meter.label": "Antas ng panganib",
    "risk.meter.low": "Mababa",
    "risk.meter.medium": "Katamtaman",
    "risk.meter.high": "Mataas",
    "risk.meter.critical": "Napakataas",
    "home.walkthrough.steps": "Tingnan kung paano mag-check",
    "home.walkthrough.label": "Ganito sinusuri ang isang mensahe",
    "home.walkthrough.received": "Basahin muna ang mensahe.",
    "home.walkthrough.evidence": "Ito ang tatlong kahina-hinalang bahagi.",
    "home.walkthrough.action": "Bago kumilos, alamin ang puwedeng gawin.",
    "home.walkthrough.fee": "May bayad muna bago makuha ang premyo.",
    "home.walkthrough.identity":
      "Hinihingi ang pangalan, address, at kaarawan mo.",
    "home.walkthrough.deadline": "May 24 oras lang daw para mag-claim, kaya kailangan mong magmadali.",
    "home.walkthrough.advice":
      "Huwag munang magbayad o magbigay ng personal na detalye. Hanapin mo mismo ang opisyal na app o website ng organisasyon at doon magtanong.",
    "home.walkthrough.next": "Ituloy",
    "home.walkthrough.again": "Tingnan ulit",

    "library.title": "Kilalanin ang mga modus.",
    "library.body":
      "Ano ang itsura ng karaniwang scam? Pumili ng uri sa ibaba para makita ang halimbawa, mga dapat bantayan, at puwedeng gawin.",
    "library.signs": "Mga dapat bantayan",
    "library.sample": "Halimbawang mensahe",

    "home.hero.title": "May duda? I‑check muna.",
    "home.hero.body":
      "Nanalo ka raw sa raffle? May naniningil sa text? O may link na hindi mo kilala? Ipa-check sa Sift bago mag-click, magbayad, o sumagot.",
    "home.checkMessage": "I-check ang mensahe",
    "home.checkScreenshot": "I-check ang screenshot",
    "home.hero.note": "Libre ang pag-check. Kahit walang account.",
    "home.sample.label": "Tingnan natin ang isang halimbawa",
    "home.sample.example": "Halimbawa lang ito",
    "home.sample.choose": "Pumili ng halimbawa",
    "home.sample.prize": "Nanalo ka raw",
    "home.sample.wallet": "Abiso sa e-wallet",
    "home.sample.otp": "Hinihingi ang OTP",
    "home.sample.risk": "Antas ng panganib",
    "home.sample.next":
      "Huwag munang sumagot. Buksan mo mismo ang opisyal na app o website para makasiguro.",
    "home.sample.try": "Bakit ito kahina-hinala?",
    "home.tool.text": "Mensahe",
    "home.tool.textBody": "I-paste ang text mula sa SMS, email, o chat.",
    "home.tool.image": "Screenshot",
    "home.tool.imageBody":
      "I-upload ang larawan at babasahin ng Sift ang mensahe.",
    "home.tool.link": "Link",
    "home.tool.linkBody":
      "I-check ang address nang hindi binubuksan ang website.",
    "home.how.title": "Hindi lang basta “scam.” Alamin kung bakit.",
    "home.how.body":
      "Mas madaling mag-ingat kapag alam mo ang dapat bantayan. Ipinapakita ng Sift kung aling bahagi ng mensahe ang kahina-hinala at kung bakit.",
    "home.step.paste": "Ilagay ang gusto mong ipa-check",
    "home.step.pasteBody":
      "Puwedeng text, screenshot, o link. Hindi mo kailangang gumawa ng account.",
    "home.step.look": "Tingnan kung ano ang kahina-hinala",
    "home.step.lookBody":
      "Alamin kung may hinihinging pera, kahina-hinalang link, o panggigipit na kumilos agad.",
    "home.step.act": "Alamin ang puwede mong gawin",
    "home.step.actBody":
      "May malinaw na payo kung ano ang iiwasan at paano makakasiguro bago kumilos.",
    "home.examples.title": "Iba-ibang mensahe. Pare-parehong modus.",
    "home.examples.body":
      "Nag-iiba ang pangalan at kuwento, pero madalas pareho ang panlilinlang. Baka may makilala kang kahawig ng natanggap mo.",
    "home.examples.all": "Kilalanin pa ang ibang scam",
    "home.examples.inspect": "Tingnan ang halimbawang ito",
    "home.examples.note":
      "Mga ginawang halimbawa lang ito para makatulong sa pagkilala ng scam. Hindi ito aktuwal na mensahe o pag-endorso sa mga brand na nabanggit.",
    "home.privacy.title":
      "Alam mo dapat kung paano ito gumagana.",
    "home.privacy.body":
      "Gabay ang Sift sa pagkilala ng scam. Hindi nito mapapatunayang ligtas ang isang nagpadala o alok.",
    "home.privacy.account": "Puwede kahit walang account",
    "home.privacy.accountBody":
      "Mag-check agad ng mensahe. Kung gusto mong ma-save ang mga resulta, mag-sign in.",
    "home.privacy.data": "Alamin kung ano ang nase-save",
    "home.privacy.dataBody":
      "Nase-save sa history mo ang mga resulta kapag naka-sign in ka. Alisin muna ang password, OTP, at buong account number bago magpadala.",
    "home.privacy.explain": "May paliwanag ang bawat babala",
    "home.privacy.explainBody":
      "Makikita mo kung ano ang kahina-hinala at kung bakit. Kung may pera o account na nakataya, magtanong muna sa opisyal na app o website.",
    "home.cta.title": "May mensahe kang pinagdududahan?",
    "home.cta.body": "I-check muna bago maniwala, magbayad, o magbigay ng detalye.",
    "nav.scanNow": "I-check ang mensahe",
    "footer.note": "Gabay para makaiwas sa scam.",
    "auth.aside.title": "Balikan ang resulta. Kilalanin ang modus.",
    "auth.aside.body":
      "Nasa isang lugar ang mga nasuri mo. Madali mong mababalikan ang mga babala at maikukumpara sa susunod na mensahe.",
    "auth.aside.note": "Puwede ka pa ring mag-check kahit walang account.",

    "nav.home": "Home",
    "nav.scanner": "Scanner",
    "nav.scamLibrary": "Mga uri ng scam",
    "nav.reports": "Mga naiulat",
    "nav.more": "Iba pa",
    "nav.scamIntelligence": "Datos tungkol sa scam",
    "nav.about": "Tungkol sa Sift",
    "nav.history": "Mga nasuri mo",
    "nav.settings": "Settings",
    "nav.account": "Account",
    "nav.signIn": "Mag-sign in",
    "nav.signUp": "Gumawa ng account",
    "nav.language": "Wika",

    "scanner.tab.message": "Mensahe",
    "scanner.tab.screenshot": "Screenshot",
    "scanner.tab.url": "Link",
    "scanner.mode.text": "I-paste ang mensahe",
    "scanner.mode.textShort": "Mensahe",
    "scanner.mode.screenshot": "Mag-upload ng screenshot",
    "scanner.mode.screenshotShort": "Screenshot",
    "scanner.mode.url": "I-check ang link",
    "scanner.mode.urlShort": "Link",
    "scanner.aria.modeTabs": "Piliin ang ipa-check",

    "scanner.page.title": "Scam ba ang mensahe?",
    "scanner.page.description":
      "I-paste ang natanggap mong text, email, o chat. Tutulungan ka ng Sift na makita ang mga kahina-hinalang bahagi at malaman kung ano ang puwede mong gawin.",
    "screenshot.page.title": "May screenshot ka ng mensahe?",
    "screenshot.page.description":
      "I-upload dito para hindi mo na kailangang i-type. Babasahin ng Sift ang text at titingnan kung may palatandaan ng scam.",
    "url.page.title": "Kahina-hinala ba ang link?",
    "url.page.description":
      "I-paste ang link dito. Titingnan ng Sift ang address at kung may ginagayang pangalan ng brand, pero hindi nito bubuksan ang website.",

    "url.severity.critical": "Kritikal",
    "url.severity.high": "Malaking babala",
    "url.severity.medium": "Dapat pag-ingatan",
    "url.severity.low": "Maliit na babala",
    "url.severity.info": "Karagdagang detalye",
    "url.verdict.no-signals": "Walang nakitang kahina-hinala sa address",
    "url.verdict.caution": "May dapat kang bantayan",
    "url.verdict.suspicious": "Kahina-hinalang link",
    "url.verdict.dangerous": "Mapanganib na link",
    "url.verdict.blocked": "Hindi web address",
    "url.signalsFound": "palatandaang nakita",
    "url.signalFound": "palatandaang nakita",
    "url.signalsStrong": "malakas na babala",
    "url.neverVisited": "Hindi binuksan ang website habang sinusuri",
    "url.addressBreakdown": "Mga bahagi ng link",
    "url.protocol": "Protocol",
    "url.domain": "Domain",
    "url.hostname": "Hostname",
    "url.subdomains": "Mga subdomain",
    "url.path": "Path",
    "url.queryParams": "Mga dagdag na detalye sa link",
    "url.paramsNone": "Wala",
    "url.paramCount": "dagdag na detalye",
    "url.paramCountPlural": "dagdag na detalye",
    "url.showParams": "Tingnan ang eksaktong detalye",
    "url.hideParams": "Itago ang detalye",
    "url.securitySignals": "Mga dapat bantayan",
    "url.noSignalsBody":
      "Walang nakitang kahina-hinala sa address. Hindi nito ibig sabihing ligtas na ang laman ng website.",
    "url.impersonationTitle": "May ginagayang brand?",
    "url.imitates": "Mukhang ginagaya ng address ang",
    "url.officialDomain": "Opisyal na domain:",
    "url.checkAnother": "I-check ang ibang link",
    "url.disclaimer":
      "Address lang ang tinitingnan dito, kasama ang mga kilalang banta kung may reputation service. Hindi binubuksan ang website o binabasa ang laman nito. Kahit walang makitang babala, kailangan mo pa ring mag-ingat.",

    "screenshot.privacy.title": "Bago ka mag-upload",
    "screenshot.privacy.sensitive.title":
      "Tingnan muna kung ano ang nasa screenshot",
    "screenshot.privacy.sensitive.body":
      "Baka kasama ang pangalan, numero, larawan, o balance mo. I-crop o takpan muna ang mga detalyeng hindi kailangang ipa-check.",
    "screenshot.privacy.noStore.title": "Hindi nase-save ang larawan sa scanner",
    "screenshot.privacy.noStore.body":
      "Ginagamit lang ang larawan habang binabasa ang text. Kapag naka-sign in ka, puwedeng ma-save sa history mo ang nakuhang text at resulta.",
    "screenshot.privacy.ocr.title": "Paano binabasa ang screenshot?",
    "screenshot.privacy.ocr.body":
      "Sa server binabasa ang text gamit ang OCR, saka ito sinusuri tulad ng naka-paste na mensahe. Puwedeng umabot nang halos isang minuto ang buong proseso.",
    "screenshot.privacy.rules":
      "PNG, JPG, JPEG, o WebP lang, hanggang 5 MB. Hindi tatanggapin ang ibang uri o mas malaking file.",

    "url.note.zeroClick.title": "Hindi kailangang buksan ang link.",
    "url.note.zeroClick.body":
      "Binabasa lang ng Sift ang address. Hindi nito binubuksan ang website para makita ang laman.",
    "url.note.reputation.title": "May nauna nang babala?",
    "url.note.reputation.body":
      "Kung may reputation service, tinitingnan din kung naiulat na ang link bilang phishing o malware.",
    "url.note.fairScoring.title": "Tinitingnan ang kabuuan.",
    "url.note.fairScoring.body":
      "Hindi agad itinuturing na mapanganib ang link dahil lang pinaikli ito. Isinasaalang-alang ang iba pang palatandaan at kung gaano kabigat ang mga ito.",

    "input.label": "Mensaheng gusto mong ipa-check",
    "input.placeholder":
      "I-paste dito ang natanggap mong SMS, email, o chat…",
    "input.keyboardHint":
      "Tip: Ctrl + Enter para mag-check.",
    "input.clear": "Burahin",
    "input.analyze": "I-check ang mensahe",
    "input.exampleLead":
      "Gusto mo munang subukan? Pumili ng halimbawa:",
    "input.moreExamples": "Ipakita ang iba pang halimbawa",
    "input.fewerExamples": "Bawasan ang mga halimbawa",
    "input.emptyHint":
      "Wala pang mensahe? Puwede kang pumili ng halimbawa sa ibaba.",
    "input.emptyTitle": "Ilagay muna ang mensahe",
    "input.emptyBody":
      "I-paste ang natanggap mo sa itaas, o pumili ng halimbawa para makita kung paano mag-check ang Sift.",

    "report.scannedWith": "Sinuri gamit ang",
    "report.whatThisMeans": "Ano ang ibig sabihin ng resulta?",
    "report.redFlags": "Mga kahina-hinalang palatandaan",
    "report.redFlagsEmpty":
      "Walang nakitang malinaw na palatandaan ng scam. Mag-ingat pa rin, lalo na kung may hinihinging pera o detalye ng account.",
    "report.foundInMessage": "Bahagi ng mensahe mo",
    "report.howScoreCalculated": "Bakit ganito ang score?",
    "report.breakdownNone":
      "Walang nadagdag na puntos dahil walang tumugma sa mga palatandaang hinahanap ng Sift.",
    "report.totalScore": "Kabuuang score",
    "report.pointsNote.ai":
      "Galing sa paunang pag-check ang mga puntos sa itaas. Kasama sa huling score ang mga ito at ang hiwalay na pagsusuri ng AI.",
    "report.pointsNote.rules":
      "May katumbas na puntos ang bawat palatandaan, depende sa bigat nito. Pinagsasama ang mga puntos para makuha ang score na 0–100.",
    "report.whatToDo": "Ano ang puwede mong gawin?",
    "report.analyzeAnother": "I-check ang ibang mensahe",
    "report.analyzeAnotherScreenshot": "I-check ang ibang screenshot",
    "report.copyReport": "Kopyahin ang resulta",
    "report.copied": "Nakopya na",
    "report.originalMessage": "Mensaheng ipinadala mo",
    "report.extractedText": "Text na nabasa sa screenshot",
    "report.characters": "characters",
    "report.ocrNote":
      "Awtomatikong binasa ang text sa screenshot, kaya puwedeng may maling letra o salita. Ito ang text na ginamit sa pag-check.",
    "report.highlightNote":
      "Naka-highlight ang mga bahaging may kaugnayan sa mga babala sa itaas.",
    "report.engineConfidence": "Kumpiyansa sa resulta",
    "report.flagsFound": "palatandaang nakita",
    "report.flag": "palatandaang nakita",
    "report.engineAi": "Sinuri ng AI, kasama ang paunang pag-check",
    "report.engineRules": "Mga kilalang palatandaan lang ang ginamit",
    "report.fromScreenshot": "Mula sa screenshot",
    "report.chip.ai": "Sinuri ng AI",
    "report.chip.rules": "Sinuri nang walang AI",
    "report.disclaimer.ai":
      "Gabay lang ang resultang ito. Sinuri ito ng AI kasama ang paunang pag-check ng Sift, pero puwedeng may mali o hindi napansin. Kung may pera o account na nakataya, magtanong muna sa opisyal na app o website.",
    "report.disclaimer.rules":
      "Mga kilalang palatandaan ng scam ang ginamit dito, hindi AI. Puwedeng may bagong modus na hindi matukoy o totoong mensaheng mapagkamalan. Gamitin itong gabay at magtanong muna sa opisyal na app o website.",

    "risk.low": "Mababang panganib",
    "risk.medium": "Katamtamang panganib",
    "risk.high": "Mataas na panganib",
    "risk.critical": "Napakataas na panganib",

    "a11y.skipToContent": "Pumunta sa pangunahing nilalaman",

    "hero.badge": "Libre · Puwede kahit walang account",
    "hero.title.pre": "May duda ka?",
    "hero.title.highlight": "Ipa-check sa Sift.",
    "hero.subhead":
      "Alamin kung ano ang kahina-hinala sa natanggap mong mensahe o link, at kung ano ang puwede mong gawin.",
    "hero.cta.scan": "I-check ang mensahe",
    "hero.cta.how": "Paano gumagana ang Sift?",
    "hero.check.builtForPh":
      "Para sa mga modus na karaniwan sa Pilipinas",
    "hero.check.plainLanguage": "Malinaw ang paliwanag sa bawat babala",
    "hero.check.free": "Libre, kahit walang account",
    "hero.sample.reportLabel": "Resulta ng pag-check",
    "hero.sample.category": "Kategorya",
    "hero.sample.categoryValue": "Pekeng premyo o raffle (SMS)",
    "hero.sample.evidence": "Ebidensya",
    "hero.sample.recommended": "Puwede mong gawin:",
    "hero.sample.recommendedBody":
      "Huwag sumagot o magbayad. I-block ang numero at i-report ang mensahe sa telco mo at sa NTC.",
    "hero.sample.note": "Halimbawa lang ito. Ipa-check ang natanggap mong mensahe sa",
    "hero.sample.noteLink": "scanner",

    "footer.tagline":
      "Gabay sa pagkilala ng scam. I-check ang mensahe o link, basahin ang paliwanag, at alamin ang puwedeng gawin.",
    "footer.product": "Gamitin ang Sift",
    "footer.resources": "Mga gabay",
    "footer.link.scanner": "Mag-check ng mensahe",
    "footer.link.screenshot": "Mag-check ng screenshot",
    "footer.link.library": "Mga uri ng scam",
    "footer.link.scanTypes": "Mga puwedeng ipa-check",
    "footer.link.howItWorks": "Paano gumagana ang Sift?",
    "footer.link.about": "Tungkol sa Sift",
    "footer.link.examples": "Mga karaniwang scam",
    "footer.link.privacy": "Tungkol sa privacy",
    "footer.disclaimer":
      "Ang Sift ay isang independenteng educational tool. Hindi ito kaakibat, inendorso, o konektado sa GCash, Maya, kahit anong bangko, Shopee, Lazada, LBC, J&T Express, Grab, o kahit anong ahensya ng gobyerno na binabanggit sa mga halimbawa o sample content. Ang mga brand name ay lumilitaw lamang para ipakita ang mga modus ng pagpapanggap na karaniwang ginagamit ng mga scammer. Ang output ng pagsusuri ay para sa impormasyon lamang at hindi legal, pinansyal, o security advice.",
    "footer.copyright": "Nakalaan ang lahat ng karapatan.",
    "auth.displayName": "Pangalan",
    "auth.nameHint": "Opsyonal · Ito ang ipapakita sa account mo",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.passwordHint": "Gumamit ng hindi bababa sa 8 character",
    "auth.signingIn": "Sandali, nagsa-sign in…",
    "auth.creating": "Ginagawa ang account mo…",
    "auth.submitUp": "Gumawa ng account",
    "auth.newHere": "Wala ka pang account?",
    "auth.createLink": "Gumawa ng account",
    "auth.haveAccount": "May account ka na?",
    "auth.genericError": "Hindi natuloy. Subukan ulit.",
    "auth.networkError":
      "Hindi makakonekta. Tingnan ang internet mo at subukan ulit.",
    "auth.signin.title": "Mag-sign in",
    "auth.signin.body":
      "Mag-sign in para balikan ang mga naka-save mong resulta.",
    "auth.signup.title": "Gumawa ng account",
    "auth.signup.body":
      "Gumawa ng libreng account gamit ang email at password mo. Kapag naka-sign in ka, mase-save sa pribadong history mo ang mga resulta.",
  },
} satisfies Record<Lang, Record<string, string>>;

export type DictKey = keyof (typeof DICT)["en"];

export function t(lang: Lang, key: DictKey): string {
  return DICT[lang][key] ?? DICT.en[key];
}
