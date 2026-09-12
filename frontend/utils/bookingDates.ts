// Date-only helpers: do not let the guest's timezone shift a booking day.
export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function dateFromKey(key: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return null;
  const [y, m, d] = key.split("-").map(Number);
  const value = new Date(y!, m! - 1, d!);
  return dateKey(value) === key ? value : null;
}
export function stayNights(start: Date, end: Date): number {
  return (
    (Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) -
      Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) /
    86400000
  );
}
export function rangeUnavailable(
  start: Date,
  end: Date,
  occupied: string[],
): boolean {
  const first = dateKey(start),
    last = dateKey(end);
  // The existing API treats both arrival and departure as occupied.
  return occupied.some((day) => day >= first && day <= last);
}
export function houseToday(): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Yekaterinburg",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  return new Date(
    Number(parts.find((p) => p.type === "year")!.value),
    Number(parts.find((p) => p.type === "month")!.value) - 1,
    Number(parts.find((p) => p.type === "day")!.value),
  );
}
