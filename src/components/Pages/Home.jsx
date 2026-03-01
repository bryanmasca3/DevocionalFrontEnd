import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
const Home = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [rowData, setRowData] = useState([]);
  const API_URL = "https://devocionalbackend.onrender.com/api/v1/devocional/usuario";

  // 📡 Obtener devocionales
  const fetchDevocional = async () => {
    try {
      const response = await axios.get(API_URL,{
            headers:{
              Authorization: `Bearer ${user.token}`,
            }
          });
          console.log(response.data);
      setRowData(response.data);
    } catch (error) {
      console.error("Error al cargar devocional:", error);
    }
  };

  useEffect(() => {
    fetchDevocional();
  }, []);

  // 📅 Fechas actuales
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.toLocaleString("es-ES", { month: "long" });
  const currentYear = today.getFullYear();

  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // 📆 Comparar fechas
 const esMismaFecha = (fechaISO, diaCalendario) => {
  const fechaString = fechaISO.split("T")[0]; // "2026-02-10"

  const hoy = new Date();
  const mesActual = String(hoy.getMonth() + 1).padStart(2, "0");
  const anioActual = hoy.getFullYear();

  const fechaComparar = `${anioActual}-${mesActual}-${String(
    diaCalendario
  ).padStart(2, "0")}`;

  return fechaString === fechaComparar;
};

  // 🎨 Estado visual del día
  const getDayStatus = (day) => {
    const devocionalDelDia = rowData.find((d) =>
      esMismaFecha(d.fecha_publicacion, day)
    );

    // ⚪ Futuro
    if (day > currentDay) {
      return "bg-white text-slate-400 border border-slate-200";
    }

    // 🟡 Hoy pendiente
    if (day === currentDay && !devocionalDelDia) {
      return "bg-yellow-400 text-white ring-4 ring-yellow-200 shadow-lg";
    }

    // ⚫ Pasado sin completar
    if (day < currentDay && !devocionalDelDia) {
      return "bg-gray-300 text-gray-500";
    }

    // 🟢 / 🔴 Completados
    return devocionalDelDia?.success
      ? "bg-green-500 text-white shadow-md"
      : "bg-red-500 text-white shadow-md";
  };

  // 👉 Click en día
  const handleDevocional = (day) => {
    const devocionalDelDia = rowData.find((d) =>
      esMismaFecha(d.fecha_publicacion, day)
    );

    if (devocionalDelDia) {
      navigate(`/devocional/${devocionalDelDia._id}`);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 font-sans bg-slate-50">
      <div className="max-w-6xl mx-auto">

        {/* 🏷️ Título */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-4 capitalize">
            Calendario de Devocionales — {currentMonth} {currentYear}
          </h1>

          {/* 📘 Leyenda */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-green-500"></span>
              Completado exitoso
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-red-500"></span>
              Completado con errores / no completado
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-gray-300"></span>
              Sin Devocional
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-yellow-400"></span>
              Hoy pendiente
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-white border border-slate-200"></span>
              Futuro
            </div>
          </div>
        </div>

        {/* 🗓️ Grilla */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {daysArray.map((day) => {
            const devocionalEncontrado = rowData.find((d) =>
              esMismaFecha(d.fecha_publicacion, day)
            );

            return (
              <div
                key={day}
                onClick={() => handleDevocional(day)}
                className={`
                  relative h-32 md:h-40 rounded-2xl cursor-pointer
                  flex flex-col items-center justify-center
                  transition-all hover:scale-105 active:scale-95
                  ${getDayStatus(day)}
                `}
              >
                <span className="text-3xl font-black mb-1">{day}</span>
                <span className="text-xs uppercase tracking-widest font-bold opacity-80">
                  Día
                </span>

                {devocionalEncontrado && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white/70"></div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Home;