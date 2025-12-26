/**
 * Standardized API response helpers
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
}

/**
 * Creates a successful API response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  meta?: ApiResponse<T>["meta"]
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    meta,
  };
}

/**
 * Creates an error API response
 */
export function errorResponse(
  error: string,
  statusCode: number = 400
): Response {
  return Response.json(
    {
      success: false,
      error,
    },
    { status: statusCode }
  );
}

/**
 * Creates a paginated response
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): ApiResponse<T[]> {
  return {
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}

