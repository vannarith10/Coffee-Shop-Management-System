//
// services/admin/staff.ts
//
import api from "../../lib/axios";
import type { EditStaffDataRequest } from "../../types/staff";

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
