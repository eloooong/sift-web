import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LanguageProvider } from "@/components/providers/language-provider";
import { T } from "@/components/providers/t";
import { SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: AI-assisted scam risk assessment for Filipinos`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Check suspicious SMS, emails, chat messages, and links. Sift scores the risk, explains the red flags, and tells you what to do next.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME}: AI-assisted scam risk assessment for Filipinos`,
    description:
      "Assess the risk of suspicious messages, links, and screenshots. Sift highlights potential warning signs — always verify through official channels.",
    locale: "en_PH",
    alternateLocale: ["fil_PH"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME}: AI-assisted scam risk assessment for Filipinos`,
    description:
      "Assess the risk of suspicious messages, links, and screenshots. Sift highlights potential warning signs — always verify through official channels.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
    >
      <T k="a11y.skipToContent" />
    </a>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <div
          hidden
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html:
              "<!--\nTHESIS: A public safety advisory desk that makes suspicious messages understandable. No repeated marketing-card wall.\nOWN-WORLD: Slate-white #f8fafc, ink #0f172a, card-white #ffffff, muted slate #526176. Geist, flat borders, 0.625rem base corners, generous reading space.\nSTORY: Pause, inspect an illustrative message, choose a scanner, review evidence, take a safer next step.\nFIRST VIEWPORT: 80px navigation; 88px left-aligned headline with two actions; an interactive message advisory on the right. On mobile the task leads and the sample follows.\nFORM: Safety advisory bulletin, grounded candidate 6, seed f3647f6e. Code-led; user delegated all design decisions. Signature interaction switches between three sample messages with a direct full-report path.\nFINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance\n-->",
          }}
        />
        <LanguageProvider>
          <SkipLink />
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
