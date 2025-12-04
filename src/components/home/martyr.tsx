import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { CreateMartyrDto, MartyrDto, UpdateMartyrDto } from "../../services/martyrService";
import { createMartyr, deleteMartyr, fetchMartyrs, updateMartyr } from "../../reducers/martyrSlice";
import type { RootState, AppDispatch } from "../../store/strore";
import { uploadFile } from "../../services/documentService";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import MartyrCategoryService, { type MartyrCategoryDto } from "../../services/MartyrCategoryService ";

dayjs.extend(jalaliday);

const Martyr: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { martyrs, loading } = useSelector((state: RootState) => state.martyr);
  const [categories, setCategories] = useState<MartyrCategoryDto[]>([]);

  const [form, setForm] = useState<CreateMartyrDto | UpdateMartyrDto>({
    name: "",
    activities: "",
    history: "",
    bio: "",
    imgIds: [],
    birthDate: undefined,
    martyrdomDate: undefined,
    categoryId: undefined,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // بارگذاری اولیه
  useEffect(() => {
    dispatch(fetchMartyrs());

    const fetchCategories = async () => {
      try {
        const data = await MartyrCategoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, [dispatch]);

  // انتخاب فایل‌ها
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // ثبت یا ویرایش
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // تبدیل تاریخ‌ها از شمسی به میلادی
    const birthDateMiladi = form.birthDate
      ? dayjs(form.birthDate, "YYYY/MM/DD").calendar('gregory').format("YYYY-MM-DD")
      : undefined;

    const martyrdomDateMiladi = form.martyrdomDate
      ? dayjs(form.martyrdomDate, "YYYY/MM/DD").calendar('gregory').format("YYYY-MM-DD")
      : undefined;

    // آپلود فایل‌ها
    const uploadedIds: string[] = [...(form.imgIds || [])];
    for (const file of selectedFiles) {
      try {
        const id = await uploadFile(file);
        uploadedIds.push(id);
      } catch (err) {
        console.error("Upload failed:", err);
        return;
      }
    }

    const dto: CreateMartyrDto | UpdateMartyrDto = {
      ...form,
      birthDate: birthDateMiladi,
      martyrdomDate: martyrdomDateMiladi,
      imgIds: uploadedIds,
      id: editingId || undefined
    };

    if (editingId) {
      dispatch(updateMartyr(dto as UpdateMartyrDto));
      setEditingId(null);
    } else {
      dispatch(createMartyr(dto as CreateMartyrDto));
    }

    // ریست فرم
    setForm({
      name: "",
      activities: "",
      history: "",
      bio: "",
      imgIds: [],
      birthDate: undefined,
      martyrdomDate: undefined,
      categoryId: undefined,
    });
    setSelectedFiles([]);
  };

  // ویرایش
  const handleEdit = (m: MartyrDto) => {
    setForm({ ...m, imgIds: m.imgIds || [] });
    setEditingId(m.id);
  };

  // حذف
  const handleDelete = (id: string) => {
    if (window.confirm("آیا مطمئن هستید؟")) {
      dispatch(deleteMartyr(id));
    }
  };

  return (
    <div className="container mx-auto p-6 rtl" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-600">شهدای مقاومت</h1>

      <form onSubmit={handleSubmit} className="bg-gray-50 shadow-md rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Name */}
          <div className="relative">
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="peer border border-gray-300 rounded-md w-full p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 text-gray-800 transition"
            />
            <label htmlFor="name" className="absolute right-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-blue-500 peer-focus:text-sm">
              نام شهید
            </label>
          </div>

          {/* Category */}
          <div className="relative">
            <select
              id="categoryId"
              value={form.categoryId || ""}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 text-gray-800"
            >
              <option value="">دسته‌بندی</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Activities */}
          <div className="relative">
            <input
              type="text"
              id="activities"
              value={form.activities}
              onChange={(e) => setForm({ ...form, activities: e.target.value })}
              className="peer border border-gray-300 rounded-md w-full p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 text-gray-800 transition"
            />
            <label htmlFor="activities" className="absolute right-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-blue-500 peer-focus:text-sm">
              فعالیت‌ها
            </label>
          </div>

          {/* History */}
          <div className="relative md:col-span-2">
            <textarea
              id="history"
              value={form.history}
              onChange={(e) => setForm({ ...form, history: e.target.value })}
              className="peer border border-gray-300 rounded-md w-full p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 text-gray-800 transition h-24"
            />
            <label htmlFor="history" className="absolute right-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-blue-500 peer-focus:text-sm">
              تاریخچه
            </label>
          </div>

          {/* Bio */}
          <div className="relative md:col-span-2">
            <textarea
              id="bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="peer border border-gray-300 rounded-md w-full p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 text-gray-800 transition h-24"
            />
            <label htmlFor="bio" className="absolute right-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-blue-500 peer-focus:text-sm">
              بیوگرافی
            </label>
          </div>

          {/* Birth Date */}
          <div className="relative">
            <label htmlFor="birthDate" className="block text-gray-600 mb-2">تاریخ تولد</label>
            <input
              type="text"
              id="birthDate"
              placeholder="YYYY/MM/DD"
              value={form.birthDate || ""}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 text-gray-800"
            />
          </div>

          {/* Martyrdom Date */}
          <div className="relative">
            <label htmlFor="martyrdomDate" className="block text-gray-600 mb-2">تاریخ شهادت</label>
            <input
              type="text"
              id="martyrdomDate"
              placeholder="YYYY/MM/DD"
              value={form.martyrdomDate || ""}
              onChange={(e) => setForm({ ...form, martyrdomDate: e.target.value })}
              className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 text-gray-800"
            />
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <label className="block text-gray-600 mb-2">تصاویر شهید</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="border border-gray-300 p-2 rounded-md w-full bg-gray-100"
            />
            {selectedFiles.length > 0 && (
              <ul className="mt-2 text-sm text-gray-600">
                {selectedFiles.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={`mt-4 ${editingId ? "bg-blue-500 hover:bg-blue-600" : "bg-green-600 hover:bg-green-700"} text-white font-semibold py-2 px-6 rounded-md transition`}
        >
          {editingId ? "ویرایش" : "ثبت"}
        </button>

        <button
          type="button"
          onClick={() => {
            setForm({
              name: "",
              activities: "",
              history: "",
              bio: "",
              imgIds: [],
              birthDate: undefined,
              martyrdomDate: undefined,
              categoryId: undefined,
            });
            setSelectedFiles([]);
          }}
          className="bg-amber-500 hover:bg-amber-600 mr-2 text-white font-semibold py-2 px-6 rounded-md transition"
        >
          پاک کردن فرم
        </button>

      </form>

      {loading && <p className="text-center text-gray-500">در حال بارگذاری...</p>}

      <ul className="space-y-3">
        {martyrs.map((m: MartyrDto) => (
          <li key={m.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition">
            <div>
              <strong className="text-blue-600">{m.name}</strong> - {m.activities}
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(m)} className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded transition">
                ویرایش
              </button>
              <button onClick={() => handleDelete(m.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition">
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Martyr;
