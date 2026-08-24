import { createTesseractProvider } from "./tesseract-provider";
import { OcrError, type OcrProvider } from "./types";

export { OcrError } from "./types";
export type { OcrErrorKind, OcrProvider, OcrResult } from "./types";

/**
 * Registry of OCR backends. To add a provider, implement `OcrProvider` and
 * register it here — callers stay untouched.
 */
const PROVIDERS: Record<string, () => OcrProvider> = {
  tesseract: () => createTesseractProvider(),
};

export function getOcrProvider(): OcrProvider {
  const requested = (process.env.OCR_PROVIDER ?? "tesseract")
    .toLowerCase()
    .trim();
  const factory = PROVIDERS[requested];
  if (!factory) {
    throw new OcrError(
      "not-configured",
      `Unknown OCR provider "${requested}". Available: ${Object.keys(PROVIDERS).join(", ")}.`
    );
  }
  return factory();
}
