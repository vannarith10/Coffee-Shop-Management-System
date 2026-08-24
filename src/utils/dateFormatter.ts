//


export const formatDateTime = (
  isoDate: string | null,
  options = {
    showDate: true,
    showTime: true,
  }
) => {
  if (!isoDate) return "";

  const date = new Date(isoDate);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  if (options.showDate && options.showTime) {
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  if (options.showDate) {
    return `${day}/${month}/${year}`;
  }

  if (options.showTime) {
    return `${hours}:${minutes}`;
  }

  return "";
};