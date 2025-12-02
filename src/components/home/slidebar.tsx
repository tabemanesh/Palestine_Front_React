import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../reducers/panelSlice";
import type { RootState, AppDispatch } from "../../store/strore";

import { FaTachometerAlt, FaUsers, FaCog } from "react-icons/fa";

export default function Sidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const activeTab = useSelector((state: RootState) => state.panel.activeTab);

  const tabs = [
    { id: "dashboard", label: "داشبورد", icon: <FaTachometerAlt /> },
    { id: "users", label: "کاربران", icon: <FaUsers /> },
    { id: "settings", label: "تنظیمات", icon: <FaCog /> },
  ];

  return (
    <div className="w-60 bg-gray-100 h-full border-l border-gray-300 p-4 flex flex-col gap-2">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => dispatch(setActiveTab(t.id))}
          className={`flex items-center gap-3 p-3 rounded transition-colors
            ${activeTab === t.id ? "bg-blue-500 text-white" : "hover:bg-gray-200"}
          `}
        >
          <span className="text-lg">{t.icon}</span>
          <span className="flex-1 text-right">{t.label}</span> 
        </button>
      ))}
    </div>
  );
}
