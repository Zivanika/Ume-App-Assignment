import { LogOut, Users } from "lucide-react";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="w-56 bg-white shadow-sm border-r border-gray-200 relative lg:block hidden">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-5 rounded-full bg-purple-600"></div>
            <div className="w-1.5 h-5 translate-y-1 rounded-full bg-cyan-400"></div>
            <div className="w-1.5 h-5 translate-y-2 rounded-full bg-pink-500"></div>
          </div>

          <span className="text-xl font-bold text-gray-900">ToDoi</span>
        </div>
      </div>

      <nav className="mt-8">
        <div className="px-6 space-y-2">
          <div className="flex items-center space-x-3 text-purple-600 py-2 bg-purple-50 rounded-lg px-3 cursor-pointer">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Meetings</span>
          </div>
        </div>
      </nav>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <button onClick={handleLogout}  className="flex items-center space-x-3 hover:bg-gray-50 py-2 rounded-lg px-3 text-gray-700  cursor-pointer">
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Log Out</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
