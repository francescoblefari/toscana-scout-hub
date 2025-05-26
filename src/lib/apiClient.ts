// src/lib/apiClient.ts
const API_BASE_URL = 'http://localhost:3001/api'; // Adjust if your backend runs elsewhere

interface RequestOptions extends RequestInit {
  token?: string | null;
  isFormData?: boolean;
}

async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, headers: customHeaders, body, isFormData, ...rest } = options;
  const headers: HeadersInit = { ...customHeaders };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isFormData && body) {
     headers['Content-Type'] = 'application/json';
  }
  
  const config: RequestInit = {
    ...rest,
    headers,
  };

  if (body) {
     config.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'API request failed');
  }
  
  // Handle cases where response might be empty (e.g., 204 No Content)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
     return response.json() as Promise<T>;
  }
  return Promise.resolve(null as unknown as T); // Or handle as appropriate for non-JSON responses
}

export default apiClient;
