import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { CreateEmpathyDto, UpdateEmpathyDto, EmpathyDetailsDto } from "../../services/EmpathyService";
import { fetchEmpathies, createEmpathy, updateEmpathy, deleteEmpathy } from "../../reducers/empathySlice";
import type { RootState, AppDispatch } from "../../store/strore";

const Empathy: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { empathies, loading, error } = useSelector((state: RootState) => state.empathy);

  const [form, setForm] = useState<CreateEmpathyDto | UpdateEmpathyDto>({
    title: "",
    description: "",
    needAmount: 0,
    userCreatedId: "",
    imageIds: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => { dispatch(fetchEmpathies()); }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateEmpathy({ ...form, id: editingId } as UpdateEmpathyDto));
      setEditingId(null);
    } else { dispatch(createEmpathy(form as CreateEmpathyDto)); }

    setForm({ title: "", description: "", needAmount: 0, userCreatedId: "", imageIds: [] });
  };

  const handleEdit = (e: EmpathyDetailsDto) => { setForm({ ...e }); setEditingId(e.id); };
  const handleDelete = (id: string) => { if (window.confirm("آیا مطمئن هستید؟")) dispatch(deleteEmpathy(id)); };

  return (
    <div className="container mx-auto p-6 rtl" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-600">همدلی</h1>

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
            placeholder="توضیحات"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 h-24"
          />
          <input
            type="number"
            placeholder="مقدار نیاز"
            value={form.needAmount}
            onChange={(e) => setForm({ ...form, needAmount: Number(e.target.value) })}
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
        {empathies.map(e => (
          <li key={e.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition">
            <div>
              <strong className="text-blue-600">{e.title}</strong> - {e.description} ({e.receivedAmount}/{e.needAmount})
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(e)} className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded transition">ویرایش</button>
              <button onClick={() => handleDelete(e.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition">حذف</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Empathy;
