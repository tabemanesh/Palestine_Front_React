import type { AxiosInstance } from "axios";
import axios from "axios";
import { API_CONFIG } from "./configuration/configApi";

// ساخت axios client
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// ---------------- DTO ها مطابق .NET ----------------

export interface CreateMartyrDto {
  name: string;
  activities: string;
  history: string;
  imgId?: string | null;
  birthDate?: string | null;
  martyrdomDate?: string | null;
  bio: string;
  imgIds? : string[]
  categoryId?: string | null;
}

export interface UpdateMartyrDto extends CreateMartyrDto {
  id: string;
}

export interface MartyrDto {
  id: string;
  name: string;
  activities: string;
  history: string;
  imgIds?: string[] | null;
  birthDate?: string | null;
  martyrdomDate?: string | null;
  bio: string;
  categoryId?: string | null;
  categoryName?: string | null;
}


const MartyrService = {
  async create(data: CreateMartyrDto): Promise<string> {
    const response = await apiClient.post("Martyr", data);
    return response.data; // id
  },

  async update( data: UpdateMartyrDto): Promise<void> {
    const response = await apiClient.put(`Martyr/${data.id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    const response = await apiClient.delete(`Martyr/${id}`);
    return response.data;
  },

  async getById(id: string): Promise<MartyrDto> {
    const response = await apiClient.get(`Martyr/${id}`);
    return response.data;
  },

  async getAll(): Promise<MartyrDto[]> {
    const response = await apiClient.get("Martyr");
    return response.data;
  },
};

export default MartyrService;
