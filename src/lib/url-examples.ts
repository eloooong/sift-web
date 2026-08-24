export type UrlExample = {
  id: string;
  label: string;
  url: string;
  note: string;
};

export const URL_EXAMPLES: UrlExample[] = [
  {
    id: "shortener",
    label: "Shortened URL",
    url: "https://bit.ly/3pHxQz9",
    note: "Hides where it really goes",
  },
  {
    id: "fake-login",
    label: "Fake Login URL",
    url: "http://secure-gcash-login.verify-account.top/user/login?next=/wallet/otp",
    note: "Impersonates GCash over plain HTTP",
  },
  {
    id: "fake-delivery",
    label: "Fake Delivery URL",
    url: "https://lbc-express-redelivery.delivery-fee-ph.xyz/pay?redirect=https%3A%2F%2Fpay-lbc.top&id=JT2639845710",
    note: "Courier fee bait with a hidden redirect",
  },
];
