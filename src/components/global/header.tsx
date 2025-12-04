import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../reducers/uiSlider";
import type { AppDispatch } from "../../store/strore";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { getDailyHadith, type HadithResult } from "../../services/documentService";

export default function Header() {
    const dispatch = useDispatch<AppDispatch>();
    const [hadith, setHadith] = useState<HadithResult | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchHadith = async () => {
            try {
                const response = await getDailyHadith();
                if (response.ok) {
                    setHadith(response.result);
                }
            } catch (err) {
                console.error("Error fetching hadith:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHadith();
    }, []);

    return (
        <header className="w-full bg-white shadow-md flex flex-col md:flex-row justify-between px-10 py-4 md:py-0 h-auto md:h-16">

            <div className="flex items-center gap-4 mb-2 md:mb-0">
                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="p-2 rounded hover:bg-gray-100 transition"
                >
                    <FaBars className="text-gray-700" />
                </button>
            </div>

            <div className="flex-1 flex justify-center items-center">
                {loading ? (
                    <p className="text-green-700 font-semibold text-sm">در حال بارگذاری حدیث...</p>
                ) : hadith ? (
                    <p className="text-green-700 font-semibold text-sm text-center">
                        "{hadith.text}" — <strong>{hadith.person}</strong> (
                        <span className="text-green-300">{hadith.source}</span>)
                    </p>
                ) : (
                    <p className="text-green-700 font-semibold text-sm">حدیثی یافت نشد.</p>
                )}
            </div>


            <div className="flex items-center gap-2 mt-2 md:mt-0">
                <button className="p-2 rounded hover:bg-gray-100 transition">
                    <FaSignOutAlt className="text-gray-700" />
                </button>
            </div>
        </header>
    );
}
