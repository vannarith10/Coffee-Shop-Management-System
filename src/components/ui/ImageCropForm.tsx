//
// components/ui/ImageCropForm.tsx
//
import type { Area, Point } from "react-easy-crop";
import Cropper from "react-easy-crop";
import ButtonCancel from "./ButtonCancel";
import { motion } from "framer-motion";
import { useState } from "react";

interface Props {
  image: string | undefined;
  crop: Point;
  zoom: number;
  setCrop: React.Dispatch<React.SetStateAction<Point>>;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  onCropComplete: (_: Area, croppedPixels: Area) => void;
  handleCrop: () => void;
  handleCancelCrop: () => void;
  handleSetZoom: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageCropForm({
  image,
  crop,
  zoom,
  setCrop,
  setZoom,
  onCropComplete,
  handleCrop,
  handleCancelCrop,
  handleSetZoom,
}: Props) {
  const [showCropper, setShowCropper] = useState(false);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className=" fixed inset-0 z-100 backdrop-blur-xs rounded-4xl"
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={{
          opacity: 1,
          x: 800,
          y: 800,
          skewY: 50,
          scaleX: 0.2,
          scaleY: 0.01,
          borderRadius: 500,
          transition: {
            duration: 0.3,
          },
        }}
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
        onAnimationComplete={() => setShowCropper(true)}
        className=" w-full h-full flex flex-col justify-center items-center "
      >
        <div className=" relative w-60 h-60 md:w-80 md:h-80 lg:h-100 lg:w-100 bg-white border-4 border-border">
          {showCropper && (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>
        <div className="mt-10 flex flex-col items-center gap-10 ">
          {/* --------------------- */}
          {/* Zoom level */}
          {/* --------------------- */}
          <input
            className="w-60 md:w-80 lg:w-100 outline-none cursor-grab"
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => handleSetZoom(e)}
          />
          <div className="w-full grid grid-cols-3 gap-2 ">
            <ButtonCancel handelCancel={handleCancelCrop} />
            <button
              type="button"
              onClick={() => {
                handleCrop();
              }}
              className="col-span-2 px-10 py-2 text-xs sm:text-sm md:text-lg font-semibold text-white bg-green-600 rounded-md cursor-pointer hover:bg-green-700 active:scale-90 transition-all duration-200 ease-out"
            >
              Confirm
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
