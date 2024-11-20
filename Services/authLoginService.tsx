import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface LoginResponse {
  numError: number;
  token?: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>('https://backend-j959.onrender.com/api/Auth/IniciarSesion', {
    email,
    password,
  });

  if (response.data.numError === 1 && response.data.token) {
    await SecureStore.setItemAsync('userToken', response.data.token);
  }

  return response.data;
};

export const fetchUserData = async (): Promise<any> => {
  const token = await SecureStore.getItemAsync('userToken');
  const response = await axios.get('https://backend-j959.onrender.com/api/User/GetUsers', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.data;
};
