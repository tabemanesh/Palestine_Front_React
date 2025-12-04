import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { CreateCampaignDto, UpdateCampaignDto, CampaignDetailsDto } from "../../services/campaignService";
import { fetchCampaigns, createCampaign, updateCampaign, deleteCampaign } from "../../reducers/campaignSlice";
import type { RootState, AppDispatch } from "../../store/strore";

const Campaign: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { campaigns, loading, error } = useSelector((state: RootState) => state.campaign);

  const [form, setForm] = useState<CreateCampaignDto | UpdateCampaignDto>({
    title: "",
    description: "",
    regionId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => { dispatch(fetchCampaigns()); }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateCampaign({ ...form, id: editingId } as UpdateCampaignDto));
      setEditingId(null);
    } else { dispatch(createCampaign(form as CreateCampaignDto)); }

    setForm({ title: "", description: "", regionId: "" });
  };

  const handleEdit = (c: CampaignDetailsDto) => { setForm({ ...c }); setEditingId(c.id); };
  const handleDelete = (id: string) => { if (window.confirm("آیا مطمئن هستید؟")) dispatch(deleteCampaign(id)); };

  return (
    <div className="container mx-auto p-6 rtl" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-600">پویش ها</h1>

      <form onSubmit={handleSubmit} className="bg-gray-50 shadow-md rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="عنوان کمپین"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="peer border border-gray-300 rounded-md w-full p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 text-gray-800 transition"
            />
          </div>
          <div className="relative md:col-span-2">
            <textarea
              placeholder="توضیحات"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="peer border border-gray-300 rounded-md w-full p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 text-gray-800 transition h-24"
            />
          </div>
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
        {campaigns.map(c => (
          <li key={c.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition">
            <div>
              <strong className="text-blue-600">{c.title}</strong> - {c.description}
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(c)} className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded transition">ویرایش</button>
              <button onClick={() => handleDelete(c.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition">حذف</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Campaign;
