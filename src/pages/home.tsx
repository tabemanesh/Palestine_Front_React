import { useSelector } from "react-redux";
import type { RootState } from "../store/strore"; 
import PageLayout from "../components/global/pageLayout";
import Dashboard from "../components/home/dashboard";
import Users from "../components/home/users";
import Settings from "../components/home/setting";
import Sidebar from "../components/home/slidebar";
import Header from "../components/global/header";
import Martyr from "../components/home/martyr";
import Campaign from "../components/home/campaign";
import Empathy from "../components/home/empathy";
import Blog from "../components/home/blog";
import Score from "../components/home/score";
import QuestionAdminPanel from "../components/home/questio";



export default function Home() {
  const activeTab = useSelector((state: RootState) => state.panel.activeTab);
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <Users />;
      case "settings":
        return <Settings />;
      case "martyrs":
        return <Martyr />;
      case "campaigns":
        return <Campaign />;
      case "empathies":
        return <Empathy />;
      case "blogs":
        return <Blog />;
      case "scores":
        return <Score />;
      case "questions":
        return <QuestionAdminPanel />;
      default:
        return <Dashboard />;
    }
  };
 
  return (
    <PageLayout>
      <Header />
      <div className="flex w-full h-[calc(100vh-64px)]">
        {sidebarOpen && <Sidebar />}
        <div className="flex-1 p-6">{renderContent()}</div>
      </div>
    </PageLayout>
  );
}

