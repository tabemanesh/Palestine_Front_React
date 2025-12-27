import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "../../reducers/panelSlice";
import type { RootState, AppDispatch } from "../../store/strore";

import { FaUsers } from "react-icons/fa";
import { IoPeople, IoStar } from "react-icons/io5";
import { MdCampaign, MdNoteAlt } from "react-icons/md";
import { GiLovers } from "react-icons/gi";

export default function Sidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const activeTab = useSelector((state: RootState) => state.panel.activeTab);

  const tabs = [
    { id: "martyrs", label: "قهرمانان", icon: <IoPeople /> },
    { id: "campaigns", label: "پویش", icon: <MdCampaign /> },
    { id: "empathies", label: "همدلی", icon: <GiLovers /> },
    { id: "blogs", label: "بلاگ", icon: <MdNoteAlt /> },
    { id: "challenges", label: "چالش ها", icon: <FaUsers /> },
    { id: "scores", label: "امتیازات", icon: <IoStar /> },
    { id: "users", label: "کاربران", icon: <FaUsers /> },
    { id: "questions", label: "پرسش و پاسخ", icon: <FaUsers /> },
    
  ];

  return (
    <div className="w-56 mt-5 mr-10 bg-white h-screen p-3 flex flex-col gap-3 border-r border-gray-200 shadow-lg">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => dispatch(setActiveTab(t.id))}
          className={`
            flex items-center gap-3 p-3 rounded-lg transition-all duration-200
            ${activeTab === t.id 
              ? "bg-blue-500 text-white shadow-md scale-105" 
              : "hover:bg-gray-100 hover:shadow-sm"}
          `}
        >
          <span className="text-xl">{t.icon}</span>
          <span className="flex-1 text-right text-sm font-medium">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
