import { Image, SquarePlus, X } from "lucide-react";
import { useCallback, useState } from "react";
import type {
  AddNewProductRequest,
  PRODUCT_STOCK_STATUS,
} from "../../types/product";
import { useGetAllCategoryNames } from "../../hooks/useGetAllCategoryNames";
import { STATUS_OPTIONS, STOCK_STATUS_CONFIG } from "../../types/stock-status";
import DefaultImage from "../../assets/image-default.jpg";
import type { Area } from "react-easy-crop";
import { base64ToFile } from "../../utils/convertor";
import { getCroppedImg } from "../../utils/crop-helper";
import ImageCropForm from "../ui/ImageCropForm";
import TextLoader from "../ui/TextLoader";
import { toast } from "sonner";
import { useCreateProduct } from "../../hooks/useCreateProduct";
import MoneyInput from "../ui/MoneyInput";
import MyPopupForm from "../animation/MyPopupForm";
import { AnimatePresence } from "framer-motion";
import FormHeader from "../animation/FormHeader";

export default function AddNewProductForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [productName, setProductName] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string>("0");
  const [costPrice, setCostPrice] = useState<string>("0");
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [stockStatus, setStockStatus] = useState<PRODUCT_STOCK_STATUS | null>(
    null,
  );
  const [description, setDescription] = useState<string | null>(null);

  const { categoryNameType, isLoadingCategoryNames, isErrorCategoryNames } =
    useGetAllCategoryNames();

  const createProductMutation = useCreateProduct(onClose);

  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>(DefaultImage);

  // ========================
  // Handle input image
  // ========================
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

  // ==================
  // Handle close
  // ==================
  function onClose() {
    setProductName("");
    setProductPrice("0");
    setCostPrice("0");
    setCategoryName(null);
    setStockStatus(null);
    setImage(null);
    setFile(null);
    setPreview(DefaultImage);
    setIsOpen(false);
  }

  if (isOpen) {
    document.body.classList.add("overflow-hidden");
  }
  if (!isOpen) document.body.classList.remove("overflow-hidden");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Name check
    if (productName == null || productName == "") {
      toast.warning("Please input product name", { duration: 3000 });
      return;
    }
    // Price check
    if (productPrice == null || productPrice == "0") {
      toast.warning("Please input product price", { duration: 3000 });
      return;
    }
    if (Number(productPrice) < 0) {
      toast.warning("Price must not be lower than zero", { duration: 3000 });
      return;
    }

    // Cost check
    if (costPrice == null || costPrice == "0") {
      toast.warning("Please input cost price", { duration: 3000 });
      return;
    }
    if (Number(costPrice) < 0) {
      toast.warning("Cost price must not be lower than zero", {
        duration: 3000,
      });
      return;
    }

    // Price & Cost check
    if (Number(productPrice) < Number(costPrice)) {
      toast.warning("Price must be greater than or equal cost", {
        duration: 3000,
      });
      return;
    }

    // Category check
    if (categoryName == null || categoryName == "") {
      toast.warning("Please input category name", { duration: 3000 });
      return;
    }

    // Stock check
    if (stockStatus == null) {
      toast.warning("Please input stock status", { duration: 3000 });
      return;
    }

    // Image check
    if (file == null) {
      toast.warning("Please update an image", { duration: 3000 });
      return;
    }

    const data: AddNewProductRequest = {
      name: productName,
      selling_price: Number(productPrice),
      cost_price: Number(costPrice),
      category_name: categoryName,
      stock_status: stockStatus,
      description: description,
    };

    await createProductMutation.mutateAsync({ data, image: file });
  }

  return (
    <>
      <section className="grid grid-cols-4 gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="text-sm md:text-lg col-start-3 col-span-2 w-full flex justify-center gap-2 items-center bg-background-secondary py-4 rounded-lg border-2 border-border font-bold hover:bg-background-secondary-hover hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-200 ease-out outline-none"
        >
          Add Product <SquarePlus />
        </button>
      </section>

      <AnimatePresence>
        {isOpen && (
          <MyPopupForm onClose={onClose}>
            <div>
              <form
                onSubmit={(e) => handleSubmit(e)}
                onClick={(e) => e.stopPropagation()}
                className={` w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[70vw] max-w-[90vw] max-h-[90vh] overflow-y-scroll scrollbar-hide flex flex-col gap-4 bg-background-primary border-4 border-border transition-all duration-200 ease-out shimmer shimmer-bg shimmer-color-blue-300/30 shimmer-duration-9000`}
              >
                {/* Form Title */}
                <FormHeader
                  title="Add New Product"
                  onClose={onClose}
                  className="w-full sticky top-0 z-100"
                />

                <div className="w-full flex gap-4 flex-col lg:flex-row px-6">
                  {/* --------------------------- */}
                  {/* IMAGE Input                 */}
                  {/* --------------------------- */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="role" className="text-xs font-bold">
                      IMAGE
                    </label>
                    {/* CLICKABLE IMAGE */}
                    <div className="w-full flex justify-center">
                      <label htmlFor="imageUpload" className="cursor-pointer">
                        <div className="relative w-full md:w-100 max-w-100 aspect-square rounded-md overflow-hidden border-2 border-border hover:border-border-hover">
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
                    </div>

                    {/* Image input */}
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleInputImage}
                      className="hidden"
                    />
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    {/* ------------------- */}
                    {/* Product Name        */}
                    {/* ------------------- */}
                    <div className="flex flex-col w-full gap-2">
                      <label htmlFor="name" className="text-xs font-bold">
                        PRODUCT NAME
                      </label>
                      <input
                        onChange={(e) => setProductName(e.target.value)}
                        value={productName}
                        placeholder="Iced Latte"
                        type="text"
                        className="placeholder:text-sm placeholder:font-semibold border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
                      />
                    </div>
                    {/* ------------------- */}
                    {/* Price               */}
                    {/* ------------------- */}
                    <div className="flex flex-col w-full gap-2">
                      <label htmlFor="price" className="text-xs font-bold">
                        PRODUCT PRICE
                      </label>
                      <MoneyInput
                        value={productPrice}
                        onChange={setProductPrice}
                      />
                    </div>
                    {/* ------------------- */}
                    {/* Cost Price          */}
                    {/* ------------------- */}
                    <div className="flex flex-col w-full gap-2">
                      <label htmlFor="cost" className="text-xs font-bold">
                        PRODUCT COST
                      </label>
                      <MoneyInput value={costPrice} onChange={setCostPrice} />
                    </div>
                    {/* ------------------- */}
                    {/* Description         */}
                    {/* ------------------- */}
                    <div className="flex flex-col w-full gap-2">
                      <label
                        htmlFor="description"
                        className="text-xs font-bold"
                      >
                        DESCRIPTION (Optional)
                      </label>
                      <input
                        onChange={(e) => setDescription(e.target.value)}
                        value={description ?? ""}
                        placeholder="describe something of product"
                        type="text"
                        className="placeholder:text-sm placeholder:font-semibold border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover"
                      />
                    </div>
                  </div>
                </div>
                {/* ------------------- */}
                {/* Category Name       */}
                {/* ------------------- */}
                <div className="flex flex-col w-full gap-2 px-6">
                  <label htmlFor="category name" className="text-xs font-bold">
                    CATEGORY NAME
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {isLoadingCategoryNames && (
                      <TextLoader text="Category names..." />
                    )}
                    {!isLoadingCategoryNames &&
                      !isErrorCategoryNames &&
                      categoryNameType?.map((cate) => {
                        const isSelected = cate.category_name === categoryName;
                        return (
                          <button
                            onClick={() => setCategoryName(cate.category_name)}
                            type="button"
                            className={`${isSelected ? "bg-green-600" : "hover:bg-background-secondary-hover"} px-4 py-2 font-bold font-mono border border-border rounded-md cursor-pointer active:scale-80 transition-all duration-200 ease-out`}
                          >
                            {cate.category_name}
                          </button>
                        );
                      })}
                    {isErrorCategoryNames && (
                      <span className="text-text-error text-xs font-bold">
                        Error loading category names
                      </span>
                    )}
                  </div>
                </div>
                {/* ------------------- */}
                {/* Stock Status        */}
                {/* ------------------- */}
                <div className="flex flex-col w-full gap-2 px-6">
                  <label htmlFor="stock status" className="text-xs font-bold">
                    STOCK STATUS
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {STATUS_OPTIONS.map((stock) => {
                      const isSelected = stock.value === stockStatus;
                      const config = STOCK_STATUS_CONFIG[stock.value];
                      return (
                        <button
                          onClick={() => setStockStatus(stock.value)}
                          type="button"
                          className={`${isSelected ? config.bg : "hover:bg-background-secondary-hover"} px-8 py-4 font-bold font-mono border border-border rounded-md cursor-pointer active:scale-80 transition-all duration-200 ease-out`}
                        >
                          {stock.value.replaceAll("_", " ")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ========================= */}
                {/* Buttons | Cancel | Submit*/}
                {/* ========================= */}
                <div className="w-full grid grid-cols-3 gap-2 p-6">
                  <button
                    type="button"
                    onClick={() => onClose()}
                    className="bg-gray-600/50 text-sm lg:text-lg font-bold py-4 border-2 border-border rounded-md hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-100 ease-out"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`col-span-2 text-sm lg:text-lg font-bold py-4 bg-green-600 border-2 border-border rounded-md hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-100 ease-out`}
                  >
                    Submit
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
