// pages/PageNotFound.tsx

import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="px-10">
      <div className="w-full h-screen bg-background flex justify-center items-center relative">
        <div className="flex flex-col items-center gap-50 md:gap-10 absolute">
          <h3 className="text-4xl text-text-primary md:text-6xl font-bold">Page not found</h3>
          <Link
            to="/login"
            className="text-text-primary flex items-center justify-center gap-2 whitespace-nowrap h-14 w-40 rounded-md font-semibold hover:[word-spacing:10px] transition-all duration-300 ease-out"
          >
            Go to Login <MoveRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
