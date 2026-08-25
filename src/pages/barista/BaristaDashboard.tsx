// pages/barista/BaristaDashboard.tsx
//

import Navbar from "../../components/barista/Navbar";
import PreparingOrder from "../../components/barista/PreparingOrder";
import QueueOrder from "../../components/barista/QueueOrder";

export default function BaristaDashboard() {
  return (
    <div className="h-screen max-h-screen w-screen border-2">
      <Navbar />
      <div className="h-full w-full flex flex-col gap-4 overflow-y-scroll scrollbar-hide p-4">
        <PreparingOrder/>
        <QueueOrder />
      </div>
    </div>
  );
}
