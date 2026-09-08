import { useEffect, useState } from "react";
import { getPageNumbers } from "../../utils/page-numbers";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";

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
      <div className="flex gap-2 bg-background-secondary-hover justify-between p-6 border-t border-border-hover">
        {/* Prev */}
        <button
          onClick={handlePrev}
          disabled={!hasPrev}
          className={` flex gap-1 items-center ${hasPrev ? "cursor-pointer hover:bg-sidebar text-white " : "bg-gray-600 cursor-not-allowed text-gray-900"}  font-semibold text-sm px-2 sm:px-4 py-2 rounded-md  bg-background-secondary  active:scale-90 outline-none transition-all duration-200 ease-out`}
        >
          <span><ChevronLeft/></span>
          <span className=" hidden sm:block ">Prev</span>
        </button>
        {/* ============================= */}
        {/* 1 2 3 ... 4 */}
        {/* Page Numbers */}
        {/* ============================= */}
        <div className="flex items-center justify-center gap-2 ">
          {getPageNumbers(totalPages, currentPage).map(
            (pageNum, idx) =>
              pageNum === "..." ? (
                <span key={idx} className=" py-2 text-text-secondary">
                  <Ellipsis />
                </span>
              ) : (
                <button
                  key={idx}
                  onClick={() => handlePageClick(pageNum as number)}
                  className={`px-4 py-2 aspect-square rounded-md font-bold text-sm active:scale-90 outline-none transition-all duration-300 ease-out cursor-pointer ${pageNum === currentPage ? "bg-green-600 text-white hover:bg-green-500" : "bg-sidebar text-white hover:bg-background-secondary"}`}
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
          className={` flex gap-1 items-center ${hasNext ? "cursor-pointer hover:bg-sidebar text-white " : "bg-gray-600 cursor-not-allowed text-gray-900"} font-bold text-sm px-2 sm:px-4 py-2 rounded-md  bg-background-secondary  active:scale-90 outline-none transition-all duration-200 ease-out`}
        >
          <span className=" hidden sm:block " >Next</span>
          <span><ChevronRight/></span>
        </button>
      </div>
    </footer>
  );
};

export default PageFooter;
