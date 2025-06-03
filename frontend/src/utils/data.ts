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

export const initialMeetings: Meeting[] = [
  {
    id: 1,
    agenda: "",
    description: "",
    status: "Upcoming",
    date: "",
    start_time: "",
    meeting_url: "https://www.todoi.com...",
    owner: 1,
    created_at: "",
  },
];

export const statusColors = {
  Upcoming: "bg-blue-100 text-blue-800",
  "In Review": "bg-yellow-100 text-yellow-800",
  Cancelled: "bg-red-100 text-red-800",
  Overdue: "bg-orange-100 text-orange-800",
  Published: "bg-green-100 text-green-800",
};
