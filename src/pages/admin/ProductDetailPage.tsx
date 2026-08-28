//
// pages/admin/ProductDetailPage.tsx
//
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { patchProduct } from "../../services/admin/product";
import type {
  PRODUCT_STOCK_STATUS,
  UpdateProductRequest,
} from "../../types/product";
import TextLoader from "../../components/ui/TextLoader";
import {
  Box,
  Calendar,
  CalendarDays,
  Camera,
  ChartBarStacked,
  CircleDollarSign,
  DollarSign,
  FileText,
  Image,
  Pencil,
  ScanBarcode,
  Tag,
} from "lucide-react";
import { STATUS_OPTIONS } from "../../types/stock-status";
import ButtonCopy from "../../components/ui/ButtonCopy";
import DefaultPicture from "../../assets/no-image.webp";
import type { Area } from "react-easy-crop";
import ImageCropForm from "../../components/ui/ImageCropForm";
import { getCroppedImg } from "../../utils/crop-helper";
import { base64ToFile } from "../../utils/convertor";
import { useGetASingleProduct } from "../../hooks/useGetASingleProduct";
import MoneyInput from "../../components/ui/MoneyInput";
import MyPopupForm from "../../components/animation/MyPopupForm";
import { AnimatePresence } from "framer-motion";
import FormHeader from "../../components/animation/FormHeader";
import { formatDateTime } from "../../utils/dateFormatter";

