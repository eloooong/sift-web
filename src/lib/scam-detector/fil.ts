type SignalCopy = { label: string; explanation: string };

export const SIGNAL_FIL: Record<string, SignalCopy> = {
  "urgency.act-now": {
    label: "\"Kumilos na ngayon\" na utos",
    explanation:
      "Pinipilit kang kumilos agad para hindi ka makapag-isip o makapag-verify.",
  },
  "urgency.immediate": {
    label: "Panggigipit na \"immediately\"",
    explanation:
      "Ang mabilisang deadline ay panlilinlang para hindi ka makapag-isip nang maayos.",
  },
  "urgency.urgent": {
    label: "Salitang \"URGENT\"",
    explanation:
      "Karaniwang ginagamit ang mataas na tensyon para ikaw ay magmadali at hindi magduda.",
  },
  "urgency.deadline": {
    label: "Takdang oras (deadline)",
    explanation:
      "Binibigyan ka ng maikling oras para hindi ka makapag-confirm sa tunay na company o ahensya.",
  },
  "urgency.last-chance": {
    label: "\"Last chance\" / huling abiso",
    explanation:
      "Ang banta ng \"huling pagkakataon\" ay pampressure lang, hindi ito proseso ng lehitimong serbisyo.",
  },
  "urgency.taglish": {
    label: "Taglish na panggigipit (\"kailangan ngayon\")",
    explanation:
      "Ginagamit ang pamilyar na Taglish na pananakot ng oras para mukhang tunay at mapamadali ka.",
  },
  "urgency.hurry": {
    label: "Pagmamadali (\"hurry\", \"dali\")",
    explanation:
      "Sinusulsulan kang magmadali para hindi mo na maisip na i-double-check ang sender.",
  },
  "urgency.scarcity": {
    label: "Artipisyal na kakulangan (\"only X slots left\")",
    explanation:
      "Ang pekeng \"konti na lang ang slots\" ay para ikaw ay magdesisyon agad nang hindi nag-iisip.",
  },
  "prize.congratulations": {
    label: "Nagsisimula sa \"Congratulations\"",
    explanation:
      "Ang di-inaasahang congratulations ay pambungad ng scam: masasaya ka bago ka pa makapag-isip.",
  },
  "prize.winner": {
    label: "Balitang \"nanalo ka\"",
    explanation:
      "Ang tunay na premyo ay hindi dumarating sa text mula sa numerong hindi mo kilala.",
  },
  "prize.claim": {
    label: "Instruksyon kunin ang premyo",
    explanation:
      "Ang mga hakbang sa pag-claim ay madalas humantong sa \"processing fee\" o pagbibigay ng personal na impormasyon.",
  },
  "prize.big-money": {
    label: "Napakalaking halaga ng pera",
    explanation:
      "Ang napakalaking premyo ay pain, luma na pero epektibo pa ring panlilinlang.",
  },
  "prize.raffle": {
    label: "Raffle / lottery na kuwento",
    explanation:
      "Madalas gamitin ang pangalan ng raffle o ahensya kahit hindi ka naman sumali.",
  },
  "prize.reward": {
    label: "Reward o puntos na di-inaasahan",
    explanation:
      "Ang di-mo-hininging reward ay madalas pain para kunin ang detalye ng account mo.",
  },
  "financial.send-money": {
    label: "Utos na magpadala ng pera",
    explanation:
      "Walang lehitimong serbisyo na hihingi ng padala ng pera sa personal na numero.",
  },
  "financial.fees": {
    label: "Hinihingi ang bayad / fee",
    explanation:
      "Humihingi ang message ng bayad bago pa man makatanggap ng ano man. Red flag ito.",
  },
  "financial.ewallet": {
    label: "Bayad sa e-wallet (GCash/Maya)",
    explanation:
      "Ang personal na GCash o Maya number bilang bayaran ay karaniwang gamit ng scammers.",
  },
  "financial.bank": {
    label: "Detalye ng bangko ang hiniling",
    explanation:
      "Humingi ang message ng sensitibong impormasyon tulad ng account o card details ng bangko.",
  },
  "financial.otp": {
    label: "Hinihingi ang OTP o PIN",
    explanation:
      "Humingi ang message ng sensitibong impormasyon tulad ng password o OTP. Walang tunay na company na hihingi nito.",
  },
  "financial.load": {
    label: "Hinihingi ang load",
    explanation:
      "Ang paghingi ng cellphone load ay maliit na halaga pero pareho rin lamang na panloloko.",
  },
  "financial.phone-number": {
    label: "Personal na mobile number bilang bayaran",
    explanation:
      "Ang pagbayad sa isang personal na cellphone number ay hindi kailanman opisyal na paraan ng bayad.",
  },
  "credential.verify-account": {
    label: "\"I-verify ang account\" na link",
    explanation:
      "Ang peking verification page ay nangongolekta ng login at MPIN mo.",
  },
  "credential.impersonation": {
    label: "Nagpapanggap na company o ahensya",
    explanation:
      "Kinikilala ang pangalan ng brand o ahensya para lang maging kapani-paniwala ang message.",
  },
  "credential.suspension": {
    label: "Banta ng pagsasara ng account",
    explanation:
      "Ang pananakot na mawawala ang account mo ay para ikaw ay magmadali at hindi mag-verify.",
  },
  "credential.password": {
    label: "Hinihingi ang password",
    explanation:
      "Walang tunay na website o app ang hihingin ang password mo sa mensahe.",
  },
  "credential.personal-info": {
    label: "Personal na impormasyon ang hiniling",
    explanation:
      "Humingi ang message ng buong pangalan, address, o birthday na pwedeng gamitin sa identity fraud.",
  },
  "link.click-taglish": {
    label: "Taglish na utos i-click ang link (\"i-click mo ang link\")",
    explanation:
      "Ang utos na buksan ang link ang daan papunta sa pekeng page na nangongolekta ng login mo.",
  },
  "link.any-url": {
    label: "May nakapaloob na link",
    explanation:
      "Magsuri muna: tingnang mabuti ang domain bago i-click ang anumang link mula sa di-kilalang sender.",
  },
  "link.shortener": {
    label: "Shortened link (bit.ly at iba pa)",
    explanation:
      "Itinatago ng shortener ang tunay na destinasyon, paboritong gamit ng scammers.",
  },
  "link.high-risk-tld": {
    label: "Kahina-hinalang domain ending (.xyz, .top, atbp.)",
    explanation:
      "Madalas gamitin ang murang domain endings sa mabilisang gawaing scam site.",
  },
  "link.brand-mimic": {
    label: "Domain na kamukha ng opisyal na brand",
    explanation:
      "May maliit na palitan sa spelling ng domain para kamukha ng tunay na website.",
  },
  "link.ip-address": {
    label: "Link patungo sa IP address",
    explanation:
      "Bihirang lehitimo ang link na gumagamit ng IP address sa halip na pangalang website.",
  },
  "link.insecure-http": {
    label: "Hindi secure na http:// link",
    explanation:
      "Walang encryption ang connection, kaya hindi ligtas maglagay ng anumang personal na detalye.",
  },
  "job.work-from-home": {
    label: "Work-from-home na alok",
    explanation:
      "Ang di-hiniling na work-from-home offer na madaling pera ay karaniwang modus.",
  },
  "job.unrealistic-earnings": {
    label: "Di-mapaniwalaang kita araw-araw",
    explanation:
      "Malaking sahod para sa simpleng trabaho ay halos laging scam.",
  },
  "job.easy-hook": {
    label: "\"No experience needed\" na pain",
    explanation:
      "Ginagawang madali ang alok para lang mag-sign up at magbayad ka ng fee.",
  },
  "job.task-offer": {
    label: "Simpleng task na may bayad (rating/likes)",
    explanation:
      "Ang pag-rate o pag-like bilang trabaho ay sikat na cover ng investment at job scam.",
  },
  "investment.double-money": {
    label: "Pangako ng dobleng pera",
    explanation:
      "Walang lehitimong investimento ang garantiyang dadami ang pera mo agad.",
  },
  "investment.guaranteed-return": {
    label: "\"Guaranteed\" na tubo",
    explanation:
      "Sa totoong mundo, walang garantiya sa investment, dahil ang pangako ng sigurado ay scam.",
  },
  "investment.trading-group": {
    label: "Imbitasyon sa trading/crypto group",
    explanation:
      "Ang mga grupong ito ay madalas pinaplano para kunin ang deposito mo.",
  },
  "investment.recruit": {
    label: "Recruitment para mag-invest",
    explanation:
      "Ang paghikayat sa iba para mag-invest ay tanda ng pyramid-style na panloloko.",
  },
  "loan.instant-offer": {
    label: "Instant na loan approval",
    explanation:
      "Ang agarang apruba kahit hindi ka nag-apply ay karaniwang loan scam.",
  },
  "loan.release-fee": {
    label: "Advance na \"release fee\"",
    explanation:
      "Ang tunay na lender ay binabawas ang fee sa loan, hindi nagbabayad muna bago ilabas ang pera.",
  },
  "romance.affection": {
    label: "Mabilisang pagpapahayag ng pagmamahal",
    explanation:
      "Ang sobrang agang \"mahal kita\" mula sa online-only na kakilala ay klasikong romance scam.",
  },
  "romance.overseas-package": {
    label: "Package o papeles mula abroad",
    explanation:
      "Ang kwentong package o papeles mula ibang bansa ay sinusundan ng hingi ng bayad sa customs.",
  },
};

export const BREAKDOWN_LABEL_FIL: Record<string, string> = {
  urgency: "Panggigipit sa oras",
  prize: "Panalo o premyo",
  financial: "Pera at bayad",
  credential: "Account at password",
  link: "Kahina-hinalang link",
  job: "Alok na trabaho",
  investment: "Pangako ng investimento",
  loan: "Loan na may fee",
  romance: "Romance manipulation",
};
