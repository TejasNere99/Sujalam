export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const TOKEN_KEY = 'sujalam_auth_token';

class ApiClient {
  private getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (networkErr) {
      throw new Error('Network error. Check your connection.');
    }

    // Handle non-JSON responses gracefully
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      return undefined as any;
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      if (response.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
      throw new Error(data?.error?.message || data?.message || `Request failed (${response.status})`);
    }

    return data.data;
  }

  get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  patch<T>(endpoint: string, body: any, options?: RequestInit) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Multipart form data upload (for images)
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    let response: Response;
    try {
      response = await fetch(url, { method: 'POST', headers, body: formData });
    } catch {
      throw new Error('Network error. Check your connection.');
    }

    const data = await response.json();
    if (!response.ok || !data.success) {
      if (response.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
      throw new Error(data?.error?.message || data?.message || `Upload failed (${response.status})`);
    }
    return data.data;
  }
}

export const api = new ApiClient();
