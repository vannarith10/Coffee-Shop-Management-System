// components/DisplayStaff.tsx
//
import { useState } from "react";
import DefaultProfile from "../../assets/user-profile.png";
import { UserRoundPen } from "lucide-react";
import type { Staff } from "../../types/staff";
import { DAY_ORDER, SCHEDULE_CONFIG } from "../../types/schedule";
import { Ellipsis } from "lucide-react";
import { ContactRound } from "lucide-react";
import { RotateCcw } from "lucide-react";
import EditStaffProfile from "./EditStaffProfile";
import TextLoader from "../ui/TextLoader";
import { getPageNumbers } from "../../utils/page-numbers";
import { useStaff } from "../../hooks/useStaff";
import { USER_STATUS_COLOR_CONFIG } from "../../types/status";

export default function DisplayStaff() {
  const [page, setPage] = useState(1);
  const size = 20;
  const { staff, isLoading, isError, isRefetching, refetch, justUpdatedId } =
    useStaff({ page, size });
  const currentPage = staff?.pagination.page ?? page;
  const totalPages = staff?.pagination.total_pages ?? 1;
  const totalItems = staff?.pagination.total_items ?? 0;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

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

  function handleRetry() {
    refetch();
  }

  return (
    <>
      <section className="w-full rounded-lg overflow-hidden border-border border-2">
        {/* ======================== */}
        {/* HEADER */}
        {/* ======================== */}
        <header>
          {/* Icon & Pagination Info */}
          <div className="w-full p-6 flex justify-between items-center bg-background-secondary-hover">
            <div className="flex gap-4">
              <ContactRound />
              <h3 className="font-semibold">Employee Profiles</h3>
            </div>
            {/*  */}
            {/* Pages and Items */}
            {!isLoading && !isError && (
              <div className="flex gap-4">
                <div>
                  <h4 className="font-semibold text-xs text-text-secondary">
                    Page {currentPage} of {totalPages}
                  </h4>
                  <h4 className="font-semibold text-sm">
                    Profiles: {totalItems}
                  </h4>
                </div>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 flex gap-2 font-semibold bg-background-secondary rounded-lg cursor-pointer active:scale-80 transition-all duration-200 ease-out outline-none"
                >
                  {isRefetching ? (
                    "Syncing..."
                  ) : (
                    <>
                      Refresh <RotateCcw />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          {/* ========================= */}
          {/* Colum Titles */}
          {/* ========================= */}
          <div className="grid grid-cols-6 bg-sidebar py-4 px-4 font-bold uppercase text-sm">
            <h2 className="col-span-2">Profile</h2>
            <h2 className="text-center">Role</h2>
            <h2>Schedule</h2>
            <h2 className="text-center">Status</h2>
            <h2 className="text-end">Action</h2>
          </div>
        </header>
        {/* ================================ */}
        {/* List down each RECORD of profile */}
        {/* MAIN */}
        {/* Render unless isLoading = false */}
        {/* ================================ */}
        {!isLoading &&
          staff?.staffs.map((staff) => {
            const isUpdated = staff.id === justUpdatedId;
            return (
              <main
                key={staff.id}
                className={`grid grid-cols-6 items-center-safe ${isUpdated ? "bg-green-700 hover:bg-green-600" : "bg-background-secondary "} hover:bg-background-secondary-hover px-4 border-t border-border-hover`}
              >
                {/* ====================================== */}
                {/* PROFILE : img, name, username, email */}
                {/* ====================================== */}
                <div className="flex items-center gap-4 col-span-2  py-4">
                  <img
                    src={staff.image_url || DefaultProfile}
                    alt="profile"
                    className="w-10 h-10 lg:w-14 lg:h-14 rounded-full border-2 border-border object-cover"
                  />
                  <div>
                    <h3 className="text-xs font-bold">
                      {staff.name || "User Name"}
                    </h3>
                    <h5 className="text-[10px] whitespace-normal break-all">
                      @{staff.username || "username"}
                    </h5>
                    <h3 className="text-[10px] whitespace-normal break-all pr-2">
                      {staff.email || "example@gmail.com"}
                    </h3>
                  </div>
                </div>
                {/* ------------------- */}
                {/* ROLE */}
                {/* ------------------- */}
                <h3 className="text-[8px] md:text-[10px] lg:text-xs bg-amber-600 inline-flex justify-self-center px-2 py-1 rounded-xs font-bold text-left">
                  {staff.role}
                </h3>
                {/* --------------------- */}
                {/* SHIFT */}
                {/* --------------------- */}
                <div className="flex flex-col gap-1">
                  <div className="bg-sidebar px-2 py-1 justify-self-center inline-block w-fit rounded-xs">
                    <h3 className="text-[8px] md:text-[10px] lg:text-xs text-white font-bold whitespace-nowrap break-all">
                      {staff.shift === "FULL_DAY" ? "FULL DAY" : staff.shift}
                    </h3>
                  </div>
                  {/* ----------------------------------- */}
                  {/* SCHEDULE */}
                  {/* List down working days */}
                  {/* ----------------------------------- */}
                  <ul className="flex gap-1 flex-wrap text-[8px]">
                    {/* Order day from Mon to Sun not showing random*/}
                    {DAY_ORDER.map((day) => {
                      if (!staff.schedules.includes(day)) return null;

                      const config = SCHEDULE_CONFIG[day];
                      return (
                        <li
                          key={config.label}
                          className="bg-sidebar text-white px-1 rounded-xs"
                        >
                          {config.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {/*  */}

                {/* ------------------------ */}
                {/* STATUS */}
                {/* ------------------------ */}
                <div
                  className={`flex ${USER_STATUS_COLOR_CONFIG[staff.status].background_color} justify-self-center px-2 py-1 rounded-xs`}
                >
                  <span className="text-[8px] md:text-[10px] lg:text-xs font-bold text-white whitespace-nowrap">
                    {(staff.status === "ON_LEAVE"
                      ? "ON LEAVE"
                      : staff.status) || "Pending..."}
                  </span>
                </div>
                {/* ================================ */}
                {/* ACTION | Button */}
                {/* EDIT */}
                {/* ================================ */}
                <button
                  onClick={() => setSelectedStaff(staff)}
                  className="px-2 py-1 text-white bg-sidebar/50 justify-self-end rounded-sm font-bold border-2 border-border hover:border-border-hover cursor-pointer"
                >
                  <UserRoundPen />
                </button>
              </main>
            );
          })}
        {/* ------------------------- */}
        {/* Handle Loading */}
        {/* ------------------------- */}
        {isLoading && !isError && (
          <div className="flex justify-center items-center w-full p-20 text-xl bg-background-secondary">
            <TextLoader text="Loading Profiles..." />
          </div>
        )}
        {/* ---------------------------------- */}
        {/* Hanlde Error and Retry */}
        {/* ---------------------------------- */}
        {isError && (
          <div className="w-full py-10 bg-background-secondary flex flex-col justify-center items-center gap-4">
            <p className="text-lg font-semibold text-text-error">
              Failed to load product stock data. Please try again.
            </p>
            <button
              onClick={handleRetry}
              className="bg-background-secondary-hover font-bold py-2 px-4 rounded-md flex gap-2 hover:bg-sidebar cursor-pointer active:scale-80 transition-all duration-200 ease-out"
            >
              Retry <RotateCcw />
            </button>
          </div>
        )}
        {/* ================= */}
        {/* FOOTER */}
        {/* ================= */}
        <footer>
          <div className="flex bg-background-secondary justify-between px-6 py-4 border-t-4 border-border">
            {/* =================== */}
            {/* PREV */}
            {/* =================== */}
            <button
              onClick={handlePrev}
              disabled={!hasPrev}
              className={`${hasPrev ? "cursor-pointer hover:bg-sidebar text-white " : "bg-gray-600 cursor-not-allowed text-gray-900"}  font-semibold px-4 py-2 rounded-md  bg-background-secondary-hover  active:scale-90 transition-all duration-200 ease-out`}
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
                    className={`px-4 py-2 rounded-md font-bold text-sm transition-all duration-200 cursor-pointer ${pageNum === currentPage ? "bg-green-600 text-white hover:bg-green-500" : "bg-sidebar text-white hover:bg-background-secondary-hover"}`}
                  >
                    {pageNum}
                  </button>
                ),
              )}
            </div>
            {/* ================= */}
            {/* NEXT */}
            {/* ================= */}
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

      {/* =============================== */}
      {/* =============================== */}
      {/* FORM: Open Form Edit */}
      {/* =============================== */}
      {/* =============================== */}
      {selectedStaff && (
        <EditStaffProfile
          isOpen={true}
          onClose={() => {
            setSelectedStaff(null);
            document.body.classList.remove("overflow-hidden");
          }}
          staff={selectedStaff}
        />
      )}
    </>
  );
}
