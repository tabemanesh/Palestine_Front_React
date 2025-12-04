import type { AxiosInstance } from 'axios';
import { API_CONFIG } from './configuration/configApi';
import axios from 'axios';


const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});


export const uploadFile = async ( file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('Img', file);

  const response = await apiClient.post("General/upload-document", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data; 
};
