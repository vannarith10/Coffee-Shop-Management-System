import { ResponsiveHeatMap } from "@nivo/heatmap";
import { useGetBusiestHours } from "../../hooks/useGetBusiestHours";
import { RotateCcw } from "lucide-react";


const BusiestHours = () => {
  const { data, isLoading, isError, isRefetching, refetch } =
    useGetBusiestHours();



  return (
    <section className="h-120s xl:h-150 flex flex-col p-4 bg-background-secondary rounded-lg border-2 border-border">
      {/* ================================ */}
      {/* Title */}
      {/* ================================ */}
      <div className="flex justify-between ">
        <div>
          <h3 className="text-sm sm:text-lg md:text-sm lg:text-lg xl:text-xl font-bold">
            Busiest Hours
          </h3>
          <p className="text-text-secondary text-xs sm:text-sm md:text-xs lg:text-sm xl:text-lg">
            Average order volume by time & day
          </p>
        </div>
        <div>
          <button
            onClick={() => refetch()}
            className="col-start-2 xl:col-start-4 text-xs sm:text-sm md:text-xs lg:text-sm xl:text-lg flex justify-center items-center gap-2 bg-background-secondary py-2 px-4 rounded-md border-2 border-border font-bold hover:bg-background-secondary-hover hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-200 ease-out outline-none"
          >
            {isRefetching ? (
              "Syncing..."
            ) : (
              <>
                Refresh{" "}
                <RotateCcw className="size-4 sm:size-6 md:size-4 lg:size-6 xl:size-8" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="h-full w-full flex justify-center ">
        <div className=" w-full h-50 sm:h-80 md:h-100 xl:w-200 ">
          <ResponsiveHeatMap
            data={data?.days ?? []}
            margin={{ top: 40, right: 20, bottom: 20, left: 40 }}
            valueFormat=" >-.2s"
            forceSquare={true}
            xInnerPadding={0.1}
            yInnerPadding={0.1}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fill: "#ffffff", // label color
                    fontSize: 8,
                  },
                },
              },
            }}
            axisTop={{ tickSize: 0, tickPadding: 10 }}
            axisLeft={{ tickSize: 0, tickPadding: 10, legendOffset: -72 }}
            enableLabels={false}
            colors={{
              type: "sequential",
              colors: ["#0e4429", "#39d353"],
            }}
            emptyColor="#161b22"
            borderRadius={2}
            labelTextColor={{ from: "color", modifiers: [["darker", 3]] }}
            // -----------------------------------
            // Tooltip
            // -----------------------------------
            tooltip={({ cell }) => (
              <div className="bg-background-secondary/10 backdrop-blur-sm px-4 py-2 border border-border rounded-md">
                <strong>{cell.id}</strong>
                <br />
                <span className="whitespace-nowrap">Orders: {cell.value}</span>
              </div>
            )}
          />
        </div>
      </div>


    </section>
  );
};



export default BusiestHours;
