const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiClientError extends Error {
  status: number;
  code?: string;

  constructor({ message, status, code }: ApiError) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
  }
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const buildUrl = (endpoint: string, params?: Record<string, string>): string => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  return url.toString();
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiClientError({
      message: errorBody.message || `HTTP Error: ${response.status}`,
      status: response.status,
      code: errorBody.code,
    });
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};

export const apiClient = {
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const token = getAuthToken();
    const url = buildUrl(endpoint, config?.params);

    const response = await fetch(url, {
      ...config,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
    });

    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const token = getAuthToken();
    const url = buildUrl(endpoint, config?.params);

    const response = await fetch(url, {
      ...config,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const token = getAuthToken();
    const url = buildUrl(endpoint, config?.params);

    const response = await fetch(url, {
      ...config,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const token = getAuthToken();
    const url = buildUrl(endpoint, config?.params);

    const response = await fetch(url, {
      ...config,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const token = getAuthToken();
    const url = buildUrl(endpoint, config?.params);

    const response = await fetch(url, {
      ...config,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
    });

    return handleResponse<T>(response);
  },

  async upload<T>(endpoint: string, file: File, config?: RequestConfig): Promise<T> {
    const token = getAuthToken();
    const url = buildUrl(endpoint, config?.params);

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url, {
      ...config,
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      body: formData,
    });

    return handleResponse<T>(response);
  },
};

export { ApiClientError };
export type { ApiError };
