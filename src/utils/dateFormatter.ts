//

export const formatDateTime = (
  isoDate: string | null | undefined,
  options = {
    showDate: true,
    showTime: false,
    fullMonthName: true,
  },
) => {
  if (!isoDate) return "";

  const date = new Date(isoDate);

  const day = String(date.getDate());

  const month = options.fullMonthName
    ? date.toLocaleString("en-GB", { month: "long" }) // August
    : String(date.getMonth() + 1).padStart(2, "0"); // 08

  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  if (options.showDate && options.showTime) {
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  if (options.showDate) {
    return `${day} ${month} ${year}`;
  }

  if (options.showTime) {
    return `${hours}:${minutes}`;
  }

  return "";
};
