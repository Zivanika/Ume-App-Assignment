import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import MeetingsDashboard from "./Pages/Home";
import LoginPage from "./Pages/Login";
import RegisterPage from "./Pages/Register";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  return (
   
  <AuthProvider>
      <Router>
        <div>
          <Toaster />
          <Routes>
            {/* Protected route for dashboard */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <MeetingsDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Redirect any unknown routes to home (which will redirect to login if not authenticated) */}
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
   
  );
}

export default App;