export default function ProductDetailPage() {
  const [isOpen, setIsOpen] = useState(true);
  const { id } = useParams<{ id: string }>();
  const safeId = id ?? "";
  const { data:product, isLoading, isError } = useGetASingleProduct({ id: safeId });
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  // NEW
  const [newProductName, setNewProductName] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>("0");
  const [newCost, setNewCost] = useState<string>("0");
  const [newDescription, setNewDescription] = useState<string | null>(null);
  const [newStockStatus, setNewStockStatus] =
    useState<PRODUCT_STOCK_STATUS | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  // CROP STATE
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingError, setIsSavingError] = useState(false);

  // ==============================
  // Load values
  // ==============================
  useEffect(() => {
    function setValues() {
      if (product) {
        setNewProductName(product.name);
        setNewCategoryName(product.category_name);
        setNewPrice(product.price.toString());
        setNewCost(product.cost_price.toString());
        setNewDescription(product.description);
        setNewStockStatus(product.stock_status);
        setPreview(product.image_url);
      }
    }
    setValues();
  }, [product]);

  // ================================
  // Handle Edit button
  // ================================
  const handleEditButton = () => {
    setIsEditing(true);
    inputRef.current?.focus();
  };

  // ===========================================
  // Cancel button | Set to current values
  // ===========================================
  const handleCancelButton = () => {
    setIsEditing(false);
    // Reset
    if (product) {
      setNewProductName(product.name);
      setNewCategoryName(product.category_name);
      setNewPrice(product.price.toString());
      setNewCost(product.cost_price.toString());
      setNewDescription(product.description);
      setNewStockStatus(product.stock_status);
      setPreview(product.image_url);
      setFile(null);
    }
  };

  // ================================
  // FILE SELECT -> OPEN CROP
  // ================================
  const handleInputImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
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

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

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

  // ==============================
  // Handle Save button
  // ==============================
  const handleSaveButton = async () => {
    const data: UpdateProductRequest = {
      name: newProductName === product?.name ? null : newProductName,
      category_name:
        newCategoryName === product?.category_name ? null : newCategoryName,
      selling_price:
        Number(newPrice) === product?.price ? null : Number(newPrice),
      cost_price:
        Number(newCost) === product?.cost_price ? null : Number(newCost),
      description:
        newDescription === product?.description ? null : newDescription,
      stock_status:
        newStockStatus === product?.stock_status ? null : newStockStatus,
    };

    // Check if all values are null
    const allNull = Object.values(data).every((value) => value === null);

    if (allNull && file == null) {
      toast.error("At least one field is edited to update", { duration: 5000 });
      return;
    }

    try {
      setIsSavingError(false);
      setIsSaving(true);
      const res = await patchProduct({
        id: product!.id,
        data: data,
        image: file ?? null,
      });
      if (res.status == 200) {
        setIsEditing(false);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errData = error.response?.data as {
          message: string;
          status: number;
          timestamp: string;
          detail: string;
        };
        toast.error(errData?.detail ?? "Unexpected error");
        setIsSavingError(true);
      }
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        navigate("/admin/products", { replace: true });
      }}
    >
      {isOpen && (
        <MyPopupForm onClose={() => setIsOpen(false)}>
          <>
            <main
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col gap-6 overflow-y-scroll scrollbar-hide w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] max-h-[90vh] bg-background-primary border-4 border-border shimmer shimmer-bg shimmer-color-blue-300/30 shimmer-duration-9000"
            >
              {/* ---------------------------------
                           Form header
              ---------------------------------- */}
              <FormHeader
                title="Edit Category"
                onClose={() => setIsOpen(false)}
                className=" w-full sticky top-0 z-100"
              />

              {/* -------------------------------------------
                            *
                            Product Image
                            *
              -------------------------------------------- */}
              <div className={` flex justify-center items-center bg-background-secondary mx-6 p-6 rounded-lg border-2 ${isEditing? "border-green-500" : "border-border"}`}>
                {isLoading && <TextLoader text="Loading image..." />}
                {!isLoading && !isError && (
                  <>
                    {/* CLICKABLE IMAGE */}
                    <label
                      htmlFor="imageUpload"
                      className={`group w-40 h-40 sm:w-50 sm:h-50 md:w-60 md:h-60 lg:w-70 lg:h-70 xl:w-80 xl:h-80 relative block cursor-pointer border-2 ${isEditing ? "border-green-500" : "border-border"} `}
                    >
                      <img
                        src={preview || DefaultPicture}
                        alt="product image"
                        className="w-full h-full min-32 object-cover aspect-square"
                      />
                      <span
                        hidden={!isEditing}
                        className={` absolute bg-black/30 backdrop-blur-xs w-full h-full flex justify-center items-center z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 active:text-gray-200`}
                      >

                        <Camera className="size-10 group-hover:size-12 text-white transition-all duration-300 ease-out"/>
                      </span>
                    </label>

                    {/* Image input */}
                    <input
                      disabled={!isEditing}
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleInputImage}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              {/* ---------------------------------------------
                              *
                              Product Details
                              *
              ---------------------------------------------- */}
              <div
                className={`mx-6 flex flex-col gap-4 bg-background-secondary rounded-lg  border-2 ${isEditing ? "border-green-500" : "border-border"} p-4 `}
              >
                {/* ----------------- */}
                {/* Product Name */}
                {/* ----------------- */}
                <div className="flex gap-4 border-b border-border py-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={
                      !isEditing
                        ? (product?.name ?? "")
                        : (newProductName ?? "")
                    }
                    readOnly={!isEditing}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className={`${isEditing ? "text-white" : "text-amber-400"} w-full font-bold text-2xl outline-none `}
                  />
                </div>
                {/* ------------------------- */}
                {/* Category Name */}
                {/* ------------------------- */}
                <div className="flex gap-4 border-b border-border py-2">
                  <div className="flex gap-2">
                    <ChartBarStacked />
                    <span className="whitespace-nowrap font-semibold">
                      Category Name
                    </span>
                  </div>
                  <input
                    type="text"
                    value={
                      !isEditing
                        ? (product?.category_name ?? "")
                        : (newCategoryName ?? "")
                    }
                    readOnly={!isEditing}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full outline-none font-bold uppercase"
                  />
                </div>
                {/* ----------------------- */}
                {/* Category Type */}
                {/* Read Only */}
                {/* ----------------------- */}
                <div className="flex gap-4 items-center border-b border-border py-2">
                  <div className="flex gap-2">
                    <Tag />
                    <span className="whitespace-nowrap font-semibold">
                      Category Type
                    </span>
                  </div>
                  <span className="font-bold">{product?.category_type}</span>
                </div>
                {/* ------------------------ */}
                {/* Price */}
                {/* ------------------------ */}
                <div className="flex items-center gap-4 border-b border-border py-2">
                  <div className="flex gap-2">
                    <DollarSign />
                    <span className="whitespace-nowrap font-semibold">
                      Price
                    </span>
                  </div>
                  <MoneyInput
                    value={newPrice}
                    onChange={setNewPrice}
                    readOnly={!isEditing}
                    className="w-full outline-none font-bold text-xl text-green-600"
                  />
                </div>
                {/* ------------------------ */}
                {/* Cost */}
                {/* ------------------------ */}
                <div className="flex gap-4 border-b border-border py-2">
                  <div className="flex gap-2">
                    <CircleDollarSign />
                    <span className="whitespace-nowrap font-semibold">
                      Cost
                    </span>
                  </div>
                  <MoneyInput
                    value={newCost}
                    onChange={setNewCost}
                    readOnly={!isEditing}
                    className="w-full outline-none font-bold text-xl text-green-600"
                  />
                </div>
                {/* ------------------------- */}
                {/* Description */}
                {/* ------------------------- */}
                <div className="flex gap-4 border-b border-border py-2">
                  <div className="flex gap-2">
                    <FileText />
                    <span className="whitespace-nowrap font-semibold">
                      Description
                    </span>
                  </div>
                  <input
                    type="text"
                    value={
                      !isEditing ? product?.description || "" : newDescription!
                    }
                    readOnly={!isEditing}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full outline-none font-semibold text-sm"
                  />
                </div>
                {/* ------------------------- */}
                {/* Stock Status */}
                {/* ------------------------- */}
                <div className="flex flex-col gap-4 border-b border-border py-2 pb-4">
                  <div className="flex gap-2">
                    <Box />
                    <span className="whitespace-nowrap font-semibold">
                      Stock Status
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {STATUS_OPTIONS.map((option) => {
                      const isSelected = newStockStatus === option.value;
                      const isCurrent = option.value === product?.stock_status;
                      return (
                        <button
                          onClick={() => setNewStockStatus(option.value)}
                          key={option.value}
                          disabled={!isEditing}
                          className={`relative  font-bold text-white text-sm ${isSelected ? `bg-${option.color} ${option.border}` : "bg-background-secondary-hover"} border-2 border-border px-4 py-2 rounded-md transition-all duration-200 ease-out ${isEditing ? "cursor-pointer active:scale-90" : "cursor-not-allowed"}`}
                        >
                          {option.label}
                          {isCurrent && (
                            <span className="absolute text-[10px] font-mono bg-background-secondary-hover px-2 rounded-sm border left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2">
                              Current
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ================================ */}
                {/* Buttons bottom */}
                {/* Edit | Cancel | Save */}
                {/* ================================ */}
                {!isLoading && !isError && (
                  <div className="flex justify-end">
                    {!isEditing && (
                      <button
                        onClick={handleEditButton}
                        className="flex items-center bg-background-secondary-hover px-4 py-2 border border-border hover:bg-sidebar cursor-pointer rounded-md gap-2 active:scale-80 transition-all duration-200 ease-out"
                      >
                        <Pencil /> Edit Product
                      </button>
                    )}
                    {isEditing && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancelButton}
                          className="px-4 py-2 text-white font-semibold rounded-md cursor-pointer bg-text-error/50 hover:bg-text-error active:scale-80 outline-none transition-all duration-200 ease-out"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveButton}
                          className="px-10 py-2 text-white font-semibold bg-green-700/80 hover:bg-green-600 border border-border rounded-md cursor-pointer active:scale-80 outline-none transition-all duration-200 ease-out"
                        >
                          {!isSaving && !isSavingError && "Save"}
                          {isSaving && !isSavingError && (
                            <TextLoader text="Saving..." />
                          )}
                          {isSavingError && !isSaving && "Try again"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ---------------------------------------------
                            *
                            Dates & ID container
                            *
                --------------------------------------------- */}
              <div className="mx-6 mb-6 h-full max-h-fit flex flex-col justify-start p-4 gap-4 bg-background-secondary rounded-lg border-2 border-border ">
                {/* -----------------------------
                              ID
                ------------------------------ */}
                <div className="bg-background-secondary-hover p-2 flex flex-col items-start gap-2">
                  <div className="w-full flex justify-between items-center">
                    <span className="inline-flex justify-self-start gap-2 font-semibold text-text-secondary">
                      <ScanBarcode />
                      ID
                    </span>
                    <ButtonCopy size={18} url={product?.id || null} />
                  </div>

                  <h4 className=" text-[10px] sm:text-xs text-text-secondary font-semibold bg-background-secondary px-2 py-1 rounded-sm ">
                    {product?.id}
                  </h4>
                </div>
                {/* ----------------------------
                              Created At
                    ----------------------------- */}
                <div className="bg-background-secondary-hover p-2 flex flex-col items-start sm:flex-row sm:items-center sm:justify-between md:flex-col lg:flex-row md:items-start gap-2">
                  <h4 className="inline-flex justify-self-start gap-2 font-semibold text-text-secondary">
                    <Calendar /> Created At
                  </h4>
                  <h4 className="text-sm font-semibold text-text-secondary">
                    {/* {formatDate(product?.created_at)} */}
                    {formatDateTime(product?.created_at, {
                      showDate: true,
                      showTime: false,
                      fullMonthName: true,
                    })}
                  </h4>
                </div>
                {/* ---------------------------
                              Updated At
                    ---------------------------- */}
                <div className="bg-background-secondary-hover p-2 flex flex-col items-start sm:flex-row sm:justify-between sm:items-center md:flex-col lg:flex-row md:items-start gap-2">
                  <h4 className="inline-flex justify-self-start gap-2 font-semibold text-text-secondary">
                    <CalendarDays /> Updated At
                  </h4>
                  <h4 className="text-sm font-semibold text-text-secondary">
                    {formatDateTime(product?.updated_at) || "No data"}
                  </h4>
                </div>

                {/* ------------------------- */}
                {/* Image URL */}
                {/* ------------------------- */}
                <div className="flex flex-col bg-background-secondary-hover p-2 gap-4 border-b border-border py-2 pb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Image />
                      <span className="whitespace-nowrap font-semibold">
                        Image URL
                      </span>
                    </div>
                    <ButtonCopy url={product?.image_url || null} />
                  </div>
                  <a
                    href={product?.image_url || undefined}
                    className="text-xs text-text-secondary w-full wrap-break-word hover:underline"
                  >
                    {product?.image_url}
                  </a>
                </div>
              </div>
            </main>

            {/* ------------------------------------------------
                          *
                          Form upload image
                          *
            ------------------------------------------------- */}
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
          </>
        </MyPopupForm>
      )}
    </AnimatePresence>
  );
}
