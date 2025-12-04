import axios from "axios";
import { API_CONFIG } from "./configuration/configApi";

export interface MartyrCategoryDto {
  id: string;
  name: string;
}

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

const MartyrCategoryService = {
  async getAllCategories(): Promise<MartyrCategoryDto[]> {
    const response = await apiClient.get("Martyr/all-martyr-category");
    return response.data;
  },
};

export default MartyrCategoryService;
