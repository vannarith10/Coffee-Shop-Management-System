//
// components/AddNewStaff.tsx
//
import { SquarePlus } from "lucide-react";
import { useCallback, useState } from "react";
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
import { useCreateStaff } from "../../hooks/useCreateStaff";
import MyPopupForm from "../animation/MyPopupForm";
import { AnimatePresence } from "framer-motion";
import FormHeader from "../animation/FormHeader";
import PasswordInput from "../ui/PasswordInput";
import ButtonCancel from "../ui/ButtonCancel";
import ButtonSubmit from "../ui/ButtonSubmit";
import ImageInput from "../ui/ImageInput";
import { useSearchParams } from "react-router-dom";
//
import { string, z } from "zod";
import {
  Controller,
  useForm,
  useWatch,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((password) => /\d/.test(password), {
    message: "Password must contain at least one number",
  })
  .refine((password) => /[@$!%*?&#]/.test(password), {
    message: "Password must contain at least one special character",
  });

const createStaffSchema = z
  .object({
    full_name: z.string().min(3, "Name is required"),
    username: z.string().min(3, "Username must be at least 3 charecters"),

    password: passwordSchema,
    confirmPassword: z.string(),

    schedules: z.array(string()).min(1, "Select at least one schedule"),
    role: z.string().min(1, "Please select a role"),
    shift: z.string().min(1, "Please select a shift"),
    status: z.string().min(1, "Please select status"),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

type CreateStaffFormData = z.infer<typeof createStaffSchema>;

export default function AddNewStaff() {
  const { mutate: createStaff, isPending, isError } = useCreateStaff();
  const [searchParams, setSearchParams] = useSearchParams();
  const isOpen = searchParams.get("create") === "true";

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateStaffFormData>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      full_name: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "",
      shift: "",
      schedules: [],
      status: "",
    },
  });

  const selectedRole = useWatch({
    control,
    name: "role",
  });

  const selectedShift = useWatch({
    control,
    name: "shift",
  });

  const selectedStatus = useWatch({
    control,
    name: "status",
  });

  const currentSchedules = useWatch({
    control,
    name: "schedules",
  });

  const password = useWatch({
    control,
    name: "password",
  });

  const confirmPassword = useWatch({ control, name: "confirmPassword" });
  const isConfirmMatch =
    confirmPassword.length > 0 &&
    password.length > 0 &&
    confirmPassword === password;

  const requirements = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "Uppercase", valid: /[A-Z]/.test(password) },
    { label: "Lowercase", valid: /[a-z]/.test(password) },
    { label: "Number", valid: /\d/.test(password) },
    { label: "Special character", valid: /[@$!%*?&#]/.test(password) },
  ];

  const handleSelectSchedule = (day: Schedule) => {
    const updateSchedules = currentSchedules.includes(day)
      ? currentSchedules.filter((d) => d !== day)
      : [...currentSchedules, day];

    setValue("schedules", updateSchedules, { shouldValidate: true });
  };

  const onSubmit = (formData: CreateStaffFormData) => {

    const data: CreateStaffRequest = {
      full_name: formData.full_name,
      username: formData.username,
      password: formData.password,
      role: formData.role as Role,
      shift: formData.shift as Shift,
      schedules: formData.schedules as Schedule[],
      status: formData.status as Status,
    };
    createStaff(
      { data, image: file! },
      {
        onSuccess: () => {
          reset();
          handleCloseForm();
        },
        onError: (err) => {
          toast.error(err.response?.data.detail, { duration: 5000 });
        },
      },
    );
  };

  const onInvalid = (errors: FieldErrors<CreateStaffFormData>) => {
    const message = Object.values(errors)[0]?.message;

    if (message) {
      toast.error(message, { duration: 5000 });
    }
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

  const handleCancelCrop = () => {
    setImage(null);
    setZoom(1);
  };

  const handleSetZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(Number(e.target.value));
  };

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleOpenForm = () => {
    setSearchParams((prev) => {
      prev.set("create", String(true));
      return prev;
    });
  };

  const handleCloseForm = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("create");
      return params;
    });
    reset();
    setFile(null);
    setPreview(DefaultProfile);
  };

  return (
    <>
      <section className="w-full flex justify-end">
        <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-4">
          {/* --------------------------------------------
          *
                      Button: Add New Staff
          *
          ----------------------------------------------*/}
          <button
            onClick={handleOpenForm}
            className="col-start-2 lg:col-start-3 flex justify-center gap-2 items-center bg-background-secondary py-4 rounded-lg border-2 border-border font-bold hover:bg-background-secondary-hover hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-200 ease-out outline-none"
          >
            Add Staff <SquarePlus />
          </button>
        </div>
      </section>
      {/* --------------------------------------------
      *
                            Form 
      *
      ----------------------------------------------*/}
      <AnimatePresence>
        {isOpen && (
          <MyPopupForm
            key={"add-staff-modal"}
            onClose={handleCloseForm}
            handleSubmit={handleSubmit(onSubmit, onInvalid)}
          >
            {/* --------------------------------------------
            *
                                Header 
            *
            ----------------------------------------------*/}
            <FormHeader
              title="Add New Staff"
              onClose={handleCloseForm}
              className="sticky top-0 z-100"
            />

            {/* --------------------------------------------
            *
                              Names & Image
            *
            ----------------------------------------------*/}
            <div className="min-w-48 shrink-0 w-full flex flex-col gap-4 sm:flex-row justify-between p-4 bg-background-secondary-hover rounded-xl">
              <ImageInput
                preview={preview}
                handleInputImage={handleInputImage}
              />

              <div className="w-full flex flex-col gap-4 justify-center ">
                <div className="flex flex-col w-full gap-2">
                  <label htmlFor="name" className="text-xs font-bold">
                    NAME
                  </label>
                  <input
                    spellCheck={false}
                    {...register("full_name")}
                    placeholder="Vyra Vannarith"
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
                    {...register("username")}
                    placeholder="vyra.vannarith"
                    type="text"
                    className="placeholder:text-sm lowercase placeholder:font-semibold border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
                  />
                </div>
              </div>
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
                    <PasswordInput
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )}
                />
                <div className="space-y-1 text-sm">
                  {requirements.map((item) => (
                    <p
                      key={item.label}
                      className={
                        item.valid ? "text-green-500" : "text-gray-400"
                      }
                    >
                      {item.valid ? "✓" : "•"} {item.label}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex flex-col w-full gap-2">
                <label htmlFor="name" className="text-xs font-bold">
                  CONFIRM PASSWORD
                </label>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <PasswordInput
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )}
                />
                <div className="space-y-1 text-sm">
                  <p
                    className={
                      isConfirmMatch ? "text-green-500" : "text-gray-400"
                    }
                  >
                    {isConfirmMatch
                      ? "✓ Passwords match"
                      : "✕ Passwords do not match"}
                  </p>
                </div>
              </div>
            </div>

            {/* --------------------------------------------
            *
                              Schedules
            *
            ----------------------------------------------*/}
            <div className="w-full min-w-48 p-4 flex flex-col gap-4 bg-background-secondary-hover rounded-xl ">
              <label htmlFor="schedules" className="text-xs font-bold">
                SCHEDULES
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {DAY_ORDER.map((day) => {
                  const isSelected = currentSchedules.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleSelectSchedule(day)}
                      className={`${isSelected ? "bg-green-600" : "bg-background-secondary"} outline-none py-4 text-xs font-semibold border-2 border-border cursor-pointer hover:border-border-hover rounded-md active:scale-80 transition-all duration-300 ease-out`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* --------------------------------------------
            *
                              Role
            *
            ----------------------------------------------*/}
            <div className="w-full min-w-48 p-4 bg-background-secondary-hover rounded-xl flex flex-col gap-4">
              <label htmlFor="role" className="text-xs font-bold">
                ROLE
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ROLES.map((role) => {
                  const isSelected = role === selectedRole;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() =>
                        setValue("role", role, { shouldValidate: true })
                      }
                      className={`relative py-4 text-xs ${isSelected ? "bg-green-600" : "bg-background-secondary"} outline-none font-semibold rounded-md border-2 border-border hover:border-border-hover cursor-pointer active:scale-80 transition-all duration-300 ease-out`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* --------------------------------------------
            *
                              Shift
            *
            ----------------------------------------------*/}
            <div className="w-full min-w-48 p-4 bg-background-secondary-hover rounded-xl flex flex-col gap-4">
              <label htmlFor="shift" className="text-xs font-bold">
                SHIFT
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SHIFT_ORDER.map((shift) => {
                  const isSelected = shift === selectedShift;
                  return (
                    <button
                      key={shift}
                      type="button"
                      onClick={() =>
                        setValue("shift", shift, { shouldValidate: true })
                      }
                      className={`relative py-4 text-xs ${isSelected ? "bg-green-600" : "bg-background-secondary"} outline-none font-semibold rounded-md border-2 border-border hover:border-border-hover cursor-pointer active:scale-80 transition-all duration-300 ease-out`}
                    >
                      {shift === "FULL_DAY" ? "FULL DAY" : shift}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* --------------------------------------------
            *
                              Status
            *
            ----------------------------------------------*/}
            <div className="w-full min-w-48 p-4 bg-background-secondary-hover rounded-xl flex flex-col gap-4">
              <label htmlFor="shift" className="text-xs font-bold">
                STATUS
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-col-4 gap-4">
                {STATUSES.map((status) => {
                  const isSelected = status === selectedStatus;
                  const color =
                    USER_STATUS_COLOR_CONFIG[selectedStatus as Status];
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        setValue("status", status, { shouldValidate: true })
                      }
                      className={`relative py-4 text-xs ${isSelected ? color.background_color : "bg-background-secondary"} outline-none font-semibold rounded-md border-2 border-border hover:border-border-hover cursor-pointer active:scale-80 transition-all duration-300 ease-out`}
                    >
                      {status === "ON_LEAVE" ? "ON LEAVE" : status}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ------------------------------------------
            *
                      Buttons: Cancel & Submit
            *          
            ------------------------------------------- */}
            <div className="w-full grid grid-cols-3 gap-2 sm:gap-4">
              <ButtonCancel handelCancel={handleCloseForm} />
              <ButtonSubmit isError={isError} isPending={isPending} />
            </div>

            {/* ------------------------------------------
            *
                      Form: upload an image
            *          
            ------------------------------------------- */}
            <AnimatePresence>
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
            </AnimatePresence>
          </MyPopupForm>
        )}
      </AnimatePresence>
    </>
  );
}
