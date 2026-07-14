import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

const DEFAULT_TOLERANCE_SECONDS = 300;

function constantTimeHexEquals(actual: string, expected: string) {
  if (!/^[a-f0-9]{64}$/i.test(actual) || !/^[a-f0-9]{64}$/i.test(expected)) {
    return false;
  }
  const actualBytes = Buffer.from(actual, "hex");
  const expectedBytes = Buffer.from(expected, "hex");
  return (
    actualBytes.length === expectedBytes.length &&
    timingSafeEqual(actualBytes, expectedBytes)
  );
}

/** Verify Stripe's signed raw request body using its documented v1 scheme. */
export function verifyStripeWebhookSignature(
  rawBody: string,
  signatureHeader: string,
  webhookSecret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
  toleranceSeconds = DEFAULT_TOLERANCE_SECONDS,
) {
  if (!rawBody || !signatureHeader || !webhookSecret) return false;

  let timestamp: number | null = null;
  const v1Signatures: string[] = [];
  for (const part of signatureHeader.split(",")) {
    const separator = part.indexOf("=");
    if (separator < 1) continue;
    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (key === "t" && timestamp === null) timestamp = Number(value);
    if (key === "v1") v1Signatures.push(value);
  }

  if (
    timestamp === null ||
    !Number.isInteger(timestamp) ||
    Math.abs(nowSeconds - timestamp) > toleranceSeconds ||
    v1Signatures.length === 0
  ) {
    return false;
  }

  const expected = createHmac("sha256", webhookSecret)
    .update(`${timestamp}.${rawBody}`, "utf8")
    .digest("hex");

  return v1Signatures.some((signature) =>
    constantTimeHexEquals(signature, expected),
  );
}
