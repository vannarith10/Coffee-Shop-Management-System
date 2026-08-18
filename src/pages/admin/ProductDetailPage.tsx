//
// pages/admin/ProductDetailPage.tsx
//
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { patchProduct } from "../../services/admin.service";
import type {
  PRODUCT_STOCK_STATUS,
  UpdateProductRequest,
} from "../../types/product";
import TextLoader from "../../components/ui/TextLoader";
import { formatDate } from "../../utils/date-converter";
import {
  Box,
  Calendar,
  CalendarDays,
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

export default function ProductDetailPage() {
  const [isOpen, setIsOpen] = useState(true);
  const { id } = useParams<{ id: string }>();
  const safeId = id ?? "";
  const { product, isLoading, isError } = useGetASingleProduct({ id: safeId });
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

  // ===============================================
  // Lock body scroll when modal opens
  // ===============================================
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
        navigate("/admin/products");
      }}
    >
      {isOpen && (
        <MyPopupForm onClose={() => setIsOpen(false)}>
          <div>
            <main
              onClick={(e) => e.stopPropagation()}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 overflow-y-scroll scrollbar-hide w-[80vw] max-h-[80vh] bg-background-primary border-4 border-border rounded-4xl shimmer shimmer-bg shimmer-color-blue-300/30 shimmer-duration-9000"
            >
              {/* ----------------- */}
              {/* Form Title */}
              {/* ----------------- */}
              <FormHeader
                title="Edit Category"
                onClose={() => setIsOpen(false)}
                className="col-span-1 lg:col-span-2 xl:col-span-3 w-full sticky top-0 z-100"
              />

              {/* =================================================== */}
              {/* Image and Date container */}
              {/* =================================================== */}
              <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 lg:grid-rows-[auto_1fr] gap-4 pr-6 lg:pr-0 pl-6 py-6">
                {/* ------------------------ */}
                {/* Image */}
                {/* ------------------------ */}
                <div className="aspect-square rounded-xl overflow-hidden  flex justify-center items-center border-2 border-border">
                  {isLoading && <TextLoader text="Loading image..." />}
                  {!isLoading && !isError && (
                    <>
                      {/* CLICKABLE IMAGE */}
                      <label
                        htmlFor="imageUpload"
                        className="relative block cursor-pointer w-full h-full"
                      >
                        <img
                          src={preview || DefaultPicture}
                          alt="product image"
                          className="w-full h-full object-cover aspect-square"
                        />
                        <span
                          className={`${!isEditing && "hidden"} absolute backdrop-blur-xs rounded-xl opacity-0 hover:opacity-100 w-full h-full flex justify-center items-center z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 active:text-gray-200`}
                        >
                          <Image size={56} />
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
                {/* --------------------------- */}
                {/* Dates and ID */}
                {/* --------------------------- */}
                <div className="h-full flex flex-col md:justify-between lg:justify-start gap-6 bg-background-secondary p-4 rounded-lg border-2 border-border ">
                  {/* ID */}
                  <div className="flex items-center md:flex-col 2xl:flex-row md:items-start 2xl:items-center gap-2">
                    <span className="inline-flex justify-self-start gap-2 font-semibold text-text-secondary">
                      <ScanBarcode />
                      ID
                    </span>
                    <div className="flex gap-2 items-center">
                      <h4 className=" truncate text-[10px] lg:text-xs text-text-secondary font-semibold bg-background-secondary-hover px-2 py-1 rounded-sm ">
                        {product?.id}
                      </h4>
                      <ButtonCopy size={18} url={product?.id || null} />
                    </div>
                  </div>
                  {/* Created At */}
                  <div className="flex items-center justify-between md:flex-col lg:flex-row md:items-start gap-2">
                    <h4 className="inline-flex justify-self-start gap-2 font-semibold text-text-secondary">
                      <Calendar /> Created At
                    </h4>
                    <h4 className="text-sm font-semibold text-text-secondary">
                      {formatDate(product?.created_at)}
                    </h4>
                  </div>
                  {/* Updated At */}
                  <div className="flex items-center justify-between md:flex-col lg:flex-row md:items-start gap-2">
                    <h4 className="inline-flex justify-self-start gap-2 font-semibold text-text-secondary">
                      <CalendarDays /> Updated At
                    </h4>
                    <h4 className="text-sm font-semibold text-text-secondary">
                      {product?.updated_at
                        ? formatDate(product?.updated_at)
                        : ""}
                    </h4>
                  </div>
                </div>
              </div>
              {/* ========================================= */}
              {/* Details Container */}
              {/* ========================================= */}
              <div className="xl:col-span-2 py-6 px-6">
                <div className="flex flex-col gap-4 bg-background-secondary rounded-lg  border-2  border-border p-4">
                  {/* ----------------- */}
                  {/* Product Name */}
                  {/* ----------------- */}
                  <div className="flex gap-4 border-b border-border py-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={!isEditing ? product?.name : newProductName!}
                      readOnly={!isEditing}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="w-full font-bold text-2xl outline-none text-text-primary"
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
                        !isEditing ? product?.category_name : newCategoryName!
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
                        !isEditing
                          ? product?.description || ""
                          : newDescription!
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
                    <div className="grid grid-cols-3 gap-2">
                      {STATUS_OPTIONS.map((option) => {
                        const isSelected = newStockStatus === option.value;
                        const isCurrent =
                          option.value === product?.stock_status;
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
                  {/* ------------------------- */}
                  {/* Image URL */}
                  {/* ------------------------- */}
                  <div className="flex flex-col gap-4 border-b border-border py-2 pb-4">
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
                        <div className="flex gap-4">
                          <button
                            onClick={handleCancelButton}
                            className="px-4 py-2 text-white font-semibold border border-text-error rounded-md cursor-pointer bg-text-error/20 hover:bg-text-error active:scale-80 outline-none transition-all duration-200 ease-out"
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
              </div>
            </main>

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
  );
}
