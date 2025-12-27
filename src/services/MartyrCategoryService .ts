import apiClient from "../utilz/apiClient";

export interface MartyrCategoryDto {
  id: string;
  name: string;
}



const MartyrCategoryService = {
  async getAllCategories(): Promise<MartyrCategoryDto[]> {
    const response = await apiClient.get("Martyr/all-martyr-category");
    return response.data;
  },
};

export default MartyrCategoryService;
