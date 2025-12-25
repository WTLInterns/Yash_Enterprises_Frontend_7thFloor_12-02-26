export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function getInitials(name) {
  if (!name) return "";
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + last).toUpperCase();
}

export function formatDateTime(isoString) {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "-";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
