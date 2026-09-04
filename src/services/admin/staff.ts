//
// services/admin/staff.ts
//
import api from "../../lib/axios";
import type { CreateStaffRequest, EditStaffDataRequest, Staff } from "../../types/staff";





//
// Get employee profiles
//
export const getAllEmployeeProfiles = async () => {
  const response = await api.get("/api/v2/employee/profiles?page=1&size=20");
  return response.data;
};


//
// Get All Staff Profiles
//
export async function getAllStaffProfiles({
  page,
  size,
}: {
  page: number;
  size: number;
}) {
  const response = await api.get(
    `/api/v2/employee/profiles?page=${page}&size=${size}`,
  );
  return response;
}



//
// UPDATE STAFF PROFILE
//
export async function editStaffDetail({
  userId,
  data,
  file,
}: {
  userId: string;
  data: EditStaffDataRequest;
  file?: File | null;
}): Promise<void> {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.username) formData.append("username", data.username);
  if (data.password) formData.append("password", data.password);
  if (data.email) formData.append("email", data.email);
  if (data.role) formData.append("role", data.role);
  if (data.status) formData.append("status", data.status);
  if (data.shift_type) formData.append("shiftType", data.shift_type);

  if (data.schedules) {
    data.schedules.forEach((schedule) => {
      formData.append("schedules", schedule);
    });
  }

  if (file) {
    formData.append("image", file);
  }


  await api.patch(`/api/v2/employee/${userId}/edit`, formData);
}



//
// Create Staff Account
//
export async function createStaffAccount({
  data,
  image,
}: {
  data: CreateStaffRequest;
  image?: File | null;
}) {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );

  if (image) {
    formData.append("image", image);
  }
  return await api.post("/api/v2/employee/create-account", formData);
}



//
// Delete Staff Profile
//
export async function deleteProfile(id: string): Promise<void> {
  await api.delete(`/api/v2/employee/${id}/delete`);
}



// Get a single profile
export async function getASpecificProfile (id: string) {
   return await api.get(`/api/v2/employee/profile/${id}`)
}