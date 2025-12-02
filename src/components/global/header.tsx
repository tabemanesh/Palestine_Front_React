import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../reducers/uiSlider";
import type { AppDispatch } from "../../store/strore";
import { FaBars, FaSignOutAlt } from "react-icons/fa";

export default function Header() {
    const dispatch = useDispatch<AppDispatch>();
    return (
        <header className="w-full bg-white shadow-md flex items-center justify-between px-6 h-16">


            <div className="flex items-center gap-4">
                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="p-2 rounded hover:bg-gray-100 transition"
                >
                    <FaBars className="text-gray-700" />
                </button>
            </div>


            <div className="flex items-center gap-2">
                <button className="p-2 rounded hover:bg-gray-100 transition">
                    <FaSignOutAlt className="text-gray-700" />
                </button>
            </div>
        </header>
    );
}
