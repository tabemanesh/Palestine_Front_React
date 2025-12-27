import apiClient from "../utilz/apiClient";


export interface BlogCategoryDto {
  id: string;
  faName: string;
}


const BlogCategoryService = {
  async getAllCategories(): Promise<BlogCategoryDto[]> {
    const response = await apiClient.get("Blog/all-blog-category");
    return response.data;
  },
};

export default BlogCategoryService;