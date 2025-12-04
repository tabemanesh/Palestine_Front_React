import axios, { type AxiosInstance } from "axios";
import { API_CONFIG } from "./configuration/configApi";

// axios client
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// ---------------- DTO ها مطابق .NET ----------------

export interface CreateBlogDto {
  title: string;
  content: string;
  author?: string | null;
  imgId?: string | null;
  blogCategoryId: string;
}

export interface UpdateBlogDto {
  id: string;
  title: string;
  content: string;
  author?: string | null;
  imgId?: string | null;
  blogCategoryId: string;
}

export interface BlogDetailsDto {
  id: string;
  title: string;
  content: string;
  author?: string | null;
  imgId?: string | null;
  blogCategoryId: string;
  blogCategoryName: string;
  createDate: string;
  updatedAt?: string | null;
}


const BlogService = {
  async create(data: CreateBlogDto): Promise<string> {
    const response = await apiClient.post("Blog", data);
    return response.data; 
  },

  async update(id: string, data: UpdateBlogDto): Promise<void> {
    const response = await apiClient.put(`Blog/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`Blog/${id}`);
  },

  async getById(id: string): Promise<BlogDetailsDto> {
    const response = await apiClient.get(`Blog/${id}`);
    return response.data;
  },

  async getAll(): Promise<BlogDetailsDto[]> {
    const response = await apiClient.get("Blog");
    return response.data;
  },
};

export default BlogService;
