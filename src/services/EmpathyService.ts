import axios, { type AxiosInstance } from "axios";
import { API_CONFIG } from "./configuration/configApi";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});


export interface CreateEmpathyDto {
  title: string;
  description: string;
  needAmount: number;
  userCreatedId: string;
  imageIds?: string[] | null;
}

export interface UpdateEmpathyDto {
  id: string;
  title: string;
  description: string;
  needAmount: number;
  imageIds?: string[] | null;
}

export interface EmpathyDetailsDto {
  id: string;
  title: string;
  description: string;
  needAmount: number;
  receivedAmount: number;
  viewCount: number;
  userCreatedId: string;
  userCreatedName: string;
  imageIds?: string[] | null;
  createDate: string;
}


const EmpathyService = {
  async create(data: CreateEmpathyDto): Promise<string> {
    const response = await apiClient.post("Empathy", data);
    return response.data; // server returns generated id
  },

  async update(id: string, data: UpdateEmpathyDto): Promise<void> {
    const response = await apiClient.put(`Empathy/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`Empathy/${id}`);
  },

  async getById(id: string): Promise<EmpathyDetailsDto> {
    const response = await apiClient.get(`Empathy/${id}`);
    return response.data;
  },

  async getAll(): Promise<EmpathyDetailsDto[]> {
    const response = await apiClient.get("Empathy");
    return response.data;
  },
};

export default EmpathyService;
