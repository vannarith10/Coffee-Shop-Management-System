import { Store } from "lucide-react";
import { useRef, useState } from "react";
import { useGetShopInfo } from "../../hooks/useGetShopInfo";
import { toast } from "sonner";
import { useUpdateShopInfo } from "../../hooks/useUpdateShopInfo";

const GeneralInformation = () => {
  const { data, isLoading, isError, isRefetching, refetch } = useGetShopInfo();
  const [isEditing, setIsEditing] = useState(false);
  //
  const [newShopName, setNewShopName] = useState<string>();
  const [newContact, setNewContact] = useState<string>();
  const [newAddress, setNewAddress] = useState<string>();
  const [newDescription, setNewDescription] = useState<string>();
  //
  const { mutate: update, isPending: updating } = useUpdateShopInfo();

  // Copy the current data to show on input fields
  function onEditing() {
    setIsEditing(true);

    setNewShopName(data?.name);
    setNewContact(data?.contact.toString());
    setNewAddress(data?.address);
    setNewDescription(data?.description);
  }

  function handleSave() {
    // Check null
    // Now I check only Shop Name, others allowed null
    if (
      newShopName === null ||
      newShopName === "" ||
      newShopName == undefined
    ) {
      toast.warning("Shop name must not be null", { duration: 3000 });
      return;
    }

    // Check updated filed
    if (
      newShopName == data?.name &&
      newContact == data?.contact.toString() &&
      newAddress == data?.address &&
      newDescription == data?.description
    ) {
      toast.warning("At least one field updated", { duration: 3000 });
      return;
    }

    update(
      {
        name: newShopName,
        contact: newContact ?? null,
        address: newAddress ?? null,
        description: newDescription ?? null,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  }

  return (
    <section className="xl:col-span-2 p-6 flex flex-col gap-4 rounded-lg border-2 border-border bg-background-secondary">
      <div className="flex gap-4 items-center">
        <Store />
        <h2 className="font-bold text-xl">General Information</h2>
      </div>

      {/* ================================ */}
      {/* Shop Name */}
      {/* ================================ */}
      <div className="flex flex-col w-full gap-2">
        <label htmlFor="shop name" className="text-xs font-bold">
          Shop Name
        </label>
        <input
          onChange={(e) => setNewShopName(e.target.value)}
          value={isEditing ? newShopName : data?.name}
          type="text"
          disabled={!isEditing}
          className={`${isEditing ? "bg-background-secondary-hover" : "bg-background-secondary"} uppercase border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover`}
        />
      </div>

      {/* ================================ */}
      {/* Contact Number */}
      {/* ================================ */}
      <div className="flex flex-col w-full gap-2">
        <label htmlFor="contact number" className="text-xs font-bold">
          Contact Number
        </label>
        <input
          onChange={(e) => {
            const onlyDigits = e.target.value.replace(/\D/g, "");
            setNewContact(onlyDigits);
          }}
          value={isEditing ? newContact : data?.contact}
          type="tel"
          inputMode="numeric"
          disabled={!isEditing}
          className={`${isEditing ? "bg-background-secondary-hover" : "bg-background-secondary"} border-2 border-border w-full p-2 rounded-md focus:outline-none focus:border-green-600 hover:border-border-hover`}
        />
      </div>

      {/* ================================ */}
      {/* Address */}
      {/* ================================ */}
      <div className="flex flex-col w-full gap-2">
        <label htmlFor="address" className="text-xs font-bold">
          Address
        </label>
        <textarea
          disabled={!isEditing}
          value={isEditing ? newAddress : data?.address}
          name="address"
          id=""
          rows={3}
          onChange={(e) => setNewAddress(e.target.value)}
          className={`${isEditing ? "bg-background-secondary-hover" : "bg-background-secondary"} p-2 border-2 border-border rounded-md outline-none scrollbar-hide focus:border-green-600 hover:border-border-hover`}
        ></textarea>
      </div>

      {/* ================================ */}
      {/* About Shop */}
      {/* ================================ */}
      <div className="flex flex-col w-full gap-2">
        <label htmlFor="about shop" className="text-xs font-bold">
          About Shop
        </label>
        <textarea
          disabled={!isEditing}
          value={isEditing ? newDescription : data?.description}
          name="about shop"
          id=""
          rows={5}
          onChange={(e) => setNewDescription(e.target.value)}
          className={`${isEditing ? "bg-background-secondary-hover" : "bg-background-secondary"} p-2 border-2 border-border rounded-md outline-none scrollbar-hide focus:border-green-600 hover:border-border-hover`}
        ></textarea>
      </div>

      {/* ============================================================= */}
      {/* Action buttons */}
      {/* ============================================================= */}
      <div className="flex justify-end gap-2">
        {/* ------------------- */}
        {/* Button Cancel */}
        {/* ------------------- */}
        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="font-semibold py-2 px-8 rounded-md bg-background-secondary-hover/50 hover:bg-background-secondary-hover cursor-pointer active:scale-80 transition-all duration-300 ease-out outline-none"
          >
            Cancel
          </button>
        )}
        {/* --------------------------- */}
        {/* Button Edit & Save */}
        {/* --------------------------- */}
        <button
          onClick={() => {
            if (!isEditing) {
              onEditing();
            } else {
              handleSave();
            }
          }}
          className={`font-semibold px-8 py-2 text-text-secondary border border-border hover:border-border-hover rounded-md ${isEditing ? "bg-green-600" : "bg-background-secondary-hover"} cursor-pointer active:scale-80 transition-all duration-300 ease-out outline-none`}
        >
          {isEditing ? (updating ? "Saving" : "Save") : "Edit"}
        </button>
      </div>
    </section>
  );
};

export default GeneralInformation;
