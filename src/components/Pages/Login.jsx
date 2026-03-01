import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
const Login = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    correo: "",
    contrasena: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:9001/api/v1/login",
        credentials,
      );
      if (response.data.token) {
        login(response.data);
      }
    } catch (error) {
      console.log(error);
      alert("Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-600 p-4 font-sans">
      <div className="w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-6 bg-white relative overflow-hidden">
        {/* Decoración de fondo sutil */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl"></div>
        {/* ENCABEZADO DISTINTIVO CRISTIANO */}
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-4 rotate-3 hover:rotate-0 transition-transform duration-300">
            {/* Icono de Cruz Minimalista */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="white"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-12h-15"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            DEVOCIONAL
          </h2>
          <div className="h-1 w-12 bg-indigo-500 mx-auto my-2 rounded-full"></div>
          <p className="text-slate-500 text-xs font-medium italic">
            "Lámpara es a mis pies tu palabra"
          </p>
        </div>
        <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
          {/* Campo Usuario */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">
              Correo
            </label>
            <input
              type="text"
              name="correo"
              value={credentials.correo}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:bg-white focus:outline-none transition-all"
              placeholder="diego.churata@secsanmartin.com"
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="contrasena" // IMPORTANTE: Debe coincidir con el estado
                value={credentials.contrasena} // IMPORTANTE: Vincula el valor al estado
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:bg-white focus:outline-none pr-10 transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-slate-400 hover:text-indigo-600"
              >
                {/* ... (SVG del ojo igual) ... */}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95 mt-2 uppercase tracking-widest text-xs"
          >
            Ingresar a mi Devocional
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
