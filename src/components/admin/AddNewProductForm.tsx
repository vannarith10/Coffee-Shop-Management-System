import { SquarePlus } from "lucide-react";
import { useCallback, useState } from "react";
import type {
  AddNewProductRequest,
  PRODUCT_STOCK_STATUS,
} from "../../types/product";
import { useGetAllCategoryNames } from "../../hooks/useGetAllCategoryNames";
import { STATUS_OPTIONS, STOCK_STATUS_CONFIG } from "../../types/stock-status";
import DefaultImage from "../../assets/picture.jpg";
import type { Area } from "react-easy-crop";
import { base64ToFile } from "../../utils/convertor";
import { getCroppedImg } from "../../utils/crop-helper";
import ImageCropForm from "../ui/ImageCropForm";
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
import { z } from "zod";
import { Controller, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const createProductSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    category_name: z.string().min(1, "Category is required"),
    selling_price: z.coerce.number().positive("Price is required"),
    cost: z.coerce.number().positive("Cost is required"),
    description: z.string().nullable(),
    stock_status: z.string().min(1, "Stock is required"),
  })
  .refine((data) => data.cost <= data.selling_price, {
    message: "Price must be greater than cost",
    path: ["cost"],
  });

type CreateProductFormData = z.input<typeof createProductSchema>;

export default function AddNewProductForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isOpen = searchParams.get("create") === "true";

  const { control, handleSubmit, setValue, reset } =
    useForm<CreateProductFormData>({
      resolver: zodResolver(createProductSchema),
      defaultValues: {
        name: "",
        category_name: "",
        selling_price: 0,
        cost: 0,
        description: "",
        stock_status: "",
      },
    });


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

  const stockStatus = useWatch({ control, name: "stock_status" });
  const handleSelectStockStatus = (status: PRODUCT_STOCK_STATUS) => {
    setValue("stock_status", status, { shouldValidate: true });
  };

  const categoryName = useWatch({ control, name: "category_name" });
  const handleSelectCategoryName = (categoryName: string) => {
    setValue("category_name", categoryName);
  };

  // ---------------------------------------
  //
  //  Handle submit
  //
  // ---------------------------------------
  const onSubmit = (formData: CreateProductFormData) => {
    const data: AddNewProductRequest = {
      name: formData.name,
      category_name: formData.category_name,
      selling_price: formData.selling_price as number,
      cost_price: formData.cost as number,
      description: formData.description,
      stock_status: formData.stock_status as PRODUCT_STOCK_STATUS,
    };

    createProduct(
      { data, image: file! },
      {
        onSuccess: () => {
          handleCloseForm();
        },
        onError: (err) => {
          toast.error(err.response?.data.detail, { duration: 5000 });
        },
      },
    );
  };

  const onInvalid = (errors: FieldErrors<CreateProductFormData>) => {
    const message = Object.values(errors)[0]?.message;
    if (message) {
      toast.error(message, {duration: 5000});
    }
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
    reset();
    setImage(null);
    setFile(null);
    setPreview(DefaultImage);
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
          <MyPopupForm
            onClose={handleCloseForm}
            handleSubmit={handleSubmit(onSubmit, onInvalid)}
          >
            {/* --------------------------------------------
            *
                              Header
            *
            ----------------------------------------------*/}
            <FormHeader
              title="Add New Product"
              onClose={handleCloseForm}
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
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
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
                    onChange={handleSelectCategoryName}
                  />
                </div>
              </div>
            </div>

            {/* --------------------------------------------
            *
                        Price & Cost & Description
            *
            ----------------------------------------------*/}
            <div className="w-full flex gap-4 flex-col lg:flex-row bg-background-secondary-hover p-4 rounded-xl">
              <div className="flex flex-col gap-4 w-full">
                {/* ------------------- */}
                {/* Price               */}
                {/* ------------------- */}
                <div className="flex flex-col w-full gap-2">
                  <label htmlFor="price" className="text-xs font-bold">
                    PRODUCT PRICE
                  </label>
                  <Controller
                    name="selling_price"
                    control={control}
                    render={({ field }) => (
                      <MoneyInput
                        value={String(field.value)}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                {/* ------------------- */}
                {/* Cost Price          */}
                {/* ------------------- */}
                <div className="flex flex-col w-full gap-2">
                  <label htmlFor="cost" className="text-xs font-bold">
                    PRODUCT COST
                  </label>
                  <Controller
                    name="cost"
                    control={control}
                    render={({ field }) => (
                      <MoneyInput
                        value={String(field.value)}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                {/* ------------------- */}
                {/* Description         */}
                {/* ------------------- */}
                <div className="flex flex-col w-full gap-2">
                  <label htmlFor="description" className="text-xs font-bold">
                    DESCRIPTION (Optional)
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* --------------------------------------------
            *
                              Stock
            *
            ----------------------------------------------*/}
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
                      key={stock.value}
                      onClick={() => handleSelectStockStatus(stock.value)}
                      type="button"
                      className={`${isSelected ? config.bg : "bg-background-secondary"} px-8 py-4 font-bold font-mono border border-border rounded-md cursor-pointer active:scale-80 transition-all duration-200 ease-out`}
                    >
                      {stock.value.replaceAll("_", " ")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* --------------------------------------------
            *
                        Buttons: Submit & Cancel
            *
            ----------------------------------------------*/}
            <div className="w-full grid grid-cols-3 gap-2 sm:gap-4">
              <ButtonCancel handelCancel={handleCloseForm} />
              <ButtonSubmit isError={isError} isPending={isPending} />
            </div>

            {/* --------------------------------------------
            *
                              Image Form Crop
            *
            ----------------------------------------------*/}
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
