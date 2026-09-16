import { useCallback, useEffect, useState } from "react";
import { getCroppedImg } from "../../utils/crop-helper";
import type { Area } from "react-easy-crop";
import { type ScheduleType } from "@/features/staff/types/enums";
import { type EditStaffDataRequest } from "@/features/staff/types/staff";
import { SHIFT_ORDER } from "@/features/staff/types/enums";
import { type ShiftType } from "@/features/staff/types/enums";
import { type RoleType } from "@/features/staff/types/enums";
import { STATUSES } from "@/features/staff/types/enums";
import { USER_STATUS_COLOR_CONFIG } from "@/features/staff/types/enums";
import { type StatusType } from "@/features/staff/types/enums";
import { ROLES_ARRAY } from "@/features/staff/types/enums";
import { DAY_ORDER } from "@/features/staff/types/enums";
import { base64ToFile } from "../../utils/convertor";
import { Trash2 } from "lucide-react";
import { useDeleteStaff } from "../../features/staff/hooks/useDeleteStaff";
import MyPopupForm from "../animation/MyPopupForm";
import { AnimatePresence, motion } from "framer-motion";
import {
  FormHeader,
  PasswordInput,
  ImageInput,
  ImageCropForm,
  ButtonCancel,
  ButtonSubmit,
} from "@/components/ui";
import { useEditStaff } from "../../features/staff/hooks/useEditStaff";
import DefaultProfile from "../../assets/user-profile.png";
import { useSearchParams } from "react-router-dom";
import { useGetASingleProfile } from "../../features/staff/hooks/useGetStaffById";
import z from "zod";
import {
  Controller,
  useForm,
  useWatch,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { editStaffSchema } from "@/features/staff/schemas/staff.schema"; 

type EditStaffFormData = z.infer<typeof editStaffSchema>;

export default function EditStaffProfile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const staffId = searchParams.get("id") || "";

  useEffect(() => {
    if (!staffId.trim()) {
      return;
    }
  }, [staffId]);

  const { data: staff, error } = useGetASingleProfile(staffId);
  // Image preview
  const [preview, setPreview] = useState<string>(DefaultProfile);
  const [file, setFile] = useState<File | null>(null);

  const {
    handleSubmit,
    setValue,
    reset,
    control,
    register,
    formState: { dirtyFields },
  } = useForm<EditStaffFormData>({
    resolver: zodResolver(editStaffSchema),
    defaultValues: {
      name: null,
      username: null,
      email: null,
      password: null,
      confirmPassword: null,
      role: null,
      schedules: null,
      shift: null,
      status: null,
    },
  });

  const selectedShift = useWatch({ control, name: "shift" });
  const selectedRole = useWatch({ control, name: "role" });
  const selectedStatus = useWatch({ control, name: "status" });
  const schedules = useWatch({ control, name: "schedules" }) ?? [];
  const handleSelectSchedule = (day: ScheduleType) => {
    const updateSchedules = schedules?.includes(day)
      ? schedules.filter((d) => d !== day)
      : [...schedules, day];

    setValue("schedules", updateSchedules, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  useEffect(() => {
    if (staff) {
      reset({
        name: staff.name,
        username: staff.username,
        email: staff.email,
        password: null,
        confirmPassword: null,
        role: staff.role,
        schedules: staff.schedules,
        shift: staff.shift,
        status: staff.status,
      });

      (() => setPreview(staff?.image_url ?? DefaultProfile))();
    }
  }, [staff, reset]);

  const handleCloseFormEdit = useCallback(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("edit");
      params.delete("id");
      return params;
    });
  }, [setSearchParams]);

  useEffect(() => {
    if (error) {
      handleCloseFormEdit();
    }
  }, [error, handleCloseFormEdit]);

  const { mutate: deleteStaff, isPending } = useDeleteStaff();
  const [isDeletingStaff, setIsDeletingStaff] = useState(false);
  const {
    mutate: editStaff,
    isError,
    isPending: isUpdatePending,
  } = useEditStaff();

  // ----------------------------------------
  //
  //                Submit
  //
  // ----------------------------------------
  const onSubmit = (formData: EditStaffFormData) => {
    if (!staff?.id) return;

    const hasFormChanges = Object.keys(dirtyFields).length > 0;
    const hasImageChange = file !== null;

    if (!hasFormChanges && !hasImageChange) {
      toast.error("At least one field must be updated");
      return;
    }

    const data: EditStaffDataRequest = {
      name: formData.name,
      username: formData.username,
      password: formData.password,
      email: formData.email,
      role: formData.role as RoleType,
      status: formData.status as StatusType,
      shift_type: formData.shift as ShiftType,
      schedules: formData.schedules as ScheduleType[],
    };

    editStaff(
      { userId: staff?.id, data, image: file },
      {
        onError: (err) => {
          toast.error(err.response?.data.detail, { duration: 5000 });
        },
        onSuccess: () => {
          handleCloseFormEdit();
        },
      },
    );
  };

  const onInvalid = (errors: FieldErrors<EditStaffFormData>) => {
    const message = Object.values(errors)[0]?.message;
    if (message) {
      toast.error(message, { duration: 5000 });
    }
  };

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

  const handleCancelCrop = () => {
    setImage(null);
    setZoom(1);
  };

  const handleSetZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(Number(e.target.value));
  };

  function handleDeleteStaff(e: React.FormEvent) {
    e.preventDefault();

    deleteStaff(staffId, {
      onSuccess: () => {
        // onClose();
        handleCloseFormEdit();
      },
    });
  }

  return (
    <MyPopupForm
      onClose={handleCloseFormEdit}
      handleSubmit={handleSubmit(onSubmit, onInvalid)}
    >
      <FormHeader
        title="Edit Staff Account"
        description="Fill in the details to edit a staff account."
        onClose={handleCloseFormEdit}
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
              {...register("name")}
              spellCheck={false}
              className="placeholder:text-sm placeholder:font-semibold border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="name" className="text-xs font-bold">
              USERNAME
            </label>
            <input
              {...register("username")}
              spellCheck={false}
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
          {...register("email")}
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
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput onChange={field.onChange} value={field.value} />
            )}
          />
        </div>

        <div className="flex flex-col w-full gap-2">
          <label htmlFor="name" className="text-xs font-bold">
            CONFIRM PASSWORD
          </label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <PasswordInput onChange={field.onChange} value={field.value} />
            )}
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
              const isCurrentSchedule = staff?.schedules?.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectSchedule(day)}
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
              const isCurrentShift = shift === staff?.shift;
              const isSelected = shift === selectedShift;
              return (
                <button
                  key={shift}
                  type="button"
                  onClick={() => {
                    setValue("shift", shift, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
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
            {ROLES_ARRAY.map((role) => {
              const isCurrentRole = role === staff?.role;
              const isSelected = role === selectedRole;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setValue("role", role, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
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
              const isCurrentStatus = status === staff?.status;
              const isSelected = status === selectedStatus;
              // get color from specific status
              const color =
                USER_STATUS_COLOR_CONFIG[selectedStatus as StatusType];
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    setValue("status", status, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  className={`relative py-4 text-xs ${isSelected ? color?.background_color : "bg-background-secondary"} outline-none font-semibold rounded-md border-2 border-border hover:border-border-hover cursor-pointer active:scale-110 transition-all duration-200 ease-out`}
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
        <ButtonCancel handelCancel={handleCloseFormEdit} />
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
