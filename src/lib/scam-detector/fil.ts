type SignalCopy = { label: string; explanation: string };

export const SIGNAL_FIL: Record<string, SignalCopy> = {
  "urgency.act-now": {
    label: "Pinapakilos ka agad",
    explanation:
      "Minamadali kang kumilos bago mo pa matingnan kung totoo ang sinasabi.",
  },
  "urgency.immediate": {
    label: "Kailangan daw gawin agad",
    explanation:
      "Wala ka raw oras maghintay. Puwedeng paraan ito para hindi ka na makapagtanong.",
  },
  "urgency.urgent": {
    label: "May babalang “urgent”",
    explanation:
      "Ginagawang apurahan ang mensahe para kumilos ka agad nang hindi nagsisiguro.",
  },
  "urgency.deadline": {
    label: "May maikling deadline",
    explanation:
      "Kaunti lang daw ang oras mo. Baka hindi ka na makapagtanong sa totoong kumpanya o ahensya.",
  },
  "urgency.last-chance": {
    label: "Huling pagkakataon na raw",
    explanation:
      "Ang “last chance” o “huling abiso” ay puwedeng panggigipit para mapapayag ka agad.",
  },
  "urgency.taglish": {
    label: "Kailangan daw ngayon na",
    explanation:
      "Pamilyar ang pananalita, pero minamadali ka pa ring sumagot o sumunod.",
  },
  "urgency.hurry": {
    label: "Minamadali kang magdesisyon",
    explanation:
      "Kapag pinagmamadali ka, mas mahirap mapansin ang mali sa alok o nagpadala.",
  },
  "urgency.scarcity": {
    label: "Kaunti na lang daw ang slots",
    explanation:
      "Baka ginagamit ang limitadong slots para magdesisyon ka bago makapagsiguro.",
  },
  "prize.congratulations": {
    label: "Bigla kang binabati",
    explanation:
      "Ang biglaang pagbati ay puwedeng pang-akit, lalo na kung may kasunod na paghingi ng pera o detalye.",
  },
  "prize.winner": {
    label: "Nanalo ka raw",
    explanation:
      "Kung hindi ka naman sumali, alamin muna kung saan galing ang sinasabing premyo.",
  },
  "prize.claim": {
    label: "Pinakukuha ang premyo",
    explanation:
      "Tingnan kung may bayad o personal na detalyeng hinihingi bago ibigay ang sinasabing premyo.",
  },
  "prize.big-money": {
    label: "Malaking premyo ang pang-akit",
    explanation:
      "Puwedeng gamitin ang laki ng premyo para mapapayag kang magbayad o magbigay ng detalye.",
  },
  "prize.raffle": {
    label: "May binabanggit na raffle",
    explanation:
      "Baka ginagamit ang pangalan ng raffle o ahensya para magmukhang totoo ang alok.",
  },
  "prize.reward": {
    label: "May biglaang reward o points",
    explanation:
      "Mag-ingat kung may reward na hindi mo inaasahan at kailangan mo munang ibigay ang detalye ng account.",
  },
  "financial.send-money": {
    label: "Pinagpapadala ka ng pera",
    explanation:
      "Alamin muna kung sino ang tatanggap at para saan ang bayad bago magpadala.",
  },
  "financial.fees": {
    label: "May bayad muna",
    explanation:
      "May hinihinging bayad bago ibigay ang ipinangakong pera, serbisyo, o premyo.",
  },
  "financial.ewallet": {
    label: "Sa e-wallet ipinapabayad",
    explanation:
      "Mag-ingat kung personal na GCash o Maya number ang pinagpapadalhan at hindi mo kilala ang kausap.",
  },
  "financial.bank": {
    label: "Hinihingi ang detalye ng bangko",
    explanation:
      "May hinihinging impormasyon tungkol sa account o card mo. Tiyaking totoong serbisyo ang kausap.",
  },
  "financial.otp": {
    label: "May hinihinging OTP o PIN",
    explanation:
      "Para sa iyo lang ang OTP at PIN. Puwedeng magamit ang mga ito para mapasok o magalaw ang account mo.",
  },
  "financial.load": {
    label: "May hinihinging load",
    explanation:
      "Kahit maliit ang halaga, alamin muna kung sino ang humihingi at bakit.",
  },
  "financial.phone-number": {
    label: "Sa personal na numero ipinapabayad",
    explanation:
      "Tingnan kung ang numerong tatanggap ng bayad ay talagang sa kumpanya o taong kausap mo.",
  },
  "credential.verify-account": {
    label: "Pinapa-verify ang account",
    explanation:
      "Baka sa pekeng verification page ka dalhin para makuha ang login o MPIN mo.",
  },
  "credential.impersonation": {
    label: "Gumagamit ng pangalan ng kumpanya o ahensya",
    explanation:
      "Hindi sapat ang pangalan o logo para mapatunayang opisyal ang nagpadala.",
  },
  "credential.suspension": {
    label: "Isasara raw ang account mo",
    explanation:
      "Puwedeng panakot ito para buksan mo agad ang link at ibigay ang detalye mo.",
  },
  "credential.password": {
    label: "Hinihingi ang password",
    explanation:
      "Huwag ipadala ang password sa mensahe. Puwedeng magamit ito para mapasok ang account mo.",
  },
  "credential.personal-info": {
    label: "Hinihingi ang personal na detalye",
    explanation:
      "Ang pangalan, address, at kaarawan mo ay puwedeng gamitin para magpanggap bilang ikaw.",
  },
  "link.click-taglish": {
    label: "Pinapabuksan ang link",
    explanation:
      "Tingnan muna ang address. Puwedeng sa pekeng login page ka dalhin.",
  },
  "link.any-url": {
    label: "May kasamang link",
    explanation:
      "Tingnan muna kung saan papunta ang link, lalo na kung hindi mo kilala ang nagpadala.",
  },
  "link.shortener": {
    label: "Pinaikling link",
    explanation:
      "Hindi agad makikita sa maikling link kung anong website ang bubuksan nito.",
  },
  "link.high-risk-tld": {
    label: "Kahina-hinalang dulo ng domain",
    explanation:
      "May ganitong dulo ng address sa ilang scam site. Isama ito sa iba pang palatandaang nakita.",
  },
  "link.brand-mimic": {
    label: "Ginagaya ang address ng isang brand",
    explanation:
      "May kaunting pagbabago sa spelling para magmukhang opisyal ang website.",
  },
  "link.ip-address": {
    label: "IP address ang nasa link",
    explanation:
      "Numero ang ginagamit sa halip na pangalan ng website. Tingnan muna kung inaasahan mo ang address na ito.",
  },
  "link.insecure-http": {
    label: "HTTP ang gamit ng link",
    explanation:
      "Walang encryption ang koneksyon. Huwag maglagay ng password o personal na detalye rito.",
  },
  "job.work-from-home": {
    label: "May alok na work from home",
    explanation:
      "Mag-ingat sa biglaang alok, lalo na kung madaling pera ang pangako at may bayad bago magsimula.",
  },
  "job.unrealistic-earnings": {
    label: "Sobrang laki ng ipinapangakong kita",
    explanation:
      "Kung napakasimple ng trabaho pero napakalaki ng sahod, alamin muna kung paano raw ito kikitain.",
  },
  "job.easy-hook": {
    label: "Madali raw at walang kailangang karanasan",
    explanation:
      "Baka pang-akit ang napakadaling trabaho para mag-sign up o magbayad ka agad.",
  },
  "job.task-offer": {
    label: "May bayad daw sa pag-like o pag-rate",
    explanation:
      "May mga task scam na nagsisimula sa simpleng gawain, saka humihingi ng deposito.",
  },
  "investment.double-money": {
    label: "Doble raw agad ang pera",
    explanation:
      "Mag-ingat sa alok na mabilis dodoble ang pera nang walang malinaw na paliwanag sa panganib.",
  },
  "investment.guaranteed-return": {
    label: "Sigurado raw ang tubo",
    explanation:
      "Ang pangakong siguradong mataas ang kita ay dapat pagdudahan at suriing mabuti.",
  },
  "investment.trading-group": {
    label: "Iniimbitahan ka sa trading o crypto group",
    explanation:
      "Alamin kung sino ang namamahala at kung saan mapupunta ang pera bago magdeposito.",
  },
  "investment.recruit": {
    label: "Kailangan pang mag-recruit",
    explanation:
      "Kung sa pagpasok ng bagong miyembro nanggagaling ang kita, puwedeng may panlilinlang sa alok.",
  },
  "loan.instant-offer": {
    label: "Aprubado agad ang loan",
    explanation:
      "Kung hindi ka naman nag-apply, alamin muna kung sino ang nag-aalok at bakit kailangan ang detalye mo.",
  },
  "loan.release-fee": {
    label: "May bayad bago ilabas ang loan",
    explanation:
      "Mag-ingat kung kailangan mo munang magpadala ng pera bago matanggap ang uutangin.",
  },
  "romance.affection": {
    label: "Mabilis magpahayag ng pagmamahal",
    explanation:
      "Mag-ingat kung mabilis lumalim ang usapan kahit hindi pa kayo nagkikita, lalo na kung may hinihinging tulong na pera.",
  },
  "romance.overseas-package": {
    label: "May padala raw mula sa ibang bansa",
    explanation:
      "Puwedeng mauwi ang kuwentong padala sa paghingi ng bayad sa customs o iba pang singil.",
  },
  "prize.telco-rewards": {
    label: "Mawawala na raw ang reward points",
    explanation:
      "Baka nagpapanggap na telco ang mensahe para dalhin ka sa pekeng page ng rewards.",
  },
  "gambling.casino-games": {
    label: "May promo ng online casino",
    explanation:
      "Hindi sapat ang promo sa text para makasigurong mapagkakatiwalaan ang betting site.",
  },
  "gambling.deposit-bonus": {
    label: "May bonus kapag nagdeposito",
    explanation:
      "Puwedeng pang-akit ang bonus para magpadala ka ng pera bago mo masuri ang site.",
  },
  "gambling.bet-invite": {
    label: "Pinapasali ka sa betting site",
    explanation:
      "Hindi matitiyak sa biglaang text kung sino ang may-ari ng site o paano mo mababawi ang deposito.",
  },
  "intel.community-number": {
    label: "May naunang report tungkol sa numero",
    explanation:
      "Naiulat na ang numerong ito sa PH Scam DB. Babala ito mula sa komunidad, hindi awtomatikong patunay ng panloloko.",
  },
};

export const BREAKDOWN_LABEL_FIL: Record<string, string> = {
  urgency: "Panggigipit sa oras",
  prize: "Panalo o premyo",
  financial: "Pera at bayad",
  credential: "Account at password",
  link: "Kahina-hinalang link",
  job: "Alok na trabaho",
  investment: "Pangakong kita sa investment",
  loan: "Bayad bago makautang",
  romance: "Panlilinlang sa pakikipagrelasyon",
  gambling: "Taya at bonus promo",
  intel: "Mga naunang report",
};
