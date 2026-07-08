//utils/data-converter.ts

export function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    month: "long", // April
    day: "numeric", // 8
    year: "numeric", // 2026
    hour: "numeric", // 12
    minute: "2-digit", // 12
    hour12: true, // AM/PM
  });
}
