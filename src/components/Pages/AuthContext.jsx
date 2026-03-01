import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("token");
    if (data) {
      try {
        const parsedData = JSON.parse(data); // El token guardado es un JSON string
        setUser(parsedData.user); // Ahora sí podemos acceder a .user
      } catch (e) {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem("token", JSON.stringify(data));
    setUser(data.user);
    console.log("-------------------------------------")
    console.log(data);
    console.log("-------------------------------------")
    if (data.user.login_inicial) {
      navigate("/cambiarcontrasena");
    } else {
      navigate("/");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
