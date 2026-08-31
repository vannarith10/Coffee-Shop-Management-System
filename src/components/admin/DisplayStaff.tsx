//
// components/DisplayStaff.tsx
//
import { useEffect, useRef, useState } from "react";
import DefaultProfile from "../../assets/user-profile.png";
import { UserRoundPen } from "lucide-react";
import type { Staff } from "../../types/staff";
import { DAY_ORDER, SCHEDULE_CONFIG } from "../../types/schedule";
import { ContactRound } from "lucide-react";
import { RotateCcw } from "lucide-react";
import EditStaffProfile from "./EditStaffProfile";
import TextLoader from "../ui/TextLoader";
import { useStaff } from "../../hooks/useGetStaffProfiles";
import { USER_STATUS_COLOR_CONFIG } from "../../types/status";
import { AnimatePresence } from "framer-motion";
import { COLORS } from "../../utils/colors";
import { ROLES } from "../../types/role";
import PageHeader from "../ui/PageHeader";
import { useSearchParams } from "react-router-dom";
import PageFooter from "../ui/PageFooter";

export default function DisplayStaff() {
  const size = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("staffPage") || 1);

  const {
    staff,
    isLoading,
    isError,
    isRefetching,
    refetch,
    justUpdatedId,
    justAddedId,
  } = useStaff({ page, size });
  const currentPage = staff?.pagination.page ?? page;
  const totalPages = staff?.pagination.total_pages ?? 1;
  const totalItems = staff?.pagination.total_items ?? 0;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  function handlePrev() {
    if (hasPrev) {
      setSearchParams((prev) => {
        prev.set("staffPage", String(page - 1));
        return prev;
      });
    }
  }
  //
  function handleNext() {
    if (hasNext) {
      setSearchParams((prev) => {
        prev.set("staffPage", String(page + 1));
        return prev;
      });
    }
  }
  //
  function handlePageClick(pageNum: number) {
    setSearchParams((prev) => {
      prev.set("staffPage", String(pageNum));
      return prev;
    });
  }

  function handleRetry() {
    refetch();
  }

  useEffect(() => {
    if (justAddedId || justUpdatedId) {
      targetRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [justAddedId, justUpdatedId]);

  return (
    <>
      <section className="w-full rounded-lg overflow-hidden border-border border-2">
        {/* -----------------------------------
                      Header
        ------------------------------------ */}
        <PageHeader
          headerIcon={<ContactRound />}
          headerTitle="Employee Profiles"
          isLoading={isLoading}
          isError={isError}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          refetch={refetch}
          isRefetching={isRefetching}
        />

        {/* ================================ */}
        {/* List down each RECORD of profile */}
        {/* MAIN */}
        {/* Render unless isLoading = false */}
        {/* ================================ */}
        {!isLoading && !isError && staff?.staffs.length == 0 ? (
          <div className="w-full flex justify-center items-center py-20 font-bold">
            No data
          </div>
        ) : (
          staff?.staffs.map((staff) => {
            const isUpdated = staff.id === justUpdatedId;
            const justAdded = staff.id === justAddedId;
            const roleColor = COLORS[ROLES.indexOf(staff.role)];
            return (
              <main
                ref={
                  staff.id === justAddedId || staff.id === justUpdatedId
                    ? targetRef
                    : null
                }
                key={staff.id}
                className={`grid grid-cols-5 items-center-safe p-4 gap-4 ${isUpdated || justAdded ? "shimmer shimmer-bg shimmer-color-blue-400 shimmer-duration-2000" : ""} bg-background-secondary  hover:bg-background-secondary-hover px-4 border-t border-border-hover`}
              >
                {/* ====================================== */}
                {/* PROFILE : img, name, username, email */}
                {/* ====================================== */}
                <div className="flex items-start gap-4 col-span-4 ">
                  {/* image */}
                  <img
                    src={staff.image_url || DefaultProfile}
                    alt="profile"
                    className="w-14 h-14 lg:w-14 lg:h-14 rounded-full border-2 border-border object-cover"
                  />
                  {/* ------------------------
                            user info
                  ------------------------- */}
                  <div className="flex flex-col gap-1">
                    <div>
                      {/* name */}
                      <h4 className="text-xs font-bold text-nowrap">
                        {staff.name || "User Name"}
                      </h4>
                      {/* username */}
                      <h5 className="text-[10px] whitespace-normal break-all">
                        @{staff.username || "username"}
                      </h5>
                    </div>

                    {/* status */}
                    <span
                      className={`${USER_STATUS_COLOR_CONFIG[staff.status].background_color} w-fit p-1 px-2 rounded-xs text-[8px] md:text-[10px] lg:text-xs font-bold text-white whitespace-nowrap`}
                    >
                      {(staff.status === "ON_LEAVE"
                        ? "ON LEAVE"
                        : staff.status) || "Pending..."}
                    </span>

                    {/* email */}
                    <span className="text-nowrap text-[10px] whitespace-nowrap break-all ">
                      {staff.email || "example@gmail.com"}
                    </span>
                  </div>
                </div>

                {/* -----------------------
                            Edit
                ------------------------ */}
                <button
                  onClick={() => setSelectedStaff(staff)}
                  className="self-start px-2 py-1 text-white bg-sidebar/50 justify-self-end  rounded-sm font-bold border border-border hover:border-border-hover cursor-pointer"
                >
                  <UserRoundPen />
                </button>

                {/* ------------------------------------
                        Role & Shift & Schedules
                ------------------------------------- */}
                <div className="row-start-2 col-span-5 flex gap-1 ">
                  <div className="flex flex-col gap-1">
                    {/* Role */}
                    <h5
                      style={{ backgroundColor: roleColor }}
                      className={` text-[8px] md:text-[10px] lg:text-xs inline-flex justify-center items-center px-2 py-1 rounded-xs font-bold text-left`}
                    >
                      {staff.role}
                    </h5>
                    {/* shift type */}
                    <h3 className="bg-green-600 flex items-center px-2 py-1 rounded-xs text-[8px] md:text-[10px] lg:text-xs text-white font-bold whitespace-nowrap break-all">
                      {staff.shift.replace("_", " ")}
                    </h3>
                  </div>

                  {/* ----------------------------------- */}
                  {/* SCHEDULE */}
                  {/* List down working days */}
                  {/* ----------------------------------- */}
                  <ul className="w-full flex gap-1 flex-wrap text-[8px] ">
                    {/* Order day from Mon to Sun not showing random*/}
                    {DAY_ORDER.map((day) => {
                      if (!staff.schedules.includes(day)) return null;
                      const config = SCHEDULE_CONFIG[day];
                      return (
                        <li
                          key={config.label}
                          className="flex items-center bg-sidebar text-white px-4 rounded-xs font-bold  "
                        >
                          {config.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </main>
            );
          })
        )}
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

        {/* ------------------------------------
                      Footer
                    Prev & Next
        ------------------------------------- */}
        <PageFooter
          handlePrev={handlePrev}
          handleNext={handleNext}
          hasPrev={hasPrev}
          hasNext={hasNext}
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageClick={handlePageClick}
        />
      </section>

      {/* =============================== */}
      {/* */}
      {/* FORM: Open Form Edit */}
      {/* */}
      {/* =============================== */}
      <AnimatePresence>
        {selectedStaff && (
          <EditStaffProfile
            isOpen={true}
            staff={selectedStaff}
            onClose={() => {
              setSelectedStaff(null);
              document.body.classList.remove("overflow-hidden");
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
