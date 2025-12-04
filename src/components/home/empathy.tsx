import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { CreateEmpathyDto, UpdateEmpathyDto, EmpathyDetailsDto } from "../../services/EmpathyService";
import { fetchEmpathies, createEmpathy, updateEmpathy, deleteEmpathy } from "../../reducers/empathySlice";
import type { RootState, AppDispatch } from "../../store/strore";
import { uploadFile } from "../../services/documentService";

const Empathy: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { empathies, loading, error } = useSelector((state: RootState) => state.empathy);

  const [form, setForm] = useState<CreateEmpathyDto>({
    title: "",
    description: "",
    needAmount: 0,
    imgIds: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => { dispatch(fetchEmpathies()); }, [dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uploadedIds: string[] = [...(form.imgIds || [])];
    for (const file of selectedFiles) {
      try {
        const id = await uploadFile(file);
        uploadedIds.push(id);
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    const dto: CreateEmpathyDto | UpdateEmpathyDto = {
      ...form,
      imgIds: uploadedIds,
      id: editingId || undefined,
    };

    if (editingId) {
      dispatch(updateEmpathy(dto as UpdateEmpathyDto));
      setEditingId(null);
    } else {
      dispatch(createEmpathy(dto as CreateEmpathyDto));
    }

    setForm({ title: "", description: "", needAmount: 0, imgIds: [] });
    setSelectedFiles([]);
  };

  const handleEdit = (e: EmpathyDetailsDto) => {
    setForm({ title: e.title, description: e.description, needAmount: e.needAmount, imgIds: e.imageIds || [] });
    setEditingId(e.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("آیا مطمئن هستید؟")) dispatch(deleteEmpathy(id));
  };

  return (
    <div className="container mx-auto p-4 rtl" dir="rtl">

      {/* فرم */}
      <form onSubmit={handleSubmit} className="bg-gray-50 shadow-md rounded-lg p-4 mb-6">
        <h4 className="text-2xl font-bold mb-4 text-center text-red-600">همدلی‌ها</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="عنوان"
            value={form.title}
            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="number"
            placeholder="مقدار نیاز"
            value={form.needAmount}
            onChange={e => setForm(prev => ({ ...prev, needAmount: Number(e.target.value) }))}
            className="border border-gray-300 rounded-md p-2 text-sm"
          />

          <textarea
            placeholder="توضیحات"
            value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            className="border border-gray-300 rounded-md p-2 text-sm md:col-span-3"
          />

          {/* آپلود تصاویر */}
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border border-gray-300 p-2 rounded-md w-full bg-gray-100 text-sm md:col-span-3"
          />
        </div>

        <div className="mt-3 flex gap-2">
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm">
            {editingId ? "ویرایش" : "ثبت"}
          </button>
          <button
            type="button"
            onClick={() => { setForm({ title:"", description:"", needAmount:0, imgIds:[] }); setSelectedFiles([]); }}
            className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md text-sm"
          >
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
              <th className="py-2 px-3 text-center border-b border-gray-300">توضیحات</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">مقدار نیاز</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">تصاویر</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {empathies.map((e, idx) => (
              <tr key={e.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}>
                <td className="py-2 px-3 text-center border-b border-gray-200">{idx + 1}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{e.title}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{e.description}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{e.needAmount}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200 flex justify-center gap-2 flex-wrap">
                  {e.imageIds?.map(imgId => (
                    <img key={imgId} src={`/files/${imgId}`} alt="emp" className="w-16 h-16 rounded" />
                  ))}
                </td>
                <td className="py-2 px-3 text-center border-b border-gray-200">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(e)} className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-2 rounded text-xs transition">ویرایش</button>
                    <button onClick={() => handleDelete(e.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs transition">حذف</button>
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

export default Empathy;
