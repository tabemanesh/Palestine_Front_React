import axios, { type AxiosInstance } from "axios";
import { API_CONFIG } from "./configuration/configApi";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});


export interface CreateCampaignDto {
  title: string;
  description: string;
  regionId: string;
}

export interface UpdateCampaignDto {
  id: string;
  title: string;
  description: string;
  regionId: string;
}

export interface CampaignDetailsDto {
  id: string;
  title: string;
  description: string;
  likeCount: number;
  dislikeCount: number;
  regionId: string;
  regionName: string;
  createDate: string;
}


const CampaignService = {
  async create(data: CreateCampaignDto): Promise<string> {
    const response = await apiClient.post("Campaign", data);
    return response.data; // returns id
  },

  async update(id: string, data: UpdateCampaignDto): Promise<void> {
    const response = await apiClient.put(`Campaign/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`Campaign/${id}`);
  },

  async getById(id: string): Promise<CampaignDetailsDto> {
    const response = await apiClient.get(`Campaign/${id}`);
    return response.data;
  },

  async getAll(): Promise<CampaignDetailsDto[]> {
    const response = await apiClient.get("Campaign");
    return response.data;
  },
};

export default CampaignService;
