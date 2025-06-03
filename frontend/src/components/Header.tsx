import { Plus } from "lucide-react";

function Header({ setViewMode, viewMode, handleAddNew }: any) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
        <div className="flex items-center space-x-4 mt-4">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 font-semibold text-sm cursor-pointer ${
              viewMode === "list"
                ? "text-gray-900 border-b-2 border-purple-500"
                : "text-gray-400"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1 font-semibold text-sm cursor-pointer ${
              viewMode === "grid"
                ? "text-gray-900 border-b-2 border-purple-500"
                : "text-gray-400"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-3 py-1 font-semibold text-sm cursor-pointer ${
              viewMode === "calendar"
                ? "text-gray-900 border-b-2 border-purple-500"
                : "text-gray-400"
            }`}
          >
            Calendar
          </button>
        </div>
      </div>
      <button
        onClick={handleAddNew}
        className="relative bg-purple-700 hover:bg-purple-800 text-white w-40 py-2 rounded-lg flex items-center justify-center  space-x-2 transition-colors"
      >
        <Plus className="w-5 h-5 absolute left-3" />
        <span className="pl-4">Add New</span>
      </button>
    </div>
  );
}

export default Header;
