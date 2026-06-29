// components/EditStaffProfile.tsx
//

import type { EditStaffDataRequest, Staff } from "../types/staff";
import DefaultProfile from "../assets/user-profile.png";
import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../util/crop-helper";
import type { Area } from "react-easy-crop";
import { DAY_ORDER, type Schedule } from "../types/schedule";
import { SHIFT_ORDER, type Shift } from "../types/shift";
import { editStaffDetail } from "../services/admin.service";
import { base64ToFile } from "../util/convertor";
import { ROLES, type Role } from "../types/role";
import { STATUSES, type Status } from "../types/status";
import { toast } from "sonner";
import TextLoader from "./ui/TextLoader";

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
  const [phone, setPhone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
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
  // TEACK CROP AREA
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
      if (response.status == 200) {
        toast.success("Staff profile updated successfully", { duration: 3000 });
        setIsLoading(false);
        onClose();
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      toast.error("Error updating staff profile", { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <section
      onClick={onClose}
      className="fixed inset-0 z-30 bg-black/10 backdrop-blur-xs flex justify-center items-center"
    >
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-[80vw] overflow-y-auto scrollbar-hide flex flex-col gap-10 items-center p-6 bg-background-secondary rounded-2xl border-4 border-border"
      >
        {/* IMAGE */}
        <div>
          {/* CLICKABLE IMAGE */}
          <label htmlFor="imageUpload" className="cursor-pointer">
            <div className="w-40 h-40 xl:w-60 xl:h-60 rounded-md overflow-hidden border-2 border-border hover:border-border-hover">
              <img
                src={preview}
                alt="profile"
                className="w-full h-full object-cover "
              />
            </div>
          </label>

          {/* HIDDEN FILE INPUT */}
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>


        {/*  */}
        {/* TEXT FIELDS */}
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
        {/*  */}
          {/* SCHEDULES */}
          {/* WORKING DAYS */}
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
          {/*  */}
          {/* WORKING TIMES */}
          {/* SHIFTS */}
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
          {/*  */}
          {/* ROLE */}
          {/* STAFF ROLE */}
          <div className="flex flex-col gap-2">
            <label htmlFor="shift" className="text-xs font-bold">
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
          {/*  */}
          {/* USER STATUS */}
          {/* STATUS */}
          <div className="flex flex-col gap-2">
            <label htmlFor="shift" className="text-xs font-bold">
              STATUS
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATUSES.map((status) => {
                const isCurrentStatus = status === currentStatus;
                const isSelected = status === selectedStatus;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleSelectStatus(status)}
                    className={`relative py-4 text-xs ${isSelected ? "bg-green-600" : "bg-background-secondary"} outline-none font-semibold rounded-md border-2 border-border hover:border-border-hover cursor-pointer active:scale-110 transition-all duration-200 ease-out`}
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
        {/*  */}
        {/*  */}
        {/* BUTTONS: CANCEL & SUBMIT */}
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
            className={`col-span-2 ${isError? "bg-amber-600":"bg-green-600"} text-lg font-bold py-4 border-2 border-border rounded-md hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-100 ease-out`}
          >
            {isError ? "Try again" : (isLoading && !isError) ? <TextLoader text="Submitting..."/> : "Submit"}
          </button>
        </div>
      </form>
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/* THIS WILL SHOW ONLY WHEN INPUT IMAGE RUNS */}
      {/* CROP MODAL */}
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
                  setZoom(1);
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
