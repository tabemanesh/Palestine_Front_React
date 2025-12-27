import apiClient from "../utilz/apiClient";


export interface CreateCampaignDto {
  title: string;
  description: string;
  regionId: string;
  imgIds?: string[];
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
  totalLikeCount: number;
  totalDislikeCount: number;
  imgIds?: string[];
  status: string;
  regionId: string;
  regionName: string;

}


const CampaignService = {
  async create(data: CreateCampaignDto): Promise<string> {
    debugger
    const response = await apiClient.post("Campaign", data);
    return response.data; 
  },

  async update(data: UpdateCampaignDto): Promise<void> {
    const response = await apiClient.put(`Campaign/${data.id}`, data);
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
