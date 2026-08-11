export const MAX_AGE_SECONDS = 24 * 60 * 60;

/** Relative label capped at 24h. Never renders a fixed date. */
export function relativeLabel(ageSeconds: number) {
  const age = Math.max(0, Math.min(MAX_AGE_SECONDS, Math.floor(ageSeconds)));
  if (age < 60) return `${Math.max(1, age)}s atrás`;
  if (age < 3600) return `${Math.floor(age / 60)}min atrás`;
  return `${Math.floor(age / 3600)}h atrás`;
}

/** Section bucket used to group the feed chronologically. */
export function timeBucket(ageSeconds: number) {
  if (ageSeconds < 60) return "Agora mesmo";
  if (ageSeconds < 300) return "Últimos 5 minutos";
  if (ageSeconds < 3600) return "Última hora";
  if (ageSeconds < 6 * 3600) return "Últimas 6 horas";
  return "Últimas 24 horas";
}
