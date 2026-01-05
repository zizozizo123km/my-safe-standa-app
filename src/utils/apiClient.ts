const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: unknown;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...customOptions } = options;

  const defaultHeaders = {
    // Only set Content-Type if we are sending data
    'Content-Type': data !== undefined ? 'application/json' : undefined,
    // Add token or other necessary headers here
    // Authorization: `Bearer ${getToken()}`,
    ...headers,
  };

  // Filter out undefined headers
  const filteredHeaders = Object.entries(defaultHeaders).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as HeadersInit);

  const config: RequestInit = {
    method: options.method || 'GET',
    headers: filteredHeaders,
    body: data !== undefined ? JSON.stringify(data) : undefined,
    ...customOptions,
  };

  const url = `${API_BASE_URL}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData = null;
      // Attempt to parse error body if available
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json().catch(() => null);
      } else {
        errorData = await response.text().catch(() => null);
      }

      throw new ApiError(
        `Request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    // Handle 204 No Content (often used for DELETE or successful PUT/PATCH without response body)
    if (response.status === 204) {
      return null as T;
    }

    // Parse JSON response
    const result = await response.json();
    return result as T;

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Wrap generic network errors (CORS, connectivity issues, etc.)
    throw new ApiError(`Network or Client Error: ${(error as Error).message}`, 500);
  }
}

export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'data'>) =>
    apiClient<T>(endpoint, { method: 'GET', ...options }),

  post: <T>(endpoint: string, data: unknown, options?: Omit<RequestOptions, 'method' | 'data'>) =>
    apiClient<T>(endpoint, { method: 'POST', data, ...options }),

  put: <T>(endpoint: string, data: unknown, options?: Omit<RequestOptions, 'method' | 'data'>) =>
    apiClient<T>(endpoint, { method: 'PUT', data, ...options }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'data'>) =>
    apiClient<T>(endpoint, { method: 'DELETE', ...options }),

  patch: <T>(endpoint: string, data: unknown, options?: Omit<RequestOptions, 'method' | 'data'>) =>
    apiClient<T>(endpoint, { method: 'PATCH', data, ...options }),
};

export default api;