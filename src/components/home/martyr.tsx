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
    <div className="container mx-auto p-4 rtl" dir="rtl">

  {/* فرم */}
  <form onSubmit={handleSubmit} className="bg-gray-50 shadow-md rounded-lg p-4 mb-6">
      <h4 className="text-2xl font-bold mb-4 text-center text-red-600">شهدای مقاومت</h4>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      
      {/* Name */}
      <input
        type="text"
        placeholder="نام شهید"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* Category */}
      <select
        value={form.categoryId || ""}
        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <option value="">دسته‌بندی</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      {/* Activities */}
      <input
        type="text"
        placeholder="فعالیت‌ها"
        value={form.activities}
        onChange={(e) => setForm({ ...form, activities: e.target.value })}
        className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* Birth Date */}
      <input
        type="text"
        placeholder="تاریخ تولد"
        value={form.birthDate || ""}
        onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
        className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* Martyrdom Date */}
      <input
        type="text"
        placeholder="تاریخ شهادت"
        value={form.martyrdomDate || ""}
        onChange={(e) => setForm({ ...form, martyrdomDate: e.target.value })}
        className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* Files */}
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="border border-gray-300 p-2 rounded-md bg-gray-100 text-sm"
      />
    </div>

    {/* دکمه‌ها */}
    <div className="mt-3 flex gap-2">
      <button type="submit" className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm`}>
        {editingId ? "ویرایش" : "ثبت"}
      </button>
      <button
        type="button"
        onClick={() => {
          setForm({ name:"", activities:"", history:"", bio:"", imgIds:[], birthDate:undefined, martyrdomDate:undefined, categoryId:undefined });
          setSelectedFiles([]);
        }}
        className="bg-amber-500 hover:bg-amber-600 text-white py-1 px-3 rounded-md text-sm"
      >
        پاک کردن فرم
      </button>
    </div>
  </form>

  {/* جدول */}
  <div className="overflow-x-auto">
  <table className="min-w-full border border-gray-300 rounded-xl text-sm">
    <thead className="bg-gray-100">
      <tr>
        <th className="py-2 px-3 text-center border-b border-gray-300">ردیف</th>
        <th className="py-2 px-3 text-center border-b border-gray-300">نام</th>
        <th className="py-2 px-3 text-center border-b border-gray-300">فعالیت‌ها</th>
        <th className="py-2 px-3 text-center border-b border-gray-300">دسته‌بندی</th>
        <th className="py-2 px-3 text-center border-b border-gray-300">عملیات</th>
      </tr>
    </thead>
    <tbody>
      {martyrs.map((m, idx) => (
        <tr
          key={m.id}
          className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}
        >
          <td className="py-2 px-3 text-center border-b border-gray-200">{idx + 1}</td>
          <td className="py-2 px-3 text-center border-b border-gray-200">{m.name}</td>
          <td className="py-2 px-3 text-center border-b border-gray-200">{m.activities}</td>
          <td className="py-2 px-3 text-center border-b border-gray-200">{m.categoryName}</td>
          <td className="py-2 px-3 text-center border-b border-gray-200">
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleEdit(m)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-2 rounded text-xs transition"
              >
                ویرایش
              </button>
              <button
                onClick={() => handleDelete(m.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs transition"
              >
                حذف
              </button>
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

export default Martyr;
