import axios from "axios";
import { API_CONFIG } from "./configuration/configApi";

export interface BlogCategoryDto {
  id: string;
  faName: string;
}

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

const BlogCategoryService = {
  async getAllCategories(): Promise<BlogCategoryDto[]> {
    const response = await apiClient.get("Blog/all-blog-category");
    return response.data;
  },
};

export default BlogCategoryService;