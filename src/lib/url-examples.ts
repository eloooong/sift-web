export type UrlExample = {
  id: string;
  label: string;
  labelFil: string;
  url: string;
  note: string;
  noteFil: string;
};

export const URL_EXAMPLES: UrlExample[] = [
  {
    id: "shortener",
    labelFil: "Pinaikling link",
    noteFil: "Hindi agad makikita ang pupuntahan",
    label: "Shortened URL",
    url: "https://bit.ly/3pHxQz9",
    note: "Hides where it really goes",
  },
  {
    id: "fake-login",
    labelFil: "Pekeng login page",
    noteFil: "Ginagaya ang GCash sa hindi secure na address",
    label: "Fake Login URL",
    url: "http://secure-gcash-login.verify-account.top/user/login?next=/wallet/otp",
    note: "Impersonates GCash over plain HTTP",
  },
  {
    id: "fake-delivery",
    labelFil: "Pekeng singil sa delivery",
    noteFil: "May nakatagong utos na lumipat sa ibang site",
    label: "Fake Delivery URL",
    url: "https://lbc-express-redelivery.delivery-fee-ph.xyz/pay?redirect=https%3A%2F%2Fpay-lbc.top&id=JT2639845710",
    note: "Courier fee bait with a hidden redirect",
  },
];
