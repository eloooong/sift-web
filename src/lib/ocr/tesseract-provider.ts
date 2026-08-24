import { mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { Worker } from "tesseract.js";

import { OcrError, type OcrProvider, type OcrResult } from "./types";

const DEFAULT_TIMEOUT_MS = 45_000;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new OcrError("timeout", "OCR took too long to complete."));
    }, timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

/**
 * Local OCR backend built on tesseract.js. The worker is created lazily on
 * first use and reused across requests; traineddata files are cached on disk.
 */
export function createTesseractProvider(options?: {
  languages?: string;
  timeoutMs?: number;
}): OcrProvider {
  const languages = options?.languages ?? process.env.OCR_LANGUAGES ?? "eng";
  const parsedTimeout = Number(
    options?.timeoutMs ?? process.env.OCR_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS
  );
  const timeoutMs =
    Number.isFinite(parsedTimeout) && parsedTimeout > 0
      ? parsedTimeout
      : DEFAULT_TIMEOUT_MS;

  let workerPromise: Promise<Worker> | null = null;

  function getWorker(): Promise<Worker> {
    if (!workerPromise) {
      workerPromise = (async () => {
        const { createWorker } = await import("tesseract.js");
        const cachePath =
          process.env.OCR_CACHE_DIR ||
          path.join(os.tmpdir(), "scamshield-tesseract");
        await mkdir(cachePath, { recursive: true });
        return createWorker(languages, 1, {
          cachePath,
          logger: () => {},
        });
      })().catch((error) => {
        workerPromise = null;
        throw error instanceof OcrError
          ? error
          : new OcrError("failed", "The OCR engine could not be started.");
      });
    }
    return workerPromise;
  }

  return {
    id: "tesseract",

    async extractText(image: Uint8Array): Promise<OcrResult> {
      let worker: Worker;
      try {
        worker = await getWorker();
      } catch (error) {
        if (error instanceof OcrError) throw error;
        throw new OcrError("failed", "The OCR engine could not be started.");
      }

      try {
        const result = await withTimeout(
          worker.recognize(Buffer.from(image)),
          timeoutMs
        );
        const text = typeof result.data.text === "string" ? result.data.text : "";
        const confidence =
          typeof result.data.confidence === "number"
            ? result.data.confidence
            : null;
        return { text, confidence };
      } catch (error) {
        if (error instanceof OcrError) throw error;
        throw new OcrError(
          "failed",
          "The OCR engine failed while reading the image."
        );
      }
    },
  };
}
