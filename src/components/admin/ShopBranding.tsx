import { Feather } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import DefaultImage from "../../assets/image-default.jpg";
import { useGetShopNameAndLogo } from "../../hooks/useGetShopNameAndLogo";
import Loader from "../ui/Loader";
import { useDeleteShopLogo } from "../../hooks/useDeleteShopLogo";
import ImageCropForm from "../ui/ImageCropForm";
import type { Area } from "react-easy-crop";
import { getCroppedImg } from "../../utils/crop-helper";
import { base64ToFile } from "../../utils/convertor";
import { useUpdateShopLogo } from "../../hooks/useUpdateShopLogo";
import MyPopupForm from "../animation/MyPopupForm";
import { AnimatePresence } from "framer-motion";

const ShopBranding = () => {
  const { data, isLoading, isError, isRefetching, refetch } =
    useGetShopNameAndLogo();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: removeLogo, isPending } = useDeleteShopLogo();
  const { mutate: updateLogo, isPending: updating } = useUpdateShopLogo();
  const [isRemove, setIsRemove] = useState(false);

  // CROP STATE
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Button upload logo
  const handleUploadButton = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ============================
  // Remove Logo
  // ============================
  function handleRemoveLogo() {
    removeLogo(undefined, {
      onSuccess: () => {
        setIsRemove(false);
        document.body.classList.remove("overflow-hidden");
      },
    });
  }

  function handleOpenRemoveLogoBox() {
    document.body.classList.add("overflow-hidden");
    setIsRemove(true);
  }

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
    // Convert to file in order to send to backend
    const file = base64ToFile(croppedImage, "profile.jpg");
    setZoom(1);
    setImage(null);

    // Send update
    updateLogo(file);
  };

  return (
    <section className="p-6 flex flex-col gap-4 items-center border-2 border-border rounded-lg bg-background-secondary">
      <div className="w-full flex gap-4 items-center">
        <Feather />
        <h2 className="font-bold text-xl">Shop Branding</h2>
      </div>

      {/* --------------------------- */}
      {/* IMAGE */}
      {/* --------------------------- */}
      <div className="w-40 h-40 flex justify-center items-center rounded-xl overflow-hidden border-2 border-border hover:border-border-hover">
        {!isLoading && !isError && !isRefetching && (
          <img
            src={data?.image_url || DefaultImage}
            alt="profile"
            className="w-full h-full object-cover "
          />
        )}
        {/* Handle Loading */}
        {(isLoading || isRefetching) && <Loader />}
        {isError && (
          <div className="flex flex-col justify-center items-center gap-2">
            <p className="text-text-error font-bold">Error</p>
            <button
              onClick={() => refetch()}
              className="bg-background-secondary-hover px-4 py-1 rounded-md cursor-pointer active:scale-80 transition-all duration-300 ease-out outline-none"
            >
              Reload
            </button>
          </div>
        )}
      </div>
      {/* Image input */}
      <input
        ref={fileInputRef}
        id="imageUpload"
        type="file"
        accept="image/*"
        onChange={handleInputImage}
        className="hidden"
      />

      <h4 className="font-bold">Shop Logo</h4>
      {/* ======================== */}
      {/* Button Upload Logo */}
      {/* ======================== */}
      <button
        onClick={handleUploadButton}
        disabled={updating}
        className="font-bold w-full py-2 text-text-secondary border border-border hover:border-border-hover rounded-md bg-background-secondary-hover cursor-pointer active:scale-80 transition-all duration-300 ease-out outline-none"
      >
        {updating ? "Uploading..." : "Upload Logo"}
      </button>
      {/* ==================== */}
      {/* Button Remove */}
      {/* ==================== */}
      <button
        onClick={handleOpenRemoveLogoBox}
        className="font-bold text-text-error cursor-pointer hover:underline active:scale-80 transition-all duration-300 ease-out outline-none"
      >
        Remove Logo
      </button>

      {/* =========================================== */}
      {/* =========================================== */}
      {/* Delete Logo Form */}
      {/* =========================================== */}
      {/* =========================================== */}
      <AnimatePresence>
        {isRemove && (
          <MyPopupForm onClose={() => setIsRemove(false)}>
            <div className="w-60 flex flex-col gap-4 items-center rounded-xl p-10 border-2 border-white bg-sidebar">
              <div className="p-4 bg-background-secondary-hover rounded-full">
                <Feather />
              </div>
              <h2 className="font-bold text-xl text-white whitespace-nowrap">
                Delete logo?
              </h2>
              <button
                onClick={handleRemoveLogo}
                disabled={isPending}
                className="font-bold text-white w-full py-2 border border-border hover:border-border-hover rounded-md bg-text-error/50 hover:bg-text-error cursor-pointer active:scale-80 transition-all duration-300 ease-out outline-none"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => {
                  setIsRemove(false);
                  document.body.classList.remove("overflow-hidden");
                }}
                className="font-bold w-full py-2 text-white border border-border hover:border-border-hover rounded-md bg-background-secondary-hover/50 hover:bg-background-secondary-hover cursor-pointer active:scale-80 transition-all duration-300 ease-out outline-none"
              >
                Cancel
              </button>
            </div>
          </MyPopupForm>
        )}
      </AnimatePresence>

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
    </section>
  );
};

export default ShopBranding;
