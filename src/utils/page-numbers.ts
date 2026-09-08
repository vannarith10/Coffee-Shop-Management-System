export function getPageNumbers(
  totalPages: number,
  currentPage: number,
  maxVisiblePages = 5,
): (number | string)[] {
  // If all pages fit within the maximum visible pages,
  // show every page.
  if (totalPages <= maxVisiblePages) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  const pages: (number | string)[] = [];

  // Always show the first page.
  pages.push(1);

  // Only one page number can be shown in the middle.
  if (maxVisiblePages === 3) {
    if (currentPage > 2 && currentPage < totalPages - 1) {
      pages.push("...");
      pages.push(currentPage);
      pages.push("...");
    } else if (currentPage <= 2) {
      pages.push(2);
      pages.push("...");
    } else {
      pages.push("...");
      pages.push(totalPages - 1);
    }

    pages.push(totalPages);

    return pages;
  }

  // Calculate how many middle pages we can display.
  const middlePages = maxVisiblePages - 2;

  let startPage = currentPage - Math.floor(middlePages / 2);
  let endPage = startPage + middlePages - 1;

  // Prevent the starting page from being less than page 2.
  if (startPage < 2) {
    startPage = 2;
    endPage = startPage + middlePages - 1;
  }

  // Prevent the ending page from reaching the last page.
  if (endPage > totalPages - 1) {
    endPage = totalPages - 1;
    startPage = endPage - middlePages + 1;
  }

  // Add left ellipsis when there are hidden pages.
  if (startPage > 2) {
    pages.push("...");
  }

  // Add middle page numbers.
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Add right ellipsis when there are hidden pages.
  if (endPage < totalPages - 1) {
    pages.push("...");
  }

  // Always show the last page.
  pages.push(totalPages);

  return pages;
}