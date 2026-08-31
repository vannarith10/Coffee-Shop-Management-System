//

import { RotateCcw } from "lucide-react";
import { type ReactNode } from "react";

interface Props {
  headerIcon: ReactNode;
  headerTitle: string;
  isLoading: boolean;
  isError: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  refetch: () => void;
  isRefetching: boolean;
}

const PageHeader = ({
  headerIcon,
  headerTitle,
  isLoading,
  isError,
  currentPage,
  totalPages,
  totalItems,
  refetch,
  isRefetching,
}: Props) => {
  return (
    <header>
      {/* Icon & Pagination Info */}
      <div className="w-full p-6 flex gap-4 justify-between items-center bg-background-secondary-hover">
        <div className="flex gap-4 items-center ">
          {/* <SquareChartGantt /> */}
          {headerIcon}
          <h3 className="font-semibold text-sm md:text-lg ">{headerTitle}</h3>
        </div>

        {/* ---------------------------------------------
                     Pages and Items 
         --------------------------------------------- */}
        {!isLoading && !isError && (
          <div className="flex justify-between items-center gap-2">
            {!isRefetching && (
              <div>
                <h4 className="font-semibold text-xs text-text-secondary text-nowrap">
                  Page {currentPage} of {totalPages}
                </h4>
                <h4 className="font-semibold text-sm text-nowrap">
                  Total items: {totalItems}
                </h4>
              </div>
            )}

            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-sm flex items-center gap-2 font-semibold bg-background-secondary rounded-lg cursor-pointer active:scale-80 transition-all duration-200 ease-out outline-none"
            >
              {isRefetching ? "Syncing..." : <RotateCcw size={20} />}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
