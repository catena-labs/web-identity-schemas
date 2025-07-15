import * as z from "zod"
import {
  ellipticCurves,
  octetKeyPairCurves,
  cryptographicCurves
} from "../../constants/curves"
import type {
  EllipticCurve,
  OctetKeyPairCurve,
  CryptographicCurve
} from "../../types/shared/curves"

/**
 * Elliptic Curve names.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518#section-6.2.1.1}
 */
export const EllipticCurveSchema = z
  .enum(ellipticCurves)
  .pipe(z.custom<EllipticCurve>())

/**
 * Octet Key Pair curves.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc8037}
 */
export const OctetKeyPairCurveSchema = z
  .enum(octetKeyPairCurves)
  .pipe(z.custom<OctetKeyPairCurve>())

/**
 * All supported cryptographic curves (EC + OKP).
 */
export const CryptographicCurveSchema = z
  .enum(cryptographicCurves)
  .pipe(z.custom<CryptographicCurve>())
