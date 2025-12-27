import apiClient from "../utilz/apiClient";



export interface CreateScoreDto {
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
