import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store/strore";
import { register, login, selectUserState, selectIsLoggedIn } from "../reducers/userSlice";
import loginImg from "../assets/images/login.png";

const SignUp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error } = useSelector(selectUserState);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/"); 
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ([firstName, lastName, username, email, phone, password].some(f => !f)) return;

    try {
      await dispatch(register({
        firstName,
        lastName,
        userName: username,
        email,
        phoneNumber: phone,
        password,
      })).unwrap();

      await dispatch(login({ usernameOrEmail: username, password })).unwrap();

    } catch (err) {
      console.error("SignUp Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        dir="rtl"
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex justify-center mb-6">
          <img
            src={loginImg}
            alt="signup"
            className="w-40 h-40 object-contain"
          />
        </div>

        {[
          { value: firstName, setter: setFirstName, placeholder: "نام", icon: "📝" },
          { value: lastName, setter: setLastName, placeholder: "نام خانوادگی", icon: "📝" },
          { value: username, setter: setUsername, placeholder: "نام کاربری", icon: "👤" },
          { value: email, setter: setEmail, placeholder: "ایمیل", icon: "📧" },
          { value: phone, setter: setPhone, placeholder: "شماره تلفن", icon: "📱" },
          { value: password, setter: setPassword, placeholder: "رمز عبور", icon: "🔒", type: "password" },
        ].map((input, idx) => (
          <div
            key={idx}
            className="flex items-center bg-gray-100 rounded-xl border border-gray-200 px-4 py-3 mb-4 focus-within:border-teal-500 transition"
          >
            <span className="text-gray-400 ml-2 text-lg">{input.icon}</span>
            <input
              type={input.type || "text"}
              placeholder={input.placeholder}
              className="bg-transparent outline-none w-full text-sm placeholder-gray-400"
              value={input.value}
              onChange={(e) => input.setter(e.target.value)}
            />
          </div>
        ))}

        {error && (
          <p className="text-red-600 text-xs mb-3 text-center">{error}</p>
        )}

        <button
          disabled={loading}
          className={`w-full h-12 rounded-xl font-bold text-white transition-all duration-200
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700 active:scale-[0.98]"}`}
        >
          {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
        </button>

        <p className="text-xs text-center mt-4 text-gray-600">
          حساب دارید؟{" "}
          <Link
            to="/login"
            className="text-teal-600 font-bold hover:underline"
          >
            ورود
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
