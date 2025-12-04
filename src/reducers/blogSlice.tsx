import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/strore";
import type { CreateBlogDto, UpdateBlogDto, BlogDetailsDto } from "../services/blogService";
import BlogService from "../services/blogService";

interface BlogState {
  blogs: BlogDetailsDto[];
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  blogs: [],
  loading: false,
  error: null,
};

export const fetchBlogs = createAsyncThunk("blog/fetchAll", async () => {
  const data = await BlogService.getAll();
  return data;
});

export const createBlog = createAsyncThunk("blog/create", async (dto: CreateBlogDto) => {
  const id = await BlogService.create(dto);
  return id;
});

export const updateBlog = createAsyncThunk("blog/update", async (dto: UpdateBlogDto) => {
  await BlogService.update(dto.id, dto);
  return dto;
});

export const deleteBlog = createAsyncThunk("blog/delete", async (id: string) => {
  await BlogService.delete(id);
  return id;
});

export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBlogs.fulfilled, (state, action: PayloadAction<BlogDetailsDto[]>) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "خطا در بارگذاری"; })

      .addCase(updateBlog.fulfilled, (state, action: PayloadAction<UpdateBlogDto>) => {
        const index = state.blogs.findIndex(b => b.id === action.payload.id);
        if (index >= 0) state.blogs[index] = { ...state.blogs[index], ...action.payload };
      })
      .addCase(deleteBlog.fulfilled, (state, action: PayloadAction<string>) => {
        state.blogs = state.blogs.filter(b => b.id !== action.payload);
      });
  },
});

export const selectBlogs = (state: RootState) => state.blog;
export default blogSlice.reducer;
