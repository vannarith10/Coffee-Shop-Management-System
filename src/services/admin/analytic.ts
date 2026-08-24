

import api from "../../lib/axios";





//
// Get Business Summary Data
//
export const getBusinessSummary = async () => {
  const response = await api.get("/api/v2/analytics/summary");
  return response;
};