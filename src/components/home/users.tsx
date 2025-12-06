import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { CreateUserDto, UpdateUserDto, UserDto } from "../../services/userService";
import { createUser, updateUser, deleteUser, fetchUsers } from "../../reducers/userSlice";
import type { RootState, AppDispatch } from "../../store/strore";
import { uploadFile } from "../../services/documentService";

const User: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector((state: RootState) => state.user);

  const [form, setForm] = useState<CreateUserDto>({
    userName: "",
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    phoneNumber: undefined,
    password: "",
    imgId: undefined,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imgId = form.imgId;

    if (selectedFile) {
      try {
        imgId = await uploadFile(selectedFile);
      } catch (err) {
        console.error("Upload failed:", err);
        return;
      }
    }

    if (editingId) {
      const dto: UpdateUserDto = {
        id: editingId,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        imgId,
      };
      await dispatch(updateUser(dto));
      setEditingId(null);
    } else {
      await dispatch(createUser({ ...form, imgId }));
    }

    setForm({ userName: "", firstName: undefined, lastName: undefined, email: undefined, phoneNumber: undefined, password: "", imgId: undefined });
    setSelectedFile(null);
    dispatch(fetchUsers());
  };

  const handleEdit = (u: UserDto) => {
    setForm({
      userName: u.userName,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phoneNumber: u.phoneNumber,
      password: "",
      imgId: u.imgId,
    });
    setEditingId(u.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("آیا مطمئن هستید؟")) dispatch(deleteUser(id));
  };

  return (
    <div className="container mx-auto p-6 rtl" dir="rtl">

      {/* فرم */}
      <h6 className="text-2xl font-bold mb-4 text-center text-red-600">کاربران</h6>
      <form onSubmit={handleSubmit} className="bg-gray-50 shadow-md rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {!editingId && (
          <>
            <input
              type="text"
              placeholder="نام کاربری"
              value={form.userName}
              onChange={(e) => setForm(prev => ({ ...prev, userName: e.target.value }))}
              className="border border-gray-300 rounded-md p-2"
              required
            />
            <input
              type="password"
              placeholder="رمز عبور"
              value={form.password}
              onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
              className="border border-gray-300 rounded-md p-2"
              required
            />
          </>
        )}
        <input
          type="text"
          placeholder="نام"
          value={form.firstName || ""}
          onChange={(e) => setForm(prev => ({ ...prev, firstName: e.target.value || undefined }))}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="نام خانوادگی"
          value={form.lastName || ""}
          onChange={(e) => setForm(prev => ({ ...prev, lastName: e.target.value || undefined }))}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="email"
          placeholder="ایمیل"
          value={form.email || ""}
          onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value || undefined }))}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="شماره تلفن"
          value={form.phoneNumber || ""}
          onChange={(e) => setForm(prev => ({ ...prev, phoneNumber: e.target.value || undefined }))}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-md p-2 md:col-span-3"
        />
        <div className="flex gap-2 md:col-span-3">
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md">
            {editingId ? "ویرایش" : "ثبت"}
          </button>
          <button type="button" onClick={() => { setForm({ userName: "", firstName: undefined, lastName: undefined, email: undefined, phoneNumber: undefined, password: "", imgId: undefined }); setSelectedFile(null); setEditingId(null); }} className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md">
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
              <th className="py-2 px-3 text-center border-b border-gray-300">نام کاربری</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">نام</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">نام خانوادگی</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">ایمیل</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">شماره تلفن</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">تصویر</th>
              <th className="py-2 px-3 text-center border-b border-gray-300">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={u.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}>
                <td className="py-2 px-3 text-center border-b border-gray-200">{idx + 1}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{u.userName}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{u.firstName || "-"}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{u.lastName || "-"}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{u.email || "-"}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">{u.phoneNumber || "-"}</td>
                <td className="py-2 px-3 text-center border-b border-gray-200">
                  {u.imgId && <img src={`/files/${u.imgId}`} alt="user" className="w-16 h-16 rounded mx-auto" />}
                </td>
                <td className="py-2 px-3 text-center border-b border-gray-200">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(u)} className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-2 rounded text-xs">ویرایش</button>
                    <button onClick={() => handleDelete(u.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs">حذف</button>
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

export default User;
