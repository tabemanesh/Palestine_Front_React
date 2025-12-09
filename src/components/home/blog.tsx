import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { CreateBlogDto, UpdateBlogDto, BlogDetailsDto } from "../../services/blogService";
import { fetchBlogs, createBlog, updateBlog, deleteBlog } from "../../reducers/blogSlice";
import type { RootState, AppDispatch } from "../../store/strore";
import { uploadFile } from "../../services/documentService"; 
import type { BlogCategoryDto } from "../../services/BlogCategoryService";
import BlogCategoryService from "../../services/BlogCategoryService";

const Blog: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, error } = useSelector((state: RootState) => state.blog);

  const [categories, setCategories] = useState<BlogCategoryDto[]>([]);
  const [form, setForm] = useState<CreateBlogDto>({
    title: "",
    content: "",
    author: "",
    imgId: null,
    blogCategoryId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchBlogs());

    const fetchCategories = async () => {
      try {
        const data = await BlogCategoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, [dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imgId = form.imgId;

    if (selectedFile) {
      try {
        imgId = await uploadFile(selectedFile);
      } catch (err) {
        console.error("Upload failed:", err);
        return;
      }
    }

    const dto: CreateBlogDto | UpdateBlogDto = editingId
      ? { ...form, id: editingId, imgId } as UpdateBlogDto
      : { ...form, imgId } as CreateBlogDto;

    if (editingId) {
      await dispatch(updateBlog(dto as UpdateBlogDto));
      setEditingId(null);
    } else {
      await dispatch(createBlog(dto as CreateBlogDto));
    }

    setForm({ title: "", content: "", author: "", imgId: null, blogCategoryId: "" });
    setSelectedFile(null);
  };

  const handleEdit = (b: BlogDetailsDto) => {
    setForm({ ...b });
    setEditingId(b.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("آیا مطمئن هستید؟")) dispatch(deleteBlog(id));
  };

  return (
    <div className="container mx-auto p-6 rtl" dir="rtl">

      {/* فرم */}
      <h6 className="text-2xl font-bold mb-4 text-center text-red-600">مقالات</h6>
      <form onSubmit={handleSubmit} className="bg-gray-50 shadow-md rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="عنوان"
          value={form.title}
          onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="نویسنده"
          value={form.author?.toString()}
          onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
          className="border border-gray-300 rounded-md p-2"
        />
        <select
          value={form.blogCategoryId}
          onChange={(e) => setForm(prev => ({ ...prev, blogCategoryId: e.target.value }))}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="">انتخاب دسته‌بندی</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.faName}</option>)}
        </select>
        <textarea
          placeholder="محتوا"
          value={form.content}
          onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
          className="border border-gray-300 rounded-md p-2 md:col-span-3"
        />
        <input type="file" onChange={handleFileChange} className="border border-gray-300 rounded-md p-2 md:col-span-3" />
        <div className="flex gap-2 md:col-span-3">
          <button type="submit" className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md`}>
            {editingId ? "ویرایش" : "ثبت"}
          </button>
          <button type="button" onClick={() => { setForm({ title:"", content:"", author:"", imgId:null, blogCategoryId:"" }); setSelectedFile(null); }} className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md">
            پاک کردن فرم
          </button>
        </div>
      </form>

      {loading && <p className="text-center text-gray-500">در حال بارگذاری...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* جدول */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-xl text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-center border-b border-gray-300">ردیف</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">عنوان</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">نویسنده</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">دسته‌بندی</th>
              {/* <th className="py-2 px-3 text-center border-b border-gray-300">تصویر</th> */}
              <th className="py-2 px-3 text-center border-b border-gray-300">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((b, idx) => (
              <tr key={b.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}>
                <td className="py-2 px-3 text-center border-b border-gray-200">{idx+1}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{b.title}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{b.author || "بدون نویسنده"}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{categories.find(c => c.id === b.blogCategoryId)?.faName || ""}</td>
                {/* <td className="py-2 px-3 text-center border-b border-gray-200">
                  {b.imgId && <img src={`/files/${b.imgId}`} alt="blog" className="w-16 h-16 rounded mx-auto" />}
                </td> */}
                <td className="py-2 px-3 text-center border-b border-gray-200">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(b)} className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-2 rounded text-xs">ویرایش</button>
                    <button onClick={() => handleDelete(b.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs">حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Blog;
