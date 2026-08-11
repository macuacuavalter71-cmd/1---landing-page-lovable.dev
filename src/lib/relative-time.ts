export const MAX_AGE_SECONDS = 24 * 60 * 60;
/** Nothing in the feed is ever newer than 7 minutes. */
export const MIN_AGE_SECONDS = 7 * 60;

/** Relative label between 7min and 24h. Never renders a fixed date. */
export function relativeLabel(ageSeconds: number) {
  const age = Math.max(
    MIN_AGE_SECONDS,
    Math.min(MAX_AGE_SECONDS, Math.floor(ageSeconds)),
  );
  if (age < 3600) return `${Math.floor(age / 60)}min atrás`;
  return `${Math.floor(age / 3600)}h atrás`;
}

/** Exact label for real user posts: 1s, 45s, 1min, 5min, 3h. */
export function exactLabel(ageSeconds: number) {
  const age = Math.max(0, Math.min(MAX_AGE_SECONDS, Math.floor(ageSeconds)));
  if (age < 60) return `${Math.max(1, age)}s atrás`;
  if (age < 3600) return `${Math.floor(age / 60)}min atrás`;
  return `${Math.floor(age / 3600)}h atrás`;
}

/** Section bucket used to group the feed chronologically. */
export function timeBucket(ageSeconds: number) {
  const age = Math.max(MIN_AGE_SECONDS, Math.min(MAX_AGE_SECONDS, ageSeconds));
  if (age < 30 * 60) return "Há poucos minutos";
  if (age < 3600) return "Última hora";
  if (age < 6 * 3600) return "Últimas 6 horas";
  if (age < 12 * 3600) return "Últimas 12 horas";
  return "Mais cedo hoje";
}
