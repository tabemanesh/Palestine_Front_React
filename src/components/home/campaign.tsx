import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { CreateCampaignDto, UpdateCampaignDto, CampaignDetailsDto } from "../../services/campaignService";
import { fetchCampaigns, createCampaign, updateCampaign, deleteCampaign } from "../../reducers/campaignSlice";
import type { RootState, AppDispatch } from "../../store/strore";
import { uploadFile } from "../../services/documentService";

const Campaign: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { campaigns, loading, error } = useSelector((state: RootState) => state.campaign);

  const [form, setForm] = useState<CreateCampaignDto>({
    title: "",
    description: "",
    regionId: "",
    imgIds: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => { 
    dispatch(fetchCampaigns()); 
  }, [dispatch]);

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

    const dto: CreateCampaignDto | UpdateCampaignDto = {
      ...form,
      imgIds: uploadedIds,
      id: editingId || undefined
    };

    if (editingId) {
      dispatch(updateCampaign(dto as UpdateCampaignDto));
      setEditingId(null);
    } else {
      dispatch(createCampaign(dto as CreateCampaignDto));
    }

    setForm({ title: "", description: "", regionId: "", imgIds: [] });
    setSelectedFiles([]);
  };

  const handleEdit = (c: CampaignDetailsDto) => {
    setForm({ title: c.title, description: c.description, regionId: c.regionId, imgIds: c.imgIds || [] });
    setEditingId(c.id);
  };

  const handleDelete = (id: string) => { 
    if (window.confirm("آیا مطمئن هستید؟")) dispatch(deleteCampaign(id));
  };

  return (
    <div className="container mx-auto p-4 rtl" dir="rtl">

      {/* فرم */}
      <form onSubmit={handleSubmit} className="bg-gray-50 shadow-md rounded-lg p-4 mb-6">
        <h4 className="text-2xl font-bold mb-4 text-center text-red-600">پویش‌ها</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="عنوان کمپین"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <input
            type="text"
            placeholder="شناسه منطقه"
            value={form.regionId}
            onChange={(e) => setForm(prev => ({ ...prev, regionId: e.target.value }))}
            className="border border-gray-300 rounded-md p-2 text-sm"
          />
          <textarea
            placeholder="توضیحات"
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            className="border border-gray-300 rounded-md p-2 text-sm md:col-span-2"
          />


          {/* انتخاب تصاویر */}
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border border-gray-300 p-2 rounded-md w-full bg-gray-100 text-sm md:col-span-2"
          />
        </div>

        <div className="mt-3 flex gap-2">
          <button type="submit" className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm`}>
            {editingId ? "ویرایش" : "ثبت"}
          </button>
          <button
            type="button"
            onClick={() => {
              setForm({ title:"", description:"", regionId:"", imgIds:[] });
              setSelectedFiles([]);
            }}
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
              <th className="py-2 px-3 text-center border-b border-gray-300">منطقه</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, idx) => (
              <tr key={c.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}>
                <td className="py-2 px-3 text-center border-b border-gray-200">{idx + 1}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{c.title}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{c.description}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{c.regionName || c.regionId}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(c)} className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-2 rounded text-xs transition">
                      ویرایش
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs transition">
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

export default Campaign;
