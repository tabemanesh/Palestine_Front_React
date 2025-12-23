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

export interface CreateChallengeDto {
  title: string;
  description: string;
}

export interface UpdateChallengeDto extends CreateChallengeDto {
  id: string;
}

export interface ChallengeDto {
  id: string;
  title: string;
  description: string;
}

// ---------------- Service ----------------

const ChallengeService = {
  async create(data: CreateChallengeDto): Promise<string> {
    const response = await apiClient.post("Challenge", data);
    return response.data; // id
  },

  async update(data: UpdateChallengeDto): Promise<void> {
    const response = await apiClient.put(`Challenge/${data.id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    const response = await apiClient.delete(`Challenge/${id}`);
    return response.data;
  },

  async getById(id: string): Promise<ChallengeDto> {
    const response = await apiClient.get(`Challenge/${id}`);
    return response.data;
  },

  async getAll(): Promise<ChallengeDto[]> {
    const response = await apiClient.get("Challenge");
    return response.data;
  },

  async startChallenge(challengeId: string, userId: string): Promise<string> {
    const response = await apiClient.post(`Challenge/${challengeId}/start`, { userId });
    return response.data; // userChallengeId
  },

  async completeDay(userChallengeId: string, day: number, reflection?: string): Promise<void> {
    const response = await apiClient.post(`Challenge/progress/${userChallengeId}/${day}`, { reflection });
    return response.data;
  },
};

export default ChallengeService;
