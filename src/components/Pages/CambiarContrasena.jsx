import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CambiarContrasena = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nuevaContrasena: "",
    confirmarContrasena: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.nuevaContrasena !== formData.confirmarContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9001/api/v1/login/actualizar-contrasena",
        {
          correo: user.correo,
          nuevaContrasena: formData.nuevaContrasena,
        },
      );
      console.log(response.data);
      if (response.data.token) {
        login(response.data);
      }
    } catch (error) {
      console.error(error);
      alert("Error al actualizar la contraseña");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-600 p-4 font-sans">
      <div className="w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-6 bg-white relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl"></div>

        {/* ENCABEZADO */}
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl shadow-lg shadow-amber-100 mb-4 rotate-3">
            {/* Icono de Llave o Seguridad */}
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
                d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
            Actualizar Clave
          </h2>
          <div className="h-1 w-12 bg-amber-500 mx-auto my-2 rounded-full"></div>
          <p className="text-slate-500 text-[11px] font-medium px-4">
            Por seguridad, debes cambiar tu contraseña inicial antes de
            continuar.
          </p>
        </div>

        <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
          {/* Nueva Contraseña */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">
              Nueva Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="nuevaContrasena"
              value={formData.nuevaContrasena}
              onChange={handleChange}
              className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:bg-white focus:outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:bg-white focus:outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Checkbox para mostrar contraseñas */}
          <div className="flex items-center ml-1">
            <input
              type="checkbox"
              id="show"
              className="rounded text-indigo-600 focus:ring-indigo-500 h-3 w-3"
              onChange={() => setShowPassword(!showPassword)}
            />
            <label
              htmlFor="show"
              className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter cursor-pointer"
            >
              Mostrar contraseñas
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95 mt-2 uppercase tracking-widest text-xs"
          >
            Guardar y Comenzar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CambiarContrasena;
