import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { CreateScoreDto, ScoreDetailsDto } from "../../services/scoreService";
import { createScore, deleteScore, fetchScores } from "../../reducers/scoreSlice";
import type { RootState, AppDispatch } from "../../store/strore";

const Score: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { scores, loading, error } = useSelector((state: RootState) => state.score);

  const [form, setForm] = useState<CreateScoreDto>({
    userId: "",
    activityType: 0,
    campaignId: undefined,
    empathyId: undefined,
    value: 0,
  });

  useEffect(() => {
    dispatch(fetchScores());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createScore(form));
    setForm({ userId: "", activityType: 0, campaignId: undefined, empathyId: undefined, value: 0 });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("آیا مطمئن هستید؟")) {
      dispatch(deleteScore(id));
    }
  };

  return (
    <div className="container mx-auto p-6 rtl" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">امتیازات کاربران</h1>

      <form onSubmit={handleSubmit} className="bg-gray-50 shadow-md rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
              className="peer border border-gray-300 rounded-md w-full p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 text-gray-800 transition"
            />
            <label className="absolute right-3 top-3 text-gray-500 text-sm transition-all peer-focus:top-1 peer-focus:text-blue-500">
              شناسه کاربر
            </label>
          </div>

          <div className="relative">
            <input
              type="number"
              value={form.activityType}
              onChange={(e) => setForm({ ...form, activityType: parseInt(e.target.value) })}
              className="peer border border-gray-300 rounded-md w-full p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 text-gray-800 transition"
            />
            <label className="absolute right-3 top-3 text-gray-500 text-sm transition-all peer-focus:top-1 peer-focus:text-blue-500">
              نوع فعالیت
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              value={form.campaignId || ""}
              onChange={(e) => setForm({ ...form, campaignId: e.target.value })}
              className="peer border border-gray-300 rounded-md w-full p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 text-gray-800 transition"
            />
            <label className="absolute right-3 top-3 text-gray-500 text-sm transition-all peer-focus:top-1 peer-focus:text-blue-500">
              شناسه کمپین (اختیاری)
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              value={form.empathyId || ""}
              onChange={(e) => setForm({ ...form, empathyId: e.target.value })}
              className="peer border border-gray-300 rounded-md w-full p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 text-gray-800 transition"
            />
            <label className="absolute right-3 top-3 text-gray-500 text-sm transition-all peer-focus:top-1 peer-focus:text-blue-500">
              شناسه همدلی (اختیاری)
            </label>
          </div>

          <div className="relative">
            <input
              type="number"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: parseInt(e.target.value) })}
              className="peer border border-gray-300 rounded-md w-full p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 text-gray-800 transition"
            />
            <label className="absolute right-3 top-3 text-gray-500 text-sm transition-all peer-focus:top-1 peer-focus:text-blue-500">
              مقدار امتیاز
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition"
        >
          ثبت
        </button>
      </form>

      {loading && <p className="text-center text-gray-500">در حال بارگذاری...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <ul className="space-y-3">
        {scores.map((s: ScoreDetailsDto) => (
          <li
            key={s.id}
            className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <div>
              <strong className="text-blue-600">{s.userFullName || s.userId}</strong> - امتیاز: {s.value} - نوع فعالیت: {s.activityType}
            </div>
            <div>
              <button
                onClick={() => handleDelete(s.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition"
              >
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Score;
