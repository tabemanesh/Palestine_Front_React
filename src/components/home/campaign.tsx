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
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!form.regionId.trim()) {
    //   alert("منطقه را انتخاب کنید");
    //   return;
    // }

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
    setForm({ 
      title: c.title, 
      description: c.description, 
      regionId: c.regionId,
      imgIds: c.imgIds || []
    });
    setEditingId(c.id);
  };

  const handleDelete = (id: string) => { 
    if (window.confirm("آیا مطمئن هستید؟")) dispatch(deleteCampaign(id));
  };

  return (
    <div className="container mx-auto p-6 rtl" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-600">پویش‌ها</h1>

      <form onSubmit={handleSubmit} className="bg-gray-50 shadow-md rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="عنوان کمپین"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            className="border border-gray-300 rounded-md w-full p-3"
          />
          <textarea
            placeholder="توضیحات"
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            className="border border-gray-300 rounded-md w-full p-3 md:col-span-2"
          />
          <input
            type="text"
            placeholder="شناسه منطقه"
            value={form.regionId}
            onChange={(e) => setForm(prev => ({ ...prev, regionId: e.target.value }))}
            className="border border-gray-300 rounded-md w-full p-3"
          />

          {/* انتخاب تصاویر */}
          <div className="md:col-span-2">
            <label className="block text-gray-600 mb-2">تصاویر کمپین</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="border border-gray-300 p-2 rounded-md w-full bg-gray-100"
            />
            {selectedFiles.length > 0 && (
              <ul className="mt-2 text-sm text-gray-600">
                {selectedFiles.map((file, idx) => <li key={idx}>{file.name}</li>)}
              </ul>
            )}
          </div>
        </div>

        <button type="submit" className={`mt-4 ${editingId ? "bg-blue-500" : "bg-green-600"} text-white py-2 px-6 rounded-md`}>
          {editingId ? "ویرایش" : "ثبت"}
        </button>

                <button
          type="button"
          onClick={() => {
            setForm({
              title: "", 
              description: "", 
              regionId: "",
              imgIds: []
            });
            setSelectedFiles([]);
          }}
          className="bg-amber-500 hover:bg-amber-600 mr-2 text-white font-semibold py-2 px-6 rounded-md transition"
        >
          پاک کردن فرم
        </button>
      </form>

      {loading && <p className="text-center text-gray-500">در حال بارگذاری...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <ul className="space-y-3">
        {campaigns.map((c) => (
          <li key={c.id} className="flex flex-col md:flex-row justify-between items-start bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition">
            <div>
              <strong className="text-blue-600">{c.title}</strong> - {c.description}
              <div className="text-sm text-gray-500 mt-1">
                منطقه: {c.regionName || c.regionId} | وضعیت: {c.status} | لایک: {c.totalLikeCount} | دیسلایک: {c.totalDislikeCount}
              </div>

              {/* نمایش تصاویر کمپین */}
              {c.imgIds && c.imgIds.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {c.imgIds.map((imgId) => (
                    <img key={imgId} src={`/api/File/${imgId}`} alt={c.title} className="w-20 h-20 object-cover rounded-md" />
                  ))}
                </div>
              )}
            </div>
            <div className="space-x-2 mt-2 md:mt-0">
              <button onClick={() => handleEdit(c)} className="bg-yellow-400 text-white px-3 py-1 rounded">ویرایش</button>
              <button onClick={() => handleDelete(c.id)} className="bg-red-500 text-white px-3 py-1 rounded">حذف</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Campaign;
