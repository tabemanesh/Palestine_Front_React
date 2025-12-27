import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../reducers/userSlice"; 
import type { RootState, AppDispatch } from "../store/strore";
import { useNavigate, Link } from "react-router-dom";
import type { LoginUserDto } from "../services/userService";
import loginImg from "../assets/images/login.png";

const SignIn: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const selectIsLoggedIn = (state: RootState) => !!state.user.token;
  const { loading, error } = useSelector((state: RootState) => state.user);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [form, setForm] = useState<LoginUserDto>({
    usernameOrEmail: "",
    password: "",
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.usernameOrEmail || !form.password) return;

    dispatch(login(form));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 rtl" dir="rtl">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex justify-center mb-6">
          <img src={loginImg} alt="login" className="w-40 h-40 object-contain" />
        </div>

        <div className="flex items-center bg-gray-100 rounded-xl border border-gray-200 px-4 py-3 mb-4 focus-within:border-teal-500 transition">
          <span className="text-gray-400 ml-2 text-lg">👤</span>
          <input
            type="text"
            placeholder="نام کاربری یا ایمیل"
            className="bg-transparent outline-none w-full text-sm placeholder-gray-400"
            value={form.usernameOrEmail}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, usernameOrEmail: e.target.value }))
            }
          />
        </div>

        <div className="flex items-center bg-gray-100 rounded-xl border border-gray-200 px-4 py-3 mb-4 focus-within:border-teal-500 transition">
          <span className="text-gray-400 ml-2 text-lg">🔒</span>
          <input
            type="password"
            placeholder="رمز عبور"
            className="bg-transparent outline-none w-full text-sm placeholder-gray-400"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
          />
        </div>

        {error && <p className="text-red-600 text-xs mb-3 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full h-12 rounded-xl font-bold text-white transition-all duration-200
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700 active:scale-[0.98]"}`}
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>

        <p className="text-xs text-center mt-4 text-gray-600">
          حساب ندارید؟{" "}
          <Link to="/register" className="text-teal-600 font-bold hover:underline">
            ثبت‌نام کنید
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
