/**
 * Security and Sanitization Utilities for EventPulse 360
 * Protection against XSS, injection, brute-force PIN attempts, and malformed URLs.
 */

interface RateLimitState {
  attempts: number;
  lastAttemptTime: number;
  lockoutUntil: number;
}

const pinRateLimitStore: Record<string, RateLimitState> = {};

/**
 * Sanitizes user-provided text to prevent HTML/script injection in feedback and announcements.
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates external project URLs (GitHub repos, Figma, Youtube, live demos).
 * Strictly requires http/https and blocks dangerous protocols like javascript: or data:
 */
export function isValidSecureUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== 'string') return false;
  const trimmed = urlString.trim();
  
  if (!/^https?:\/\//i.test(trimmed)) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Client-side rate limiter for PIN authentication to thwart automated brute-force attacks.
 * Max 5 failed attempts before a 30-second exponential lockout.
 */
export function checkPinRateLimit(identifier: string = 'global'): { allowed: boolean; remainingSeconds?: number } {
  const now = Date.now();
  const state = pinRateLimitStore[identifier] || { attempts: 0, lastAttemptTime: 0, lockoutUntil: 0 };

  // Check if currently locked out
  if (state.lockoutUntil > now) {
    const remainingSeconds = Math.ceil((state.lockoutUntil - now) / 1000);
    return { allowed: false, remainingSeconds };
  }

  return { allowed: true };
}

/**
 * Records a failed PIN attempt and computes exponential lockout duration.
 */
export function recordFailedPinAttempt(identifier: string = 'global'): { lockoutActive: boolean; lockoutSeconds?: number } {
  const now = Date.now();
  const state = pinRateLimitStore[identifier] || { attempts: 0, lastAttemptTime: 0, lockoutUntil: 0 };

  state.attempts += 1;
  state.lastAttemptTime = now;

  if (state.attempts >= 5) {
    const lockoutDurationMs = Math.min(30000 * Math.pow(2, state.attempts - 5), 300000); // 30s to 5min max
    state.lockoutUntil = now + lockoutDurationMs;
    pinRateLimitStore[identifier] = state;
    return { lockoutActive: true, lockoutSeconds: Math.ceil(lockoutDurationMs / 1000) };
  }

  pinRateLimitStore[identifier] = state;
  return { lockoutActive: false };
}

/**
 * Resets the failed attempt counter upon successful PIN authentication.
 */
export function resetPinRateLimit(identifier: string = 'global'): void {
  delete pinRateLimitStore[identifier];
}
