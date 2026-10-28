import { createTesseractProvider } from "./tesseract-provider";
import { OcrError, type OcrProvider } from "./types";

export { OcrError } from "./types";
export type { OcrErrorKind, OcrProvider, OcrResult } from "./types";

/**
 * Registry of OCR backends. To add a provider, implement `OcrProvider` and
 * register it here; callers stay untouched.
 */
const PROVIDERS: Record<string, () => OcrProvider> = {
  tesseract: () => createTesseractProvider(),
};

const globalForOcr = globalThis as unknown as {
  __scamshieldOcrProvider?: OcrProvider;
};

/**
 * One provider instance (and therefore one Tesseract worker) per server
 * process. Worker startup is expensive (WASM init + language data), so it
 * must be reused across requests instead of rebuilt for every scan.
 */
export function getOcrProvider(): OcrProvider {
  const requested = (process.env.OCR_PROVIDER ?? "tesseract")
    .toLowerCase()
    .trim();
  const factory = Object.hasOwn(PROVIDERS, requested)
    ? PROVIDERS[requested]
    : undefined;
  if (!factory) {
    throw new OcrError(
      "not-configured",
      `Unknown OCR provider "${requested}". Available: ${Object.keys(PROVIDERS).join(", ")}.`,
    );
  }
  if (globalForOcr.__scamshieldOcrProvider?.id === requested) {
    return globalForOcr.__scamshieldOcrProvider;
  }
  const provider = factory();
  globalForOcr.__scamshieldOcrProvider = provider;
  return provider;
}
