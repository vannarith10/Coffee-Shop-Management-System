// components/DisplayStaff.tsx
//
import { useEffect, useState } from "react";
import Image from "../assets/vr-comic.jpg";
import DefaultProfile from "../assets/user-profile.png";
import { Dot } from "lucide-react";
import type { StaffProfileResponse } from "../types/staff";
import { getAllStaffProfiles } from "../services/admin.service";
import { DAY_ORDER, SCHEDULE_CONFIG } from "../types/schedule";
import { Ellipsis } from "lucide-react";

export default function DisplayStaff() {
  const [staff, setStaff] = useState<StaffProfileResponse | null>(null);
  const [page, setPage] = useState(1);
  const size = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllStaffProfiles({ page, size });
        setStaff(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsError(true);
      }
      setIsLoading(false);
      setIsError(false);
    }
    fetchData();
  }, [page]);
  console.log("Staff: ", staff);
  //
  //
  //
  // Pagination logic
  //
  const currentPage = staff?.pagination.page ?? page;
  const totalPages = staff?.pagination.total_pages ?? 1;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  //
  function handlePrev() {
    if (hasPrev) {
      setPage((p) => p - 1);
    }
  }
  //
  function handleNext() {
    if (hasNext) {
      setPage((p) => p + 1);
    }
  }
  //
  function handlePageClick(pageNum: number) {
    setPage(pageNum);
  }
  //
  //
  // Get page numbers for pagination list down
  function getPageNumbers() {
    const pages: (number | string)[] = [];
    //
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // This block to be executed unless the Total Pages > 5
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    //
    return pages;
  }

  //
  //
  //
  //
  //
  return (
    <section className="w-full rounded-lg overflow-hidden border-border border-2">
        {/*  */}
        {/* Colum Title */}
      <header className="grid grid-cols-6 bg-sidebar py-6 px-4 font-bold uppercase text-sm">
        <h2 className="col-span-2">Profile</h2>
        <h2>Role</h2>
        <h2>Schedule</h2>
        <h2 className="text-center">Status</h2>
        <h2 className="text-end">Action</h2>
      </header>
      {/*  */}
      {/*  */}
      {/* List down each RECORD of profile */}
      {/* Main */}
      {staff?.staffs.map((staff) => {
        return (
          <main className="grid grid-cols-6 items-center-safe bg-background-secondary hover:bg-background-secondary-hover px-4 border-t border-border-hover">
            {/* PROFILE */}
            <div className="flex items-center gap-4 col-span-2  py-4">
              <img
                src={staff.image_url || DefaultProfile}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="text-xs font-bold">
                  {staff.name || "User Name"}
                </h3>
                <h5 className="text-[10px]">@{staff.username || "username"}</h5>
                <h3 className="text-[10px] whitespace-normal break-all pr-2">
                  {staff.email || "example@gmail.com"}
                </h3>
              </div>
            </div>
            {/*  */}
            {/* ROLE */}
            <h3 className="text-xs font-bold text-left">{staff.role}</h3>
            {/*  */}
            {/* SCHEDULE */}
            <div className="flex flex-col gap-1">
              <div className="bg-sidebar px-2 py-1 justify-self-center inline-block w-fit rounded-xs">
                <h3 className="text-xs text-white font-bold ">{staff.shift}</h3>
              </div>
              {/* List down woring days */}
              <ul className="flex gap-1 flex-wrap text-[8px]">
                {/* Order day from Mon to Sun not showing random*/}
                {DAY_ORDER.map((day) => {
                  if (!staff.schedules.includes(day)) return null;

                  const config = SCHEDULE_CONFIG[day];
                  return (
                    <li className="bg-sidebar text-white px-1 rounded-xs">
                      {config.label}
                    </li>
                  );
                })}
              </ul>
            </div>
            {/*  */}

            {/*  */}
            {/* STATUS */}
            <div className="flex bg-green-600 justify-self-center px-2 py-1 rounded-xs">
              <span className="text-xs font-bold text-white">
                {staff.status || "Pending..."}
              </span>
            </div>
            {/*  */}
            {/* ACTION */}
            <button className="px-4 py-2 text-white bg-sidebar text-xs justify-self-end rounded-sm font-bold hover:border cursor-pointer">
              Edit
            </button>
          </main>
        );
      })}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      <footer>
        <div className="flex bg-background-secondary justify-between px-6 py-4 border-t-4 border-border">
          {/* PREV */}
          <button
            onClick={handlePrev}
            disabled={!hasPrev}
            className={`${hasPrev ? "cursor-pointer hover:bg-sidebar text-white " : "bg-gray-600 cursor-not-allowed text-gray-900"}  font-semibold px-4 py-2 rounded-md  bg-background-secondary-hover  active:scale-90 transition-all duration-200 ease-out`}
          >
            Prev
          </button>
          {/* 1 2 3 ... 4 */}
          {/* Page Numbers */}
          <div className="flex items-center justify-center gap-2">
            {getPageNumbers().map((pageNum, idx) =>
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
                  className={`px-4 py-2 rounded-md font-bold text-sm transition-all duration-200 cursor-pointer ${pageNum === currentPage ? "bg-green-600 text-white hover:bg-green-500" : "bg-sidebar text-white hover:bg-background-secondary-hover"}`}
                >
                  {pageNum}
                </button>
              ),
            )}
          </div>
          {/*  */}
          {/* NEXT */}
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className={`${hasNext ? "cursor-pointer hover:bg-sidebar text-white " : "bg-gray-600 cursor-not-allowed text-gray-900"} font-semibold px-4 py-2 rounded-md  bg-background-secondary-hover  active:scale-90 transition-all duration-200 ease-out`}
          >
            Next
          </button>
        </div>
      </footer>
      {/*  */}
    </section>
  );
}
