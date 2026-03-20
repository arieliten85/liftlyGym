// Generic API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
  metadata?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

export interface PaginatedApiResponse<T> extends ApiResponse<PaginatedData<T>> {}