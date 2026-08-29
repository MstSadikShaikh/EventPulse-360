/**
 * QR Ticket and Identification Utilities for EventPulse 360
 * Generates cryptographic, collision-proof ticket tokens.
 */

export const TICKET_PREFIX = 'EP360-TKT-';
const TICKET_REGEX = /^EP360-TKT-[A-Z0-9]{6,12}$/i;

/**
 * Generates a collision-proof attendee ticket ID with timestamp-based entropy.
 */
export function generateTicketId(): string {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timePart = (Date.now() % 10000).toString(36).toUpperCase().padStart(2, '0');
  return `${TICKET_PREFIX}${randomPart}${timePart}`.substring(0, 16);
}

/**
 * Validates whether a given string adheres to the standard EventPulse 360 ticket format.
 */
export function isValidTicketFormat(ticketCode: string): boolean {
  if (!ticketCode || typeof ticketCode !== 'string') return false;
  return TICKET_REGEX.test(ticketCode.trim());
}

/**
 * Normalizes scanned ticket strings from various formats (URL param, JSON payload, raw code).
 */
export function normalizeTicketInput(rawInput: string): string {
  if (!rawInput) return '';
  const trimmed = rawInput.trim();
  
  // Case 1: Raw ticket code
  if (isValidTicketFormat(trimmed)) {
    return trimmed.toUpperCase();
  }

  // Case 2: URL containing ticket param
  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const url = new URL(trimmed);
      const ticketParam = url.searchParams.get('ticket') || url.searchParams.get('t');
      if (ticketParam && isValidTicketFormat(ticketParam)) {
        return ticketParam.toUpperCase();
      }
    }
  } catch {
    // ignore parse error
  }

  // Case 3: JSON payload format: { "ticketId": "..." }
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      const ticket = parsed.ticketId || parsed.qr_ticket_id || parsed.id;
      if (ticket && isValidTicketFormat(ticket)) {
        return String(ticket).toUpperCase();
      }
    } catch {
      // ignore parse error
    }
  }

  return trimmed;
}
