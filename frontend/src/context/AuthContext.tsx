import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/users/me`,
            config
          );
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login/`,
        {
          username: username, // Django uses 'username' field by default
          password: password,
        }
      );

      const token = res.data.access;

      localStorage.setItem("token", token);
      setToken(token);
      setIsAuthenticated(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const userRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me/`,
        config
      );
      setUser(userRes.data);
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

 const register = async (username: string, email: string, password: string) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/register/`,
      { username, email, password }
    );

    const token = res.data.token;
    localStorage.setItem("token", token);
    setToken(token);
    setIsAuthenticated(true);
    setUser(res.data.user);
  } catch (err) {
    console.error("Registration failed:", err);
    throw err;
  }
};


  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
