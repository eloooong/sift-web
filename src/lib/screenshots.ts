export const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
export const MIN_SCREENSHOT_BYTES = 64;

export const ACCEPTED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
] as const;

export const ACCEPTED_DROPZONE_ACCEPT = ".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp";

export type ScreenshotFormat = "png" | "jpeg" | "webp";

export type ScreenshotValidationCode =
  | "missing_file"
  | "too_large"
  | "empty_file"
  | "unsupported_type";

export function describeValidationError(code: ScreenshotValidationCode): string {
  switch (code) {
    case "missing_file":
      return "Choose a screenshot to analyze first.";
    case "too_large":
      return "That image is too large. Please upload a screenshot of 5 MB or less.";
    case "empty_file":
      return "That file appears to be empty or corrupted. Please try a different screenshot.";
    case "unsupported_type":
      return "Unsupported file type. Please upload a PNG, JPG, or WebP image.";
  }
}

export function validateScreenshotSize(size: number): ScreenshotValidationCode | null {
  if (!Number.isFinite(size) || size <= 0) return "empty_file";
  if (size < MIN_SCREENSHOT_BYTES) return "empty_file";
  if (size > MAX_SCREENSHOT_BYTES) return "too_large";
  return null;
}

/**
 * Best-effort client-side check before upload. The server re-validates with
 * magic-byte sniffing, so this is a UX guard, not the security boundary.
 */
export function validateClientFile(file: {
  name: string;
  size: number;
  type: string;
}): ScreenshotValidationCode | null {
  const sizeError = validateScreenshotSize(file.size);
  if (sizeError) return sizeError;

  const mime = (file.type || "").toLowerCase();
  if (mime && !ACCEPTED_MIME_TYPES.includes(mime as (typeof ACCEPTED_MIME_TYPES)[number])) {
    return "unsupported_type";
  }

  if (!mime) {
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (![".png", ".jpg", ".jpeg", ".webp"].includes(extension)) {
      return "unsupported_type";
    }
  }

  return null;
}

const FORMAT_TO_MIME: Record<ScreenshotFormat, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

export function formatToMimeType(format: ScreenshotFormat): string {
  return FORMAT_TO_MIME[format];
}

/** Magic-byte sniffing — never trust the declared MIME type alone. */
export function detectImageType(bytes: Uint8Array): ScreenshotFormat | null {
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "png";
  }

  // JPEG: FF D8 FF
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "jpeg";
  }

  // WebP: "RIFF" .... "WEBP"
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "webp";
  }

  return null;
}

/** Normalize raw OCR output into analyzer-ready text. */
export function sanitizeExtractedText(raw: string): string {
  return raw
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
