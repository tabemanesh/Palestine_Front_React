import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { CreateScoreDto, ScoreDetailsDto } from "../../services/scoreService";
import { createScore, deleteScore, fetchScores } from "../../reducers/scoreSlice";
import type { RootState, AppDispatch } from "../../store/strore";

const Score: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { scores, loading, error } = useSelector((state: RootState) => state.score);

  const [form, setForm] = useState<CreateScoreDto>({
    activityType: 0,
    campaignId: undefined,
    empathyId: undefined,
    value: 0,
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchScores());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createScore(form));
    dispatch(fetchScores());
    setForm({ activityType: 0, campaignId: undefined, empathyId: undefined, value: 0 });
  };

  const handleEdit = (s: ScoreDetailsDto) => {
    setForm({
      activityType: s.activityType,
      campaignId: s.campaignId,
      empathyId: s.empathyId,
      value: s.value,
    });
    setEditingId(s.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("آیا مطمئن هستید؟")) {
      dispatch(deleteScore(id));
    }
  };

  return (
    <div className="container mx-auto p-6 rtl" dir="rtl">

      {/* فرم */}
      <h6 className="text-2xl font-bold mb-4 text-center text-red-600">امتیازات</h6>

      <form onSubmit={handleSubmit} className="bg-gray-50 shadow-md rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="number"
          placeholder="نوع فعالیت"
          value={form.activityType}
          onChange={(e) => setForm(prev => ({ ...prev, activityType: parseInt(e.target.value) }))}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="شناسه کمپین (اختیاری)"
          value={form.campaignId || ""}
          onChange={(e) => setForm(prev => ({ ...prev, campaignId: e.target.value || undefined }))}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="شناسه همدلی (اختیاری)"
          value={form.empathyId || ""}
          onChange={(e) => setForm(prev => ({ ...prev, empathyId: e.target.value || undefined }))}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="number"
          placeholder="مقدار امتیاز"
          value={form.value}
          onChange={(e) => setForm(prev => ({ ...prev, value: parseInt(e.target.value) }))}
          className="border border-gray-300 rounded-md p-2"
        />

        <div className="flex gap-2 md:col-span-4">
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md">
            {editingId ? "ویرایش" : "ثبت"}
          </button>
          <button type="button" onClick={() => { setForm({ activityType: 0, campaignId: undefined, empathyId: undefined, value: 0 }); setEditingId(null); }} className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md">
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
              <th className="py-2 px-3 text-center border-b border-gray-300">نوع فعالیت</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">کمپین</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">همدلی</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">امتیاز</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, idx) => (
              <tr key={s.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}>
                <td className="py-2 px-3 text-center border-b border-gray-200">{idx + 1}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{s.activityType}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{s.campaignId || "-"}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{s.empathyId || "-"}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{s.value}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(s)} className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-2 rounded text-xs">ویرایش</button>
                    <button onClick={() => handleDelete(s.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs">حذف</button>
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

export default Score;
