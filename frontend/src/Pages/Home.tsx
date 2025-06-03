import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Check,
  MoreVertical,
} from "lucide-react";
import { initialMeetings, statusColors } from "../utils/data";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import axios from "axios";
import AnimatedLoader from "../components/Loader";
import toast, { Toaster } from "react-hot-toast";

import {
  convertDateToDjangoFormat,
  convertTimeToDjangoFormat,
  convertDjangoDateToDisplay,
  convertDjangoTimeToDisplay,
} from "../utils/conversions";

interface Meeting {
  id: number;
  agenda: string;
  description?: string; // Optional field from Django model
  status: "Upcoming" | "In Review" | "Cancelled" | "Overdue" | "Published";
  date: string; // Format: YYYY-MM-DD
  start_time: string; // Format: HH:MM:SS
  meeting_url: string;
  owner: number; // User ID
  created_at: string; // ISO datetime string
}
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ5NTExNTAzLCJpYXQiOjE3NDg5MDY3MDMsImp0aSI6ImNiN2ExZDQxODFjYjRlYmU4ZjhmMDA4ZDIxNzcwNDU2IiwidXNlcl9pZCI6Mn0.Rjd3kt347G93D8dY5zxL46xoH1swCWmG1i79wMovMuU";

const MeetingsDashboard = () => {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedMeeting, setSelectedMeeting] = useState<number | null>(1);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    agenda: "",
    description: "",
    status: "Upcoming" as Meeting["status"],
    date: "",
    start_time: "",
    meeting_url: "",
  });
  // API base configuration
  const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get("/meetings/");
      setMeetings(response.data);
    } catch (error: any) {
      console.error("Error fetching meetings:", error);
      setError(error.response?.data?.detail || "Failed to fetch meetings");
    } finally {
      setIsLoading(false);
    }
  };
  const createMeeting = async (meetingData: typeof formData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Convert formats before sending to Django
      const convertedData = {
        ...meetingData,
        date: convertDateToDjangoFormat(meetingData.date),
        start_time: convertTimeToDjangoFormat(meetingData.start_time),
      };

      const response = await apiClient.post("/meetings/", convertedData);
      setMeetings((prev) => [...prev, response.data]);
      return response.data;
    } catch (error: any) {
      console.error("Error creating meeting:", error);
      setError(error.response?.data?.detail || "Failed to create meeting");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMeeting = async (id: number, meetingData: typeof formData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Convert formats before sending to Django
      const convertedData = {
        ...meetingData,
        date: convertDateToDjangoFormat(meetingData.date),
        start_time: convertTimeToDjangoFormat(meetingData.start_time),
      };

      const response = await apiClient.put(`/meetings/${id}/`, convertedData);
      setMeetings((prev) =>
        prev.map((meeting) => (meeting.id === id ? response.data : meeting))
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating meeting:", error);
      setError(error.response?.data?.detail || "Failed to update meeting");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced form validation with format checking
  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.agenda.trim()) {
      errors.push("Agenda is required");
    }

    if (!formData.date.trim()) {
      errors.push("Date is required");
    } else {
      try {
        convertDateToDjangoFormat(formData.date);
      } catch {
        errors.push(
          "Invalid date format. Use formats like 'Sep 18, 2020' or '2020-09-18'"
        );
      }
    }

    if (!formData.start_time.trim()) {
      errors.push("Start time is required");
    } else {
      try {
        convertTimeToDjangoFormat(formData.start_time);
      } catch {
        errors.push(
          "Invalid time format. Use formats like '10:00 AM' or '14:30'"
        );
      }
    }

    if (!formData.meeting_url.trim()) {
      errors.push("Meeting URL is required");
    }

    return errors;
  };

  // Delete meeting
  const deleteMeeting = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await apiClient.delete(`/meetings/${id}/`);
      setMeetings((prev) => prev.filter((meeting) => meeting.id !== id));
      setDropdownOpen(null);
      if (selectedMeeting === id) {
        setSelectedMeeting(null);
      }
    } catch (error: any) {
      console.error("Error deleting meeting:", error);
      setError(error.response?.data?.detail || "Failed to delete meeting");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMeetings();
    }
  }, [token]);

  // Event handlers
  const handleAddNew = () => {
    setEditingMeeting(null);
    setFormData({
      agenda: "",
      description: "",
      status: "Upcoming",
      date: "",
      start_time: "",
      meeting_url: "",
    });
    setShowForm(true);
    setError(null);
  };

  const handleRowClick = (meetingId: number) => {
    setSelectedMeeting(selectedMeeting === meetingId ? null : meetingId);
  };

  const toggleDropdown = (meetingId: number) => {
    setDropdownOpen(dropdownOpen === meetingId ? null : meetingId);
  };

  const handleEdit = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setFormData({
      agenda: meeting.agenda,
      description: meeting.description || "",
      status: meeting.status,
      date: convertDjangoDateToDisplay(meeting.date),
      start_time: convertDjangoTimeToDisplay(meeting.start_time),
      meeting_url: meeting.meeting_url,
    });
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id: number) => {
    await deleteMeeting(id);
  };
  const handleSubmit = async () => {
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setError(validationErrors.join(". "));
      return;
    }

    const meetingPromise = editingMeeting
      ? updateMeeting(editingMeeting.id, formData)
      : createMeeting(formData);

    await toast
      .promise(meetingPromise, {
        loading: editingMeeting ? "Updating meeting..." : "Creating meeting...",
        success: editingMeeting ? "Meeting updated!" : "Meeting created!",
        error: "Something went wrong.",
      })
      .then(() => {
        setShowForm(false);
        setEditingMeeting(null);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Toaster />
      <Sidebar />
      <div className="flex-1">
        <div className="p-8">
          <Header
            setViewMode={setViewMode}
            viewMode={viewMode}
            handleAddNew={handleAddNew}
          />

          {isLoading ? (
            <AnimatedLoader />
          ) : error ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="hidden lg:block px-6 py-3">
                <div className="grid grid-cols-7 gap-4">
                  <div className="text-sm font-medium text-gray-700 col-span-2">
                    Agenda
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    Status
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    Date of meeting
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    Start Time
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    Meeting URL
                  </div>
                  <div className="text-sm font-medium text-gray-700"></div>
                </div>
              </div>

              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  onClick={() => handleRowClick(meeting.id)}
                  className={` bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-all ${
                    selectedMeeting === meeting.id
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="hidden lg:block">
                    <div className="px-6 py-4 grid grid-cols-7 gap-4 items-center">
                      <div className="flex items-center space-x-3 col-span-2">
                        {selectedMeeting === meeting.id && (
                          <div className="w-5 h-5 border-2 shadow shadow-green-200 border-green-500 rounded bg-green-50 flex items-center justify-center">
                            <Check className="w-3 h-3 text-green-500" />
                          </div>
                        )}
                        {selectedMeeting !== meeting.id && (
                          <div className="w-5 h-5 border-2 shadow shadow-gray-100 border-gray-200 rounded bg-gray-50 flex items-center justify-center"></div>
                        )}
                        <span className="text-sm text-gray-900 font-semibold">
                          {meeting.agenda}
                        </span>
                      </div>

                      <div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[meeting.status]
                          }`}
                        >
                          {meeting.status}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600">
                        {meeting.date}
                      </div>

                      <div className="text-sm text-gray-600">
                        {meeting.start_time}
                      </div>

                      <div>
                        <a
                          href="#"
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {meeting.meeting_url}
                        </a>
                      </div>

                      <div
                        className="flex items-center justify-end space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-center items-center w-6 h-6 bg-gray-100 cursor-pointer text-gray-800 rounded-full">
                          <Plus className="w-4 h-4" />
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(meeting.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>

                          {dropdownOpen === meeting.id && (
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                              <button
                                onClick={() => {
                                  handleEdit(meeting);
                                  setDropdownOpen(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <Edit2 className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(meeting.id)}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Mobile Layout */}
                  <div className="lg:hidden px-4 py-4">
                    <div className="space-y-3">
                      {/* Header Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {selectedMeeting === meeting.id && (
                            <div className="w-5 h-5 border-2 shadow shadow-green-200 border-green-500 rounded bg-green-50 flex items-center justify-center">
                              <Check className="w-3 h-3 text-green-500" />
                            </div>
                          )}
                          {selectedMeeting !== meeting.id && (
                            <div className="w-5 h-5 border-2 shadow shadow-gray-100 border-gray-200 rounded bg-gray-50 flex items-center justify-center"></div>
                          )}
                          <span className="text-sm text-gray-900 font-semibold">
                            {meeting.agenda}
                          </span>
                        </div>

                        <div
                          className="flex items-center space-x-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              statusColors[meeting.status]
                            }`}
                          >
                            {meeting.status}
                          </span>
                          <div className="relative">
                            <button
                              onClick={() => toggleDropdown(meeting.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>

                            {dropdownOpen === meeting.id && (
                              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                                <button
                                  onClick={() => {
                                    handleEdit(meeting);
                                    setDropdownOpen(null);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDelete(meeting.id)}
                                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <span className="text-gray-500">Date: </span>
                          <span className="text-gray-700">{meeting.date}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Time: </span>
                          <span className="text-gray-700">
                            {meeting.start_time}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <a
                          href="#"
                          className="text-sm text-blue-600 hover:text-blue-800 underline truncate"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {meeting.meeting_url}
                        </a>
                        <div
                          className="flex items-center space-x-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-center items-center w-6 h-6 bg-gray-100 cursor-pointer text-gray-800 rounded-full">
                            <Plus className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Meeting Modal */}
      {showForm && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingMeeting ? "Edit Meeting" : "Add New Meeting"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agenda *
                </label>
                <input
                  type="text"
                  value={formData.agenda}
                  onChange={(e) => handleInputChange("agenda", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter meeting agenda"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="In Review">In Review</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., 18 Sep 2020"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="text"
                  value={formData.start_time}
                  onChange={(e) =>
                    handleInputChange("start_time", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., 7:10 AM"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting URL
                </label>
                <input
                  type="text"
                  value={formData.meeting_url}
                  onChange={(e) =>
                    handleInputChange("meeting_url", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://www.todoi.com..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {editingMeeting ? "Update Meeting" : "Add Meeting"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsDashboard;
