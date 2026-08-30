import { api } from '../lib/api/client';

export const authApi = {
  login: async (credentials: any) => {
    return await api.post<any>('/auth/login', credentials);
  },
  register: async (userData: any) => {
    return await api.post<any>('/auth/register', userData);
  },
  getMe: async () => {
    return await api.get<any>('/me');
  }
};
