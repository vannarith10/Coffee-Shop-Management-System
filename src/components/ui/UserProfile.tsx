//
import type { GetUserProfileResponse } from "../../types/user";
import Loader from "./Loader";
import DefaultProfile from "../../assets/user-profile.png";



interface Props {
  data: GetUserProfileResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}



const UserProfile = ({ data, isLoading, isError, refetch }: Props) => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center gap-2">
      <div className="flex flex-col-reverse md:flex-col items-center md:items-end">
        <h4 className="text-xs text-end">{data?.role || "Role"}</h4>
        <h3 className="text-sm font-bold whitespace-nowrap">
          {data?.name || "Username"}
        </h3>
      </div>

      {/* Handle profile loading */}
      {isLoading ? (
        <Loader />
      ) : (
        <img
          src={data?.image_url || DefaultProfile}
          alt="profile"
          className="w-16 h-16 md:w-12 md:h-12 object-cover rounded-full border-2 border-white"
        />
      )}

      {/* Handle error profile */}
      {isError && (
        <button
          onClick={() => refetch()}
          className="font-semibold bg-background-secondary hover:bg-background-secondary-hover px-2 rounded-md cursor-pointer active:scale-80 transition-all duration-300 ease-out outline-none"
        >
          Reload
        </button>
      )}
    </div>
  );
};

export default UserProfile;
