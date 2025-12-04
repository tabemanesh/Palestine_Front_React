import axios, { type AxiosInstance } from "axios";
import { API_CONFIG } from "./configuration/configApi";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

export interface CreateScoreDto {
  userId: string;
  activityType: number;
  campaignId?: string | null;
  empathyId?: string | null;
  value: number;
}

export interface ScoreDetailsDto {
  id: string;
  userId: string;
  userFullName?: string | null;
  activityType: number;
  campaignId?: string | null;
  campaignTitle?: string | null;
  empathyId?: string | null;
  empathyTitle?: string | null;
  value: number;
  createDate: string;
}

const ScoreService = {
  async create(data: CreateScoreDto): Promise<string> {
    const response = await apiClient.post("Score", data);
    return response.data; // server returns generated id
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`Score/${id}`);
  },

  async getById(id: string): Promise<ScoreDetailsDto> {
    const response = await apiClient.get(`Score/${id}`);
    return response.data;
  },

  async getAll(): Promise<ScoreDetailsDto[]> {
    const response = await apiClient.get("Score");
    return response.data;
  },
};

export default ScoreService;
