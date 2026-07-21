import { ResponsiveHeatMap } from "@nivo/heatmap";
import { useGetBusiestHours } from "../../hooks/useGetBusiestHours";


const BusiestHours = () => {
  
  const {data, isLoading, isError, isRefetching, refetch} = useGetBusiestHours();


  return (
    <section className="h-120 xl:h-150 flex flex-col p-6 bg-background-secondary rounded-lg border-2 border-border">
      {/* ================================ */}
      {/* Title */}
      {/* ================================ */}
      <div>
        <h3 className="text-xl font-bold">Busiest Hours</h3>
        <p className="text-text-secondary text-sm">
          Average order volume by time & day
        </p>
      </div>
      <div className="h-full w-full flex justify-center">
        <div className="h-full w-full xl:w-200">
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
                <br/>
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
