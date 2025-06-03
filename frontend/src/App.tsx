import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import MeetingsDashboard from "./Pages/Home";
import LoginPage from "./Pages/Login";
import RegisterPage from "./Pages/Register";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          {/* <ScrollToTop /> */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<MeetingsDashboard />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
