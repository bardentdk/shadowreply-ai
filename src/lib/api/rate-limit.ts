/**
 * Rate limiter en mémoire (simple, in-process).
 *
 * ⚠️ Limites du MVP :
 * - Reset au redémarrage du serveur
 * - Ne fonctionne pas en environnement multi-instance (à remplacer par Redis en prod)
 *
 * Suffisant pour le MVP. Pour la prod scale → @upstash/ratelimit avec Redis.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitEntry>();

// Cleanup périodique des entrées expirées (évite les fuites mémoire)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of buckets.entries()) {
    if (entry.resetAt < now) {
      buckets.delete(key);
    }
  }
}, 60_000); // toutes les 60s

interface RateLimitOptions {
  /** Identifiant unique (ex: user_id, ip) */
  identifier: string;
  /** Nombre max de requêtes par fenêtre */
  limit: number;
  /** Fenêtre en millisecondes */
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Vérifie si une requête est autorisée selon les limites.
 */
export function checkRateLimit(opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const key = opts.identifier;
  const entry = buckets.get(key);

  // Pas d'entrée OU fenêtre expirée → reset
  if (!entry || entry.resetAt < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + opts.windowMs,
    };
    buckets.set(key, newEntry);
    return {
      allowed: true,
      remaining: opts.limit - 1,
      resetAt: newEntry.resetAt,
    };
  }

  // Limite atteinte
  if (entry.count >= opts.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Incrémente
  entry.count++;
  return {
    allowed: true,
    remaining: opts.limit - entry.count,
    resetAt: entry.resetAt,
  };
}