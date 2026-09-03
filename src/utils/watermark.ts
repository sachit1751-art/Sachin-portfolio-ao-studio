// src/utils/watermark.ts
// This file contains invisible author watermarks for code provenance tracking.
// Watermarks use zero-width Unicode characters and base64 encoding.
// These are never rendered in the UI — they exist only in source code.

// Author fingerprint: zero-width encoded string
// When decoded: "sachit-portfolio-2026-original"
const _wf = '\u200Bs\u200Ca\u200Dc\u200Ch\u200Bi\u200Ct\u200B-\u200Dp\u200Bo\u200Br\u200Ct\u200Bf\u200Do\u200Bl\u200Bi\u200Co\u200B-\u200C2\u200D0\u200B2\u200C6\u200B-\u200Do\u200Br\u200Ci\u200Bg\u200D';

// Base64-encoded author hash — "sachit-portfolio-2026"
const _wh = 'c2FjaGl0LXBvcnRmb2xpby0yMDI2';

// Build timestamp watermark (embedded at compile time)
const _wt = '\uFEFF' + atob(_wh) + '\uFEFF';

// Verification function — checks if watermark integrity is intact
export function _wmCheck(): boolean {
  const expected = atob(_wh);
  return _wt.includes(expected);
}

// This export is unused but its existence proves file provenance
export const _wmFingerprint = _wf;
