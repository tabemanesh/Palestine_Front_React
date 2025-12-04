import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { CreateBlogDto, UpdateBlogDto, BlogDetailsDto } from "../../services/blogService";
import { fetchBlogs, createBlog, updateBlog, deleteBlog } from "../../reducers/blogSlice";
import type { RootState, AppDispatch } from "../../store/strore";

const Blog: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, error } = useSelector((state: RootState) => state.blog);

  const [form, setForm] = useState<CreateBlogDto | UpdateBlogDto>({
    title: "",
    content: "",
    author: "",
    imgId: "",
    blogCategoryId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => { dispatch(fetchBlogs()); }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateBlog({ ...form, id: editingId } as UpdateBlogDto));
      setEditingId(null);
    } else {
      dispatch(createBlog(form as CreateBlogDto));
    }
    setForm({ title: "", content: "", author: "", imgId: "", blogCategoryId: "" });
  };

  const handleEdit = (b: BlogDetailsDto) => { setForm({ ...b }); setEditingId(b.id); };
  const handleDelete = (id: string) => { if (window.confirm("آیا مطمئن هستید؟")) dispatch(deleteBlog(id)); };

  return (
    <div className="container mx-auto p-6 rtl" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-600">بلاگ‌ها</h1>

      <form onSubmit={handleSubmit} className="bg-gray-50 shadow-md rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="عنوان"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100"
          />
          <textarea
            placeholder="محتوا"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 h-24"
          />
          <input
            type="text"
            placeholder="نویسنده"
            value={form.author?.toString()}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100"
          />
          <input
            type="text"
            placeholder="شناسه تصویر"
            value={form.imgId?.toString()}
            onChange={(e) => setForm({ ...form, imgId: e.target.value })}
            className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100"
          />
          <input
            type="text"
            placeholder="شناسه دسته‌بندی"
            value={form.blogCategoryId}
            onChange={(e) => setForm({ ...form, blogCategoryId: e.target.value })}
            className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100"
          />
        </div>

        <button
          type="submit"
          className={`mt-4 ${editingId ? "bg-blue-500 hover:bg-blue-600" : "bg-green-600 hover:bg-green-700"} text-white font-semibold py-2 px-6 rounded-md transition`}
        >
          {editingId ? "ویرایش" : "ثبت"}
        </button>
      </form>

      {loading && <p className="text-center text-gray-500">در حال بارگذاری...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <ul className="space-y-3">
        {blogs.map(b => (
          <li key={b.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition">
            <div>
              <strong className="text-blue-600">{b.title}</strong> - {b.author || "بدون نویسنده"}
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(b)} className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded transition">ویرایش</button>
              <button onClick={() => handleDelete(b.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition">حذف</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
