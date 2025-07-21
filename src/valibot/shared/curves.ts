import type {
  EllipticCurve,
  OctetKeyPairCurve,
  CryptographicCurve
} from "../../types/shared/curves"
import * as v from "valibot"
import {
  ellipticCurves,
  octetKeyPairCurves,
  cryptographicCurves
} from "../../constants/curves"

/**
 * Elliptic Curve names.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518#section-6.2.1.1}
 */
export const EllipticCurveSchema = v.pipe(
  v.picklist(ellipticCurves),
  v.custom<EllipticCurve>(() => true)
)

/**
 * Octet Key Pair curves.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc8037}
 */
export const OctetKeyPairCurveSchema = v.pipe(
  v.picklist(octetKeyPairCurves),
  v.custom<OctetKeyPairCurve>(() => true)
)

/**
 * All supported cryptographic curves (EC + OKP).
 */
export const CryptographicCurveSchema = v.pipe(
  v.picklist(cryptographicCurves),
  v.custom<CryptographicCurve>(() => true)
)
