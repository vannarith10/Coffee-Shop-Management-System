import { Image } from "lucide-react";


interface Props {
  preview: string;
  isDisabled?: boolean;
  handleInputImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageInput = ({ preview, handleInputImage, isDisabled=false } : Props) => {
  return (
    <div className="flex justify-center ">
      <label htmlFor="imageUpload" className="group cursor-pointer w-fit">
        <div className="relative w-40 h-40 xl:w-60 xl:h-60 shrink-0 rounded-md overflow-hidden border-2 border-border hover:border-border-hover">
          <img
            src={preview}
            alt="profile"
            className="w-full h-full object-cover "
          />
          {!isDisabled && <span className="absolute hover:bg-gray-400/50 backdrop-blur-xs rounded-md opacity-0 hover:opacity-100 w-full h-full flex justify-center items-center z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-700 transition-all duration-300 ease-out">
            <Image
              size={64}
              className="group-active:scale-80 transition-all duration-300 ease-out"
            />
          </span>}
        </div>
      </label>
      <input
        disabled={isDisabled}
        id="imageUpload"
        type="file"
        accept="image/*"
        onChange={handleInputImage}
        className="hidden"
      />
    </div>
  );
};

export default ImageInput;
