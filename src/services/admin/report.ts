

import api from "../../lib/axios";




//
// Get Busiest Hours
//
export async function getBusiestHours() {
  return await api.get(`/api/v2/reports/busiest-hours`);
}


//
// Get Revenue Trends
//
export async function getRevenueTrends({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  return await api.get(`/api/v2/reports/revenue-trends/${month}/${year}`);
}