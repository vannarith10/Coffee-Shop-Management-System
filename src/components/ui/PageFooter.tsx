import React from "react";
import { getPageNumbers } from "../../utils/page-numbers";
import { Ellipsis } from "lucide-react";

interface Props {
  handlePrev: () => void;
  handleNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;

  totalPages: number;
  currentPage: number;

  handlePageClick: (pageNum: number) => void;
}

const PageFooter = ({
  handlePrev,
  handleNext,
  hasPrev,
  hasNext,
  totalPages,
  currentPage,
  handlePageClick,
}: Props) => {
  return (
    <footer>
      <div className="flex bg-background-secondary-hover justify-between px-6 py-6 border-t border-border-hover">
        {/* Prev */}
        <button
          onClick={handlePrev}
          disabled={!hasPrev}
          className={`${hasPrev ? "cursor-pointer hover:bg-sidebar text-white " : "bg-gray-600 cursor-not-allowed text-gray-900"}  font-semibold px-4 py-2 rounded-md  bg-background-secondary  active:scale-90 transition-all duration-200 ease-out`}
        >
          Prev
        </button>
        {/* ============================= */}
        {/* 1 2 3 ... 4 */}
        {/* Page Numbers */}
        {/* ============================= */}
        <div className="flex items-center justify-center gap-2">
          {getPageNumbers(totalPages, currentPage).map((pageNum, idx) =>
            pageNum === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-3 py-2 text-text-secondary"
              >
                <Ellipsis />
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => handlePageClick(pageNum as number)}
                className={`px-4 py-2 rounded-md font-bold text-sm active:scale-80 outline-none transition-all duration-300 ease-out cursor-pointer ${pageNum === currentPage ? "bg-green-600 text-white hover:bg-green-500" : "bg-sidebar text-white hover:bg-background-secondary"}`}
              >
                {pageNum}
              </button>
            ),
          )}
        </div>
        {/* Next */}
        <button
          onClick={handleNext}
          disabled={!hasNext}
          className={`${hasNext ? "cursor-pointer hover:bg-sidebar text-white " : "bg-gray-600 cursor-not-allowed text-gray-900"} font-semibold px-4 py-2 rounded-md  bg-background-secondary  active:scale-90 transition-all duration-200 ease-out`}
        >
          Next
        </button>
      </div>
    </footer>
  );
};

export default PageFooter;
