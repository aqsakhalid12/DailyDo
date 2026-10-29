export function toKey(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function keyFromOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toKey(d);
}

export function parseKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDue(key: string | null) {
  if (!key) return "No date";
  if (key === keyFromOffset(0)) return "Today";
  if (key === keyFromOffset(1)) return "Tomorrow";
  if (key === keyFromOffset(-1)) return "Yesterday";
  return parseKey(key).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function isOverdue(key: string | null, completed: boolean) {
  return !!key && !completed && key < keyFromOffset(0);
}