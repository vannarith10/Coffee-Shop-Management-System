import { SquarePlus } from "lucide-react";
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
import { toast } from "sonner";
import { useCreateProduct } from "../../hooks/useCreateProduct";
import MoneyInput from "../ui/MoneyInput";
import MyPopupForm from "../animation/MyPopupForm";
import { AnimatePresence } from "framer-motion";
import FormHeader from "../animation/FormHeader";
import ImageInput from "../ui/ImageInput";
import CustomSelect from "../ui/CustomSelect";
import ButtonCancel from "../ui/ButtonCancel";
import ButtonSubmit from "../ui/ButtonSubmit";
import TextInput from "../ui/TextInput";
import { useSearchParams } from "react-router-dom";

export default function AddNewProductForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isOpen = searchParams.get("create") === "true";

  const [productName, setProductName] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string>("0");
  const [costPrice, setCostPrice] = useState<string>("0");
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [stockStatus, setStockStatus] = useState<PRODUCT_STOCK_STATUS | null>(
    null,
  );
  const [description, setDescription] = useState<string | null>(null);
  const { categoryNameType } = useGetAllCategoryNames();
  const { mutate: createProduct, isError, isPending } = useCreateProduct();
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
    handleCloseForm();
  }

  // ---------------------------------------
  //
  //  Handle submit
  //
  // ---------------------------------------
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

    createProduct(
      { data, image: file },
      {
        onSuccess: () => {
          toast.success("Product created successfully", { duration: 5000 });
          onClose();
        },

        onError: (err) => {
          toast.error(err.response?.data.detail || "Unexpected error", {
            duration: 5000,
          });
        },
      },
    );
  }

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
  };

  return (
    <>
      <section className="grid grid-cols-4 gap-4">
        <button
          onClick={handleOpenForm}
          className="text-sm md:text-lg col-start-3 col-span-2 w-full flex justify-center gap-2 items-center bg-background-secondary py-4 rounded-lg border-2 border-border font-bold hover:bg-background-secondary-hover hover:border-border-hover cursor-pointer active:scale-90 transition-all duration-200 ease-out outline-none"
        >
          Add Product <SquarePlus />
        </button>
      </section>

      <AnimatePresence>
        {isOpen && (
          <MyPopupForm onClose={onClose} handleSubmit={handleSubmit}>
            {/* Form Title */}
            <FormHeader
              title="Add New Product"
              onClose={onClose}
              className="w-full sticky top-0 z-100"
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
                {/* Product name */}
                <div className="flex flex-col w-full gap-2">
                  <label htmlFor="name" className="text-xs font-bold">
                    PRODUCT NAME
                  </label>
                  <TextInput value={productName} onChange={setProductName} />
                </div>
                {/* Category name */}
                <div className="flex flex-col w-full gap-2">
                  <label htmlFor="name" className="text-xs font-bold">
                    CATEGORY NAME
                  </label>
                  <CustomSelect
                    value={categoryName}
                    options={
                      categoryNameType?.map((cat) => ({
                        label: cat.category_name,
                        value: cat.category_name,
                      })) ?? []
                    }
                    onChange={setCategoryName}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex gap-4 flex-col lg:flex-row bg-background-secondary-hover p-4 rounded-xl">
              <div className="flex flex-col gap-4 w-full">
                {/* ------------------- */}
                {/* Price               */}
                {/* ------------------- */}
                <div className="flex flex-col w-full gap-2">
                  <label htmlFor="price" className="text-xs font-bold">
                    PRODUCT PRICE
                  </label>
                  <MoneyInput value={productPrice} onChange={setProductPrice} />
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
                  <label htmlFor="description" className="text-xs font-bold">
                    DESCRIPTION (Optional)
                  </label>
                  <TextInput value={description} onChange={setDescription} />
                </div>
              </div>
            </div>

            {/* ------------------- */}
            {/* Stock Status        */}
            {/* ------------------- */}
            <div className=" w-full flex flex-col gap-4 bg-background-secondary-hover p-4 rounded-xl">
              <label htmlFor="stock status" className="text-xs font-bold">
                STOCK STATUS
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {STATUS_OPTIONS.map((stock) => {
                  const isSelected = stock.value === stockStatus;
                  const config = STOCK_STATUS_CONFIG[stock.value];
                  return (
                    <button
                      onClick={() => setStockStatus(stock.value)}
                      type="button"
                      className={`${isSelected ? config.bg : "bg-background-secondary"} px-8 py-4 font-bold font-mono border border-border rounded-md cursor-pointer active:scale-80 transition-all duration-200 ease-out`}
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
            <div className="w-full grid grid-cols-3 gap-2 sm:gap-4">
              <ButtonCancel handelCancel={onClose} />
              <ButtonSubmit isError={isError} isPending={isPending} />
            </div>

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
          </MyPopupForm>
        )}
      </AnimatePresence>
    </>
  );
}
