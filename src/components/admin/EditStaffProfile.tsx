//
// components/EditStaffProfile.tsx
//
import type { EditStaffDataRequest, Staff } from "../../types/staff";
import { useCallback, useEffect, useState } from "react";
import { getCroppedImg } from "../../utils/crop-helper";
import type { Area } from "react-easy-crop";
import { DAY_ORDER, type Schedule } from "../../types/schedule";
import { SHIFT_ORDER, type Shift } from "../../types/shift";
import { base64ToFile } from "../../utils/convertor";
import { ROLES, type Role } from "../../types/role";
import {
  STATUSES,
  USER_STATUS_COLOR_CONFIG,
  type Status,
} from "../../types/status";
import { Trash2 } from "lucide-react";
import { useDeleteStaff } from "../../hooks/useDeleteStaff";
import MyPopupForm from "../animation/MyPopupForm";
import { AnimatePresence, motion } from "framer-motion";
import FormHeader from "../animation/FormHeader";
import PasswordInput from "../ui/PasswordInput";
import ImageInput from "../ui/ImageInput";
import { useEditStaff } from "../../hooks/useEditStaff";
import DefaultProfile from "../../assets/user-profile.png";
import ImageCropForm from "../ui/ImageCropForm";
import ButtonCancel from "../ui/ButtonCancel";
import ButtonSubmit from "../ui/ButtonSubmit";
import { useSearchParams } from "react-router-dom";
import { useGetASingleProfile } from "../../hooks/staff/useGetASingleProfile";

interface UpdateStaffProfile {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditStaffProfile({ onClose }: UpdateStaffProfile) {
  const [searchParams, setSearchParams] = useSearchParams();
  const staffId = searchParams.get("id") || "";

  useEffect(() => {
    if (!staffId.trim()) {
      onClose();
    }
  }, [staffId, onClose]);

  const { data: staff } = useGetASingleProfile(staffId);

  const { mutate: deleteStaff, isPending } = useDeleteStaff();
  const [isDeletingStaff, setIsDeletingStaff] = useState(false);
  const {
    mutate: editStaff,
    isError,
    isPending: isUpdatePending,
  } = useEditStaff();
  const [currentRole, setCurrentRole] = useState<Role>();
  const [currentStatus, setCurrentStatus] = useState<Status>();
  const [currentShift, setCurrentShift] = useState<Shift>();
  const [currentSchedules, setCurrentSchedules] = useState<Schedule[]>();
  //
  const [name, setName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  //
  const [selectedRole, setSelectedRole] = useState<Role>();
  const [selectedStatus, setSelectedStatus] = useState<Status>();
  const [selectedShift, setSelectedShift] = useState<Shift>();
  const [schedules, setSchedules] = useState<Schedule[]>();


  useEffect(() => {
    if (staff) {
      (() => {
        setCurrentRole(staff.role);
        setCurrentStatus(staff.status);
        setCurrentShift(staff.shift);
        setCurrentSchedules(staff.schedules);
        // set selected to show their currect values
        setSelectedRole(staff.role);
        setSelectedStatus(staff.status);
        setSelectedShift(staff.shift);
        setSchedules(staff.schedules);
      })();
    }
  }, [staff]);


  // Image preview
  const [preview, setPreview] = useState<string>(DefaultProfile);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    (() => setPreview(staff?.image_url ?? DefaultProfile))();
  }, [staff]);

  // Crop state
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // FILE SELECT -> OPEN CROP
  const handleInputImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  async function handleCrop() {
    if (!image || !croppedAreaPixels) {
      return;
    }
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    setPreview(croppedImage);
    // Convert base64 to file
    const file = base64ToFile(croppedImage, "profile.jpg");
    setFile(file);

    setZoom(1);
    setImage(null); // Close modal
  }

  // HANDLE SELECT WORKING DAYS
  function handleSelectWorkingDay(day: Schedule) {
    // If prev === null then insert schedule directly
    // If already selected then remove, else add to working days.
    setSchedules((prev) => {
      if (!prev) return prev;

      return prev === null
        ? [day]
        : prev.includes(day)
          ? prev.filter((d) => d !== day)
          : [...prev, day];
        }
    );
  }
  function handleSelectShift(shift: Shift) {
    setSelectedShift(shift);
  }
  function handleSelectRole(role: Role) {
    setSelectedRole(role);
  }
  function handleSelectStatus(status: Status) {
    setSelectedStatus(status);
  }

