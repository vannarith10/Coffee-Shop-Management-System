// components/ui/ImageCropForm.tsx
//
import type { Area, Point } from "react-easy-crop";
import Cropper from "react-easy-crop";

interface Props {
    image: string | undefined;
    crop: Point;
    zoom: number;
    setCrop: React.Dispatch<React.SetStateAction<Point>>;
    setZoom: React.Dispatch<React.SetStateAction<number>>;
    onCropComplete: (_: Area, croppedPixels: Area) => void; 
    handleCrop: () => void,
    handleCancelCrop: () => void,
    handleSetZoom: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageCropForm(
    {
        image,
        crop,
        zoom,
        setCrop,
        setZoom,
        onCropComplete,
        handleCrop,
        handleCancelCrop,
        handleSetZoom
    } : Props
) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 backdrop-blur-sm bg-background-primary flex flex-col items-center justify-center"
    >
      <div className="relative w-80 h-80 xl:h-100 xl:w-100 bg-white border-4 border-border">
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
      </div>
      <div className="mt-10 flex flex-col items-center gap-4">
        {/* --------------------- */}
        {/* Zoom level */}
        {/* --------------------- */}
        <input
          className="w-80 outline-none cursor-grab"
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => handleSetZoom(e)}
        />
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleCancelCrop()}
            className="px-4 py-2 bg-background-primary border border-border cursor-pointer hover:bg-background-primary-hover text-white rounded-md active:scale-90 transition-all duration-200 ease-out"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleCrop();
            }}
            className="px-10 py-2 bg-background-secondary text-white rounded-md cursor-pointer hover:bg-background-secondary-hover border border-border active:scale-90 transition-all duration-200 ease-out"
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
}
