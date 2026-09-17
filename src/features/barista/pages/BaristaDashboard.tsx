import Navbar from "../components/Navbar"; 
import PreparingOrder from "@/features/barista/components/PreparingOrder";
import QueueOrder from "@/features/barista/components/QueueOrder";

export default function BaristaDashboard() {
  return (
    <div className="h-screen max-h-screen w-screen ">
      <Navbar />
      <div className="h-full w-full flex flex-col gap-4 overflow-y-scroll scrollbar-hide p-4">
        <PreparingOrder />
        <QueueOrder />
      </div>
    </div>
  );
}