  if (!open) return null;

  const handleCancelCrop = () => {
    setImage(null);
    setZoom(1);
  };

  const handleSetZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(Number(e.target.value));
  };

  // ----------------------------------------------
  //
  //                  Submit
  //
  // ----------------------------------------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    //
    const data: EditStaffDataRequest = {
      name: name,
      username: username,
      password: password,
      email: email,
      role: selectedRole || null,
      status: selectedStatus || null,
      shift_type: selectedShift || null,
      schedules: schedules || null,
    };


    editStaff(
      { userId: staffId, data: data, image: file },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  }

  function handleDeleteStaff(e: React.FormEvent) {
    e.preventDefault();

    deleteStaff(staffId, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  return (
    <MyPopupForm onClose={onClose} handleSubmit={handleSubmit}>
      <FormHeader
        title="Edit Staff Account"
        description="Fill in the details to edit a staff account."
        onClose={onClose}
        className="w-full sticky top-0 z-100"
      />

      {/* --------------------------------------------
          *
                         Names & Image
          *
        ----------------------------------------------*/}
      <div className="min-w-48 shrink-0 w-full flex flex-col gap-4 sm:flex-row justify-between p-4 bg-background-secondary-hover rounded-xl">
        <ImageInput preview={preview} handleInputImage={handleInputImage} />
        <div className="w-full flex flex-col gap-4 justify-center ">
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="name" className="text-xs font-bold">
              NAME
            </label>
            <input
              spellCheck={false}
              onChange={(e) => setName(e.target.value)}
              placeholder={staff?.name}
              type="text"
              className="placeholder:text-sm placeholder:font-semibold border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="name" className="text-xs font-bold">
              USERNAME
            </label>
            <input
              spellCheck={false}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={staff?.username}
              type="text"
              className="placeholder:text-sm lowercase placeholder:font-semibold border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
            />
          </div>
        </div>
      </div>

      {/* --------------------------------------------
          *
                          Email
          *
        ----------------------------------------------*/}
      <div className="p-4 bg-background-secondary-hover rounded-xl flex flex-col w-full gap-2">
        <label htmlFor="email" className="text-xs font-bold">
          EMAIL
        </label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          placeholder={staff?.email}
          type="email"
          className="border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
        />
      </div>

      {/* --------------------------------------------
        *
                          Passwords
        *
        ----------------------------------------------*/}
      <div className="min-w-48 shrink-0 w-full flex flex-col gap-4 sm:flex-row justify-between p-4 bg-background-secondary-hover rounded-xl">
        <div className="flex flex-col w-full gap-2">
          <label htmlFor="name" className="text-xs font-bold">
            PASSWORD
          </label>
          <PasswordInput onChange={setPassword} value={password} />
        </div>

        <div className="flex flex-col w-full gap-2">
          <label htmlFor="name" className="text-xs font-bold">
            CONFIRM PASSWORD
          </label>
          <PasswordInput
            onChange={setConfirmPassword}
            value={confirmPassword}
          />
        </div>
      </div>

      {/* --------------------------------------------
          *
                         Schedules
          *
        ----------------------------------------------*/}
      <div className="min-w-48 shrink-0 w-full flex flex-col gap-4 sm:flex-row justify-between p-4 bg-background-secondary-hover rounded-xl">
        <div className="w-full flex flex-col gap-2 justify-center">
          <label htmlFor="schedules" className="text-xs font-bold">
            SCHEDULES
          </label>
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
            {DAY_ORDER.map((day) => {
              const isSelected =
                schedules === null ? false : schedules?.includes(day);
              const isCurrentSchedule = currentSchedules?.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectWorkingDay(day)}
                  className={`relative ${isSelected ? "bg-green-600" : "bg-background-secondary"} outline-none px-8 py-4 text-xs font-semibold border-2 border-border cursor-pointer hover:border-border-hover rounded-md active:scale-80 transition-all duration-300 ease-out`}
                >
                  {day}
                  {isCurrentSchedule && (
                    <span className="absolute pointer-events-none text-[8px] bottom-0 left-2 translate-y-1/2 px-2 py-1 rounded-sm bg-border">
                      Current Schedule
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* --------------------------------------------
          *
                         Shift
          *
        ----------------------------------------------*/}
      <div className="min-w-48 shrink-0 w-full flex flex-col gap-4 sm:flex-row justify-between p-4 bg-background-secondary-hover rounded-xl">
        <div className="w-full flex flex-col gap-2 justify-center">
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
      </div>
      {/* --------------------------------------------
          *
                          Role
          *
        ----------------------------------------------*/}
      <div className="min-w-48 shrink-0 w-full flex flex-col gap-4 sm:flex-row justify-between p-4 bg-background-secondary-hover rounded-xl">
        <div className="w-full flex flex-col gap-2 justify-center">
          <label htmlFor="role" className="text-xs font-bold">
            ROLE
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
      </div>
      {/* --------------------------------------------
          *
                          Status
          *
        ----------------------------------------------*/}
      <div className="min-w-48 shrink-0 w-full flex flex-col gap-4 sm:flex-row justify-between p-4 bg-background-secondary-hover rounded-xl">
        <div className="w-full flex flex-col gap-2 justify-center">
          <label htmlFor="shift" className="text-xs font-bold">
            STATUS
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATUSES.map((status) => {
              const isCurrentStatus = status === currentStatus;
              const isSelected = status === selectedStatus;
              // get color from specific status
              const config =
                selectedStatus && USER_STATUS_COLOR_CONFIG[selectedStatus];
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleSelectStatus(status)}
                  className={`relative py-4 text-xs ${isSelected ? config?.background_color : "bg-background-secondary"} outline-none font-semibold rounded-md border-2 border-border hover:border-border-hover cursor-pointer active:scale-110 transition-all duration-200 ease-out`}
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
      <div className="w-full border-t border-border pt-4 ">
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
      <div className="w-full grid grid-cols-3 gap-2 sm:gap-4">
        <ButtonCancel handelCancel={onClose} />
        <ButtonSubmit isError={isError} isPending={isUpdatePending} />
      </div>

      {/* ---------------------------------------------
        *   
                    Image Input Form
        * 
        -----------------------------------------------*/}
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

      {/* ---------------------------------------------
      *   
                  Delete Staff Dialog Box
      * 
      -----------------------------------------------*/}
      <AnimatePresence>
        {isDeletingStaff && (
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => handleDeleteStaff(e)}
            className=" fixed inset-0 z-100 backdrop-blur-sm bg-background-secondary rounded-2xl p-10 pt-0 border-2 border-border"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                ease: "easeOut",
                type: "spring",
                stiffness: 250,
                damping: 30,
              }}
              style={{
                transformOrigin: "center",
                transformPerspective: 1500,
              }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className=" w-full h-full flex flex-col justify-between "
            >
              <FormHeader
                title={"Deleted Account"}
                onClose={() => {
                  setIsDeletingStaff(false);
                  document.body.classList.remove("overflow-hidden");
                }}
              />

              <div className="flex flex-col w-full items-center gap-4">
                <h2 className="font-bold text-xl whitespace-nowrap">
                  Delete Staff?
                </h2>
                <div className="p-10 w-fit bg-background-secondary-hover rounded-full">
                  <Trash2 size={40} />
                </div>
              </div>

              <div className="w-full grid grid-cols-3 gap-2 sm:gap-4">
                <ButtonCancel
                  handelCancel={() => {
                    setIsDeletingStaff(false);
                    document.body.classList.remove("overflow-hidden");
                  }}
                />
                <button
                  type="button"
                  onClick={handleDeleteStaff}
                  disabled={isPending}
                  className="col-span-2 font-semibold w-full py-4 text-xs sm:text-sm lg:text-lg text-text-secondary rounded-md bg-background-secondary-hover hover:bg-sidebar cursor-pointer active:scale-80 transition-all duration-300 ease-out outline-none"
                >
                  {isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </form>
        )}
      </AnimatePresence>
    </MyPopupForm>
  );
}
