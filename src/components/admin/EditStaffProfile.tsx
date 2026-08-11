// components/EditStaffProfile.tsx
//

import type { EditStaffDataRequest, Staff } from "../../types/staff";
import DefaultProfile from "../../assets/user-profile.png";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/crop-helper";
import type { Area } from "react-easy-crop";
import { DAY_ORDER, type Schedule } from "../../types/schedule";
import { SHIFT_ORDER, type Shift } from "../../types/shift";
import { editStaffDetail } from "../../services/admin.service";
import { base64ToFile } from "../../utils/convertor";
import { ROLES, type Role } from "../../types/role";
import {
  STATUSES,
  USER_STATUS_COLOR_CONFIG,
  type Status,
} from "../../types/status";
import { toast } from "sonner";
import TextLoader from "../ui/TextLoader";
import { Feather, Image, Trash2, X } from "lucide-react";
import { useDeleteStaff } from "../../hooks/useDeleteStaff";

interface UpdateStaffProfile {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff;
}

export default function EditStaffProfile({
  isOpen,
  onClose,
  staff,
}: UpdateStaffProfile) {
  const { mutate: deleteStaff, isPending } = useDeleteStaff();
  const [isDeletingStaff, setIsDeletingStaff] = useState(false);
  // SCHEDULES & SHIFT STATE
  const currentSchedules = staff.schedules; // EX: ['SATURDAY', 'THURSDAY', 'WEDNESDAY', 'TUESDAY', 'MONDAY']
  const [schedules, setSchedules] = useState<Schedule[]>(currentSchedules);
  const currentShift = staff.shift;
  const [selectedShift, setSelectedShift] = useState<Shift>(currentShift);
  // ROLE
  const currentRole = staff.role;
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole);
  // STATUS
  const currentStatus = staff.status;
  const [selectedStatus, setSelectedStatus] = useState<Status>(currentStatus);
  // INFORMATIONS
  const userId = staff.id;
  const [name, setName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  //
  const [phone, setPhone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  //
  // IMAGE PREVIEW
  const [preview, setPreview] = useState(staff?.image_url || DefaultProfile);
  // CROP STATE
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [file, setFile] = useState<File | null>(null);
  // OPERATIONS
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  //
  // DISABLE SCROLLING WHEN OPEN THIS FORM
  if (isOpen) {
    document.body.classList.add("overflow-hidden");
  }
  //
  //
  // FILE SELECT -> OPEN CROP
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };
  //
  // TRACK CROP AREA
  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);
  //
  // APPLY CROP
  // HANDLE CROP
  async function handleCrop() {
    if (!image || !croppedAreaPixels) {
      return;
    }
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    setPreview(croppedImage);
    //
    // Convert to file
    const file = base64ToFile(croppedImage, "profile.jpg");
    setFile(file);

    setZoom(1);
    setImage(null); // Close modal
  }
  //
  //
  // HANDLE SELECT WORKING DAYS
  function handleSelectWorkingDay(day: Schedule) {
    // If already selected then remove, else add to working days.
    setSchedules((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }
  //
  //
  // HANDLE SELECT SHIFT
  function handleSelectShift(shift: Shift) {
    setSelectedShift(shift);
  }
  //
  // HANDLE SELECT ROLE
  function handleSelectRole(role: Role) {
    setSelectedRole(role);
  }
  //
  // HANDLE SELECT STATUS
  function handleSelectStatus(status: Status) {
    setSelectedStatus(status);
  }
  //
  //
  // SHOW NOTHING IF FORM IS NOT OPENED
  if (!open) return null;
  //
  //

  // HANDLE SUBMIT
  // HANDLE UPDATE STAFF PROFILE
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    //
    const data: EditStaffDataRequest = {
      name: name,
      username: username,
      password: password,
      role: selectedRole,
      status: selectedStatus,
      shift_type: selectedShift,
      schedules: schedules,
    };

    setIsLoading(true);
    setIsError(false);
    try {
      const response = await editStaffDetail({ userId, data, file });
      setIsLoading(false);
      if (response.status == 200) onClose();
    } catch (error) {
      console.error(error);
      setIsError(true);
      toast.error("Error updating staff profile", { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  }

  function handleDeleteStaff() {
    deleteStaff(staff.id, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  return (
    <section
      onClick={onClose}
      className="fixed inset-0 z-30 bg-black/10 backdrop-blur-lg flex justify-center items-center"
    >
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-[80vw] overflow-y-auto scrollbar-hide flex flex-col gap-10 items-center p-10 bg-background-secondary-hover rounded-xl border-4 border-white"
      >
        {/* ------------------ */}
        {/* Form Title */}
        {/* ------------------ */}
        <div className="w-full flex justify-between items-start">
          <div>
            <h2 className="font-bold text-2xl ">Edit Staff Account</h2>
            <p className="text-xs text-text-secondary">
              Fill in the details to edit a staff account.
            </p>
          </div>
          {/* ------------ */}
          {/* Button close */}
          {/* ------------ */}
          <button
            type="button"
            onClick={() => setTimeout(() => onClose(), 200)}
            className="w-10 flex justify-center items-center aspect-square rounded-full border-2 border-border hover:rotate-90 hover:border-border-hover active:scale-70 active:border-text-error outline-none transition-all duration-200 ease-out"
          >
            <X />
          </button>
        </div>
        {/* --------------------------- */}
        {/* IMAGE */}
        {/* --------------------------- */}
        <div>
          {/* CLICKABLE IMAGE */}
          <label htmlFor="imageUpload" className="cursor-pointer">
            <div className="relative w-40 h-40 xl:w-60 xl:h-60 rounded-md overflow-hidden border-2 border-border hover:border-border-hover">
              <img
                src={preview}
                alt="profile"
                className="w-full h-full object-cover "
              />
              <span className="absolute hover:bg-gray-400/50 backdrop-blur-xs rounded-md opacity-0 hover:opacity-100 w-full h-full flex justify-center items-center z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-700">
                <Image size={48} />
              </span>
            </div>
          </label>

          {/* Image input */}
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>

        {/* =================================== */}
        {/* TEXT FIELDS */}
        {/* =================================== */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* NAME */}
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="name" className="text-xs font-bold">
              NAME
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              placeholder={staff.name}
              type="text"
              className="border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
            />
          </div>
          {/* USERNAME */}
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="username" className="text-xs font-bold">
              USERNAME
            </label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              placeholder={staff.username}
              type="text"
              className="border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
            />
          </div>
          {/* PHONE */}
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="phone" className="text-xs font-bold">
              PHONE
            </label>
            <input
              onChange={(e) => setPhone(e.target.value)}
              placeholder={staff.phone_number}
              type="text"
              className="border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
            />
          </div>
          {/* EMAIL */}
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="email" className="text-xs font-bold">
              EMAIL
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              placeholder={staff.email}
              type="text"
              className="border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
            />
          </div>
        </div>
        {/*  */}
        {/*  */}
        {/* ============================== */}
        {/* SCHEDULES */}
        {/* WORKING DAYS */}
        {/* ============================== */}
        <div className="w-full flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <label htmlFor="schedules" className="text-xs font-bold">
              SCHEDULES
            </label>
            <div className="flex flex-wrap gap-4">
              {DAY_ORDER.map((day) => {
                const isSelected = schedules.includes(day);
                const isCurrentSchedule = currentSchedules.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectWorkingDay(day)}
                    className={`relative ${isSelected ? "bg-green-600" : "bg-background-secondary"} outline-none px-8 py-4 text-xs font-semibold border-2 border-border cursor-pointer hover:border-border-hover rounded-md active:scale-110 transition-all duration-200 ease-out`}
                  >
                    {day}
                    {isCurrentSchedule && (
                      <span className="absolute pointer-events-none text-[8px] bottom-0 left-2 translate-y-1/2 px-2 py-1 rounded-sm bg-background-secondary border-2 border-border">
                        Current Schedule
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          {/* ============================== */}
          {/* WORKING TIMES */}
          {/* SHIFTS */}
          {/* ============================== */}
          <div className="flex flex-col gap-2">
            <label htmlFor="shift" className="text-xs font-bold">
              SHIFT
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SHIFT_ORDER.map((shift) => {
                const isCurrentShift = shift === currentShift;
                const isSelected = shift === selectedShift;
                return (
                  <button
                    key={shift}
                    type="button"
                    onClick={() => handleSelectShift(shift)}
                    className={`relative py-4 text-xs ${isSelected ? "bg-green-600" : "bg-background-secondary"} outline-none font-semibold rounded-md border-2 border-border hover:border-border-hover cursor-pointer active:scale-110 transition-all duration-200 ease-out`}
                  >
                    {shift === "FULL_DAY" ? "FULL DAY" : shift}
                    {/* Show current shift label */}
                    {isCurrentShift && (
                      <span className="absolute pointer-events-none text-[8px] bottom-0 left-2 translate-y-1/2 px-2 py-1 rounded-sm bg-background-secondary border-2 border-border">
                        Current Shift
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          {/* ============================== */}
          {/* ROLE */}
          {/* STAFF ROLE */}
          {/* ============================== */}
          <div className="flex flex-col gap-2">
            <label htmlFor="role" className="text-xs font-bold">
              ROLE
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ROLES.map((role) => {
                const isCurrentRole = role === currentRole;
                const isSelected = role === selectedRole;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleSelectRole(role)}
                    className={`relative py-4 text-xs ${isSelected ? "bg-green-600" : "bg-background-secondary"} outline-none font-semibold rounded-md border-2 border-border hover:border-border-hover cursor-pointer active:scale-110 transition-all duration-200 ease-out`}
                  >
                    {role}
                    {/* Show current shift label */}
                    {isCurrentRole && (
                      <span className="absolute pointer-events-none text-[8px] bottom-0 left-2 translate-y-1/2 px-2 py-1 rounded-sm bg-background-secondary border-2 border-border">
                        Current Role
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          {/* ================================== */}
          {/* USER STATUS */}
          {/* STATUS */}
          {/* ================================== */}
          <div className="flex flex-col gap-2">
            <label htmlFor="shift" className="text-xs font-bold">
              STATUS
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATUSES.map((status) => {
                const isCurrentStatus = status === currentStatus;
                const isSelected = status === selectedStatus;
                const config =
                  selectedStatus && USER_STATUS_COLOR_CONFIG[selectedStatus];
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleSelectStatus(status)}
                    className={`relative py-4 text-xs ${isSelected ? config.background_color : "bg-background-secondary"} outline-none font-semibold rounded-md border-2 border-border hover:border-border-hover cursor-pointer active:scale-110 transition-all duration-200 ease-out`}
                  >
                    {status === "ON_LEAVE" ? "ON LEAVE" : status}
                    {/* Show current shift label */}
                    {isCurrentStatus && (
                      <span className="absolute pointer-events-none text-[8px] bottom-0 left-2 translate-y-1/2 px-2 py-1 rounded-sm bg-background-secondary border-2 border-border">
                        Current Status
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* ======================================= */}
        {/* Button Delete */}
        {/* ======================================= */}
        <div className="w-full border-t border-border pt-4">
          <button
            type="button"
            onClick={() => setIsDeletingStaff(true)}
            className="flex gap-2 items-center px-8 py-4 bg-text-error/70 hover:bg-text-error rounded-md cursor-pointer outline-none active:scale-80 transition-all duration-300 ease-out"
          >
            <Trash2 /> Delete Account
          </button>
        </div>
        {/* ======================================= */}
        {/* BUTTONS: CANCEL & SUBMIT */}
        {/* ======================================= */}
        <div className="w-full grid grid-cols-3 gap-6 pt-6">
          <button
            type="button"
            onClick={() => onClose()}
            className="bg-gray-600/50 text-lg font-bold py-4 border-2 border-border rounded-md hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-100 ease-out"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`col-span-2 ${isError ? "bg-amber-600" : "bg-green-600"} text-lg font-bold py-4 border-2 border-border rounded-md hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-100 ease-out`}
          >
            {isError ? (
              "Try again"
            ) : isLoading && !isError ? (
              <TextLoader text="Submitting..." />
            ) : (
              "Submit"
            )}
          </button>
        </div>

        {/* ========================================== */}
        {/* ========================================== */}
        {/* Delete Staff Dialog Box */}
        {/* ========================================== */}
        {/* ========================================== */}
        {isDeletingStaff && (
          <div className="fixed inset-0 z-100 backdrop-blur-xs flex justify-center items-center">
            <div className="w-60 flex flex-col gap-4 items-center rounded-xl p-10 border-2 border-white bg-sidebar">
              <div className="p-4 bg-background-secondary-hover rounded-full">
                <Trash2 />
              </div>
              <h2 className="font-bold text-xl whitespace-nowrap">
                Delete Staff?
              </h2>
              {/* ------------- */}
              {/* Button Delete */}
              {/* ------------- */}
              <button
                type="button"
                onClick={handleDeleteStaff}
                disabled={isPending}
                className="font-bold w-full py-2 text-text-secondary border border-border hover:border-border-hover rounded-md bg-text-error/50 hover:bg-text-error cursor-pointer active:scale-80 transition-all duration-300 ease-out outline-none"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
              {/* ------------- */}
              {/* Button Cancel */}
              {/* ------------- */}
              <button
                type="button"
                onClick={() => {
                  setIsDeletingStaff(false);
                  document.body.classList.remove("overflow-hidden");
                }}
                className="font-bold w-full py-2 text-text-secondary border border-border hover:border-border-hover rounded-md bg-background-secondary-hover/50 hover:bg-background-secondary-hover cursor-pointer active:scale-80 transition-all duration-300 ease-out outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </form>
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/* ================================================= */}
      {/* THIS WILL SHOW ONLY WHEN INPUT IMAGE RUNS */}
      {/* CROP MODAL */}
      {/* ================================================= */}
      {image && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 backdrop-blur-sm bg-background-primary flex flex-col items-center justify-center"
        >
          <div className="relative w-80 h-80 xl:h-100 xl:w-100 bg-white border-4 border-border">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="mt-10 flex flex-col items-center gap-4">
            <input
              className="w-80 outline-none cursor-grab"
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setZoom(1);
                }}
                className="px-4 py-2 bg-background-primary border border-border cursor-pointer hover:bg-background-primary-hover text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleCrop();
                }}
                className="px-10 py-2 bg-background-secondary text-white rounded-md cursor-pointer hover:bg-background-secondary-hover border border-border"
              >
                Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
