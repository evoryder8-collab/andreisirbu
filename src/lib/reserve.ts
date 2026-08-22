/**
 * Where a Reserve action goes, decided in one place.
 *
 * Most sessions run through the booking calendar. The Private Session does
 * not: it is arranged by conversation, so it leaves the site for WhatsApp
 * with the enquiry already written. Every Reserve control on the site reads
 * this, so the two paths can never drift apart again.
 */
import { whatsappUrl, type Session } from "../data/catalogue";
import { STUDIO } from "./availability";
import { href } from "./url";

export interface ReserveTarget {
  /** Ready to use in an href: already base-prefixed when internal. */
  to: string;
  external: boolean;
  /** Rel/target pairs, spread straight onto the anchor. */
  attrs: { target?: string; rel?: string };
}

export const isEnquiryOnly = (s: Session): boolean => s.booking === "whatsapp";

export const reserveTarget = (s: Session): ReserveTarget =>
  isEnquiryOnly(s)
    ? {
        to: whatsappUrl(STUDIO.phoneHref),
        external: true,
        attrs: { target: "_blank", rel: "noopener noreferrer" },
      }
    : { to: href(`/book/${s.slug}`), external: false, attrs: {} };
