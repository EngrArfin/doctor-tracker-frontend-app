export interface ApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  error?: unknown;
}

