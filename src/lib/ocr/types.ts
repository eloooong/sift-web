export type OcrResult = {
  /** Best-effort plain text extracted from the image. May be empty. */
  text: string;
  /** Provider-reported confidence in 0–100, if available. */
  confidence: number | null;
};

export type OcrErrorKind =
  | "failed"
  | "timeout"
  | "not-configured";

export class OcrError extends Error {
  readonly kind: OcrErrorKind;

  constructor(kind: OcrErrorKind, message: string) {
    super(message);
    this.name = "OcrError";
    this.kind = kind;
  }
}

/**
 * Contract every OCR backend must fulfill. Swapping providers (cloud vision
 * APIs, on-device models, …) only requires implementing this interface and
 * registering it in the factory — nothing else in the app changes.
 */
export interface OcrProvider {
  readonly id: string;
  extractText(image: Uint8Array): Promise<OcrResult>;
}
