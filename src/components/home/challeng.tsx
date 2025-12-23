import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { CreateChallengeDto, ChallengeDto, UpdateChallengeDto } from "../../services/challengeService";
import { createChallenge, deleteChallenge, fetchChallenges, updateChallenge } from "../../reducers/challengeSlice";
import type { RootState, AppDispatch } from "../../store/strore";

const Challenge: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { challenges, loading } = useSelector((state: RootState) => state.challenge);

  const [form, setForm] = useState<CreateChallengeDto | UpdateChallengeDto>({
    title: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchChallenges());
  }, [dispatch]);

  const handleEdit = (c: ChallengeDto) => {
    setForm({
      title: c.title,
      description: c.description,
      id: c.id,
    });
    setEditingId(c.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dto: CreateChallengeDto | UpdateChallengeDto = { ...form, id: editingId || undefined };

    if (editingId) {
      await dispatch(updateChallenge(dto as UpdateChallengeDto));
      setEditingId(null);
    } else {
      await dispatch(createChallenge(dto as CreateChallengeDto));
    }

    setForm({ title: "", description: "" });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("آیا مطمئن هستید؟")) {
      dispatch(deleteChallenge(id));
    }
  };

  return (
    <div className="container mx-auto p-4 rtl" dir="rtl">
      {/* فرم ایجاد/ویرایش */}
      <form onSubmit={handleSubmit} className="bg-gray-50 shadow-md rounded-lg p-4 mb-6">
        <h6 className="text-2xl font-bold mb-4 text-center text-purple-600">چله‌ها</h6>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="عنوان چله"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <textarea
            placeholder="توضیحات"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 col-span-1 md:col-span-2"
          />
        </div>

        <div className="mt-3 flex gap-2">
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm">
            {editingId ? "ویرایش" : "ثبت"}
          </button>
          <button
            type="button"
            onClick={() => setForm({ title: "", description: "" })}
            className="bg-amber-500 hover:bg-amber-600 text-white py-1 px-3 rounded-md text-sm"
          >
            پاک کردن فرم
          </button>
        </div>
      </form>

      {/* جدول چله‌ها */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-xl text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-center border-b border-gray-300">ردیف</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">عنوان</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">توضیحات</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map((c, idx) => (
              <tr
                key={c.id}
                className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}
              >
                <td className="py-2 px-3 text-center border-b border-gray-200">{idx + 1}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{c.title}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{c.description}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-2 rounded text-xs transition"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
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

export default Challenge;
