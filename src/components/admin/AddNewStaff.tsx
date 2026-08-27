//
// components/AddNewStaff.tsx
//
import { SquarePlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import TextLoader from "../ui/TextLoader";
import { ROLES, type Role } from "../../types/role";
import { SHIFT_ORDER, type Shift } from "../../types/shift";
import {
  STATUSES,
  USER_STATUS_COLOR_CONFIG,
  type Status,
} from "../../types/status";
import { DAY_ORDER, type Schedule } from "../../types/schedule";
import ImageCropForm from "../ui/ImageCropForm";
import DefaultProfile from "../../assets/user-profile.png";
import type { Area } from "react-easy-crop";
import { getCroppedImg } from "../../utils/crop-helper";
import { base64ToFile } from "../../utils/convertor";
import { toast } from "sonner";
import type { CreateStaffRequest } from "../../types/staff";
import { Image } from "lucide-react";
import { useCreateStaff } from "../../hooks/useCreateStaff";
import MyPopupForm from "../animation/MyPopupForm";
import { AnimatePresence } from "framer-motion";
import FormHeader from "../animation/FormHeader";
import PasswordInput from "../ui/PasswordInput";

export default function AddNewStaff() {
  const { mutate: createStaff, isPending, isError } = useCreateStaff();
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);

    // Clear memory
    setStaffName(null);
    setUsername(null);
    setPassword(null);
    setConfirmPassword(null);
    setSchedules([]);
    setImage(null);
    setPreview(DefaultProfile);
    setSelectedRole(null);
    setSelectedShift(null);
    setSelectedStatus(null);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const [staffName, setStaffName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const handleSelectSchedule = (day: Schedule) => {
    setSchedules((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>(DefaultProfile);

  const handleInputImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  // CROP STATE
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // ==========================
  // Handle Crop
  // ==========================
  const handleCrop = async () => {
    if (!image || !croppedAreaPixels) {
      return;
    }
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    setPreview(croppedImage);

    // Convert to file in order to send to backend
    const file = base64ToFile(croppedImage, "profile.jpg");
    setFile(file);

    setZoom(1);
    setImage(null);
  };

  // ============================
  // Handle Cance crop
  // ============================
  const handleCancelCrop = () => {
    setImage(null);
    setZoom(1);
  };

  // =========================
  // Handle Set Zoom
  // =========================
  const handleSetZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(Number(e.target.value));
  };

  // =====================
  // Complete crop
  // =====================
  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // =====================================================
  // Handle Submit Form
  // =====================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Name check
    if (staffName == null) {
      toast.warning("Please input NAME", { duration: 3000 });
      return;
    }
    // Username check
    if (username == null) {
      toast.warning("Please input USERNAME", { duration: 3000 });
      return;
    }
    // Password check
    if (password == null) {
      toast.warning("Please set PASSWORD", { duration: 3000 });
      return;
    }

    // Confirm password check
    if (confirmPassword == null) {
      toast.warning("Please confirm passowrd", { duration: 3000 });
      return;
    }
    if (confirmPassword !== password) {
      toast.warning("Wrong confirm password", { duration: 3000 });
      return;
    }

    // Schedules check
    if (schedules.length < 1) {
      toast.warning("Please select at least one schedule", { duration: 3000 });
      return;
    }

    // Role check
    if (selectedRole == null) {
      toast.warning("Please select a ROLE", { duration: 3000 });
      return;
    }

    // Shift check
    if (selectedShift == null) {
      toast.warning("Please select a SHIFT", { duration: 3000 });
      return;
    }

    // Status check
    if (selectedStatus == null) {
      toast.warning("Please select a STATUS", { duration: 3000 });
      return;
    }

    // Image check
    if (file == null) {
      toast.warning("Image profile needed", { duration: 3000 });
      return;
    }

    // Build data
    const data: CreateStaffRequest = {
      full_name: staffName,
      username: username,
      password: password,
      role: selectedRole,
      shift: selectedShift,
      schedules: schedules,
      status: selectedStatus,
    };

    createStaff(
      { data: data, image: file },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <>
      <section className="w-full flex justify-end">
        <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4">
          {/* ===================== */}
          {/* Button Add */}
          {/* ===================== */}
          <button
            onClick={() => setIsOpen(true)}
            className="col-start-2 lg:col-start-3 flex justify-center gap-2 items-center bg-background-secondary py-4 rounded-lg border-2 border-border font-bold hover:bg-background-secondary-hover hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-200 ease-out outline-none"
          >
            Add Staff <SquarePlus />
          </button>
        </div>
      </section>
      {/* ========================= */}
      {/* Form */}
      {/* ========================= */}
      <AnimatePresence>
        {isOpen && (
          <MyPopupForm key={"add-staff-modal"} onClose={onClose}>
            <div>
              <form
                onSubmit={(e) => handleSubmit(e)}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-6 overflow-y-scroll scrollbar-hide w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[70vw] max-w-[90vw] max-h-[90vh] bg-background-primary border-4 border-border shimmer shimmer-bg shimmer-color-blue-300/30 shimmer-duration-9000"
              >
                {/* ------------------ */}
                {/* Form Title */}
                {/* ------------------ */}
                <FormHeader
                  title="Add New Staff"
                  onClose={onClose}
                  className="sticky top-0 z-100"
                />

                {/* =================================== */}
                {/* Input fields */}
                {/* Inputs container */}
                {/* =================================== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  {/*  */}
                  {/*  */}
                  {/* ========================== */}
                  {/* Left Side Container */}
                  {/* ========================== */}
                  {/*  */}
                  {/*  */}
                  <div className="flex flex-col gap-4">
                    {/* ------------------- */}
                    {/* Name */}
                    {/* ------------------- */}
                    <div className="flex flex-col w-full gap-2">
                      <label htmlFor="name" className="text-xs font-bold">
                        NAME
                      </label>
                      <input
                        spellCheck={false}
                        onChange={(e) => setStaffName(e.target.value)}
                        placeholder="Vyra Vannarith"
                        type="text"
                        className="placeholder:text-sm placeholder:font-semibold border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
                      />
                    </div>
                    {/* ---------------------- */}
                    {/* Username */}
                    {/* ---------------------- */}
                    <div className="flex flex-col w-full gap-2">
                      <label htmlFor="name" className="text-xs font-bold">
                        USERNAME
                      </label>
                      <input
                        spellCheck={false}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="vyra.vannarith"
                        type="text"
                        className="placeholder:text-sm lowercase placeholder:font-semibold border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
                      />
                    </div>
                    {/* ------------------------ */}
                    {/* Password */}
                    {/* ------------------------ */}
                    <div className="flex flex-col w-full gap-2">
                      <label htmlFor="name" className="text-xs font-bold">
                        PASSWORD
                      </label>
                      <PasswordInput onChange={setPassword} value={password} />
                    </div>
                    {/* ----------------------------- */}
                    {/* Confirm Password */}
                    {/* ----------------------------- */}
                    <div className="flex flex-col w-full gap-2">
                      <label htmlFor="name" className="text-xs font-bold">
                        CONFIRM PASSWORD
                      </label>
                      <PasswordInput
                        onChange={setConfirmPassword}
                        value={confirmPassword}
                      />
                    </div>
                    {/* -------------------------------- */}
                    {/* Schedules */}
                    {/* -------------------------------- */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="schedules" className="text-xs font-bold">
                        SCHEDULES
                      </label>
                      <div className="grid grid-cols-3 xl:grid-cols-4 gap-4">
                        {DAY_ORDER.map((day) => {
                          const isSelected = schedules.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleSelectSchedule(day)}
                              className={`${isSelected ? "bg-green-600" : "bg-background-secondary"} outline-none py-4 text-xs font-semibold border-2 border-border cursor-pointer hover:border-border-hover rounded-md active:scale-110 transition-all duration-200 ease-out`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {/* ========================== */}
                  {/* Right Side Container */}
                  {/* ========================== */}
                  {/*  */}
                  {/*  */}
                  {/*  */}
                  <div className="flex flex-col gap-6 ">
                    {/* --------------------------- */}
                    {/* IMAGE Input*/}
                    {/* --------------------------- */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="role" className="text-xs font-bold">
                        IMAGE
                      </label>
                      {/* CLICKABLE IMAGE */}
                      <label
                        htmlFor="imageUpload"
                        className="cursor-pointer w-fit"
                      >
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
                        onChange={handleInputImage}
                        className="hidden"
                      />
                    </div>
                    {/* ---------------------- */}
                    {/* Role */}
                    {/* ---------------------- */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="role" className="text-xs font-bold">
                        ROLE
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ROLES.map((role) => {
                          const isSelected = role === selectedRole;
                          return (
                            <button
                              key={role}
                              type="button"
                              onClick={() => setSelectedRole(role)}
                              className={`relative py-4 text-xs ${isSelected ? "bg-green-600" : "bg-background-secondary"} outline-none font-semibold rounded-md border-2 border-border hover:border-border-hover cursor-pointer active:scale-110 transition-all duration-200 ease-out`}
                            >
                              {role}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {/* ------------------------ */}
                    {/* Shift */}
                    {/* ------------------------ */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="shift" className="text-xs font-bold">
                        SHIFT
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {SHIFT_ORDER.map((shift) => {
                          const isSelected = shift === selectedShift;
                          return (
                            <button
                              key={shift}
                              type="button"
                              onClick={() => setSelectedShift(shift)}
                              className={`relative py-4 text-xs ${isSelected ? "bg-green-600" : "bg-background-secondary"} outline-none font-semibold rounded-md border-2 border-border hover:border-border-hover cursor-pointer active:scale-110 transition-all duration-200 ease-out`}
                            >
                              {shift === "FULL_DAY" ? "FULL DAY" : shift}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {/* ---------------------- */}
                    {/* Status */}
                    {/* ---------------------- */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="shift" className="text-xs font-bold">
                        STATUS
                      </label>
                      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                        {STATUSES.map((status) => {
                          const isSelected = status === selectedStatus;
                          const config =
                            selectedStatus &&
                            USER_STATUS_COLOR_CONFIG[selectedStatus];
                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setSelectedStatus(status)}
                              className={`relative py-4 text-xs ${isSelected ? config?.background_color : "bg-background-secondary"} outline-none font-semibold rounded-md border-2 border-border hover:border-border-hover cursor-pointer active:scale-110 transition-all duration-200 ease-out`}
                            >
                              {status === "ON_LEAVE" ? "ON LEAVE" : status}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                {/* ========================= */}
                {/* Buttons | Cancel | Submit*/}
                {/* ========================= */}
                <div className="w-full grid grid-cols-3 gap-6 p-6">
                  <button
                    type="button"
                    onClick={() => onClose()}
                    className="bg-gray-600/50 text-sm lg:text-lg font-bold py-4 border-2 border-border rounded-md hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-300 ease-out outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isPending}
                    type="submit"
                    className={`col-span-2 ${isError ? "bg-amber-600" : "bg-green-600"} text-sm lg:text-lg font-bold py-4 border-2 border-border rounded-md hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-300 ease-out outline-none`}
                  >
                    {isError ? (
                      "Try again"
                    ) : isPending ? (
                      <TextLoader text="Submitting..." />
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </form>
              {/* ============================ */}
              {/* Form Image */}
              {/* ============================ */}
              {image && (
                <ImageCropForm
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  setCrop={setCrop}
                  setZoom={setZoom}
                  onCropComplete={onCropComplete}
                  handleCrop={handleCrop}
                  handleCancelCrop={handleCancelCrop}
                  handleSetZoom={handleSetZoom}
                />
              )}
            </div>
          </MyPopupForm>
        )}
      </AnimatePresence>
    </>
  );
}
