// types/error.ts


export interface BackendErrorDetail {
  message: string;
  status: number;
  timestamp: string;
  detail: string;
}