import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
const Home = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [rowData, setRowData] = useState([]);
  const [viewedMonthStart, setViewedMonthStart] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });
  const API_URL = "https://devocionalbackend.onrender.com/api/v1/devocional/usuario";

  const fetchDevocional = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          year: viewedMonthStart.getFullYear(),
          month: viewedMonthStart.getMonth() + 1,
        },
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(response.data);
      setRowData(response.data);
    } catch (error) {
      console.error("Error al cargar devocional:", error);
    }
  };


  useEffect(() => {       
    fetchDevocional();
  }, [viewedMonthStart, user?.token]);

  // 📅 Mes en pantalla (por defecto: mes actual)
  const today = new Date();
  const currentDay = today.getDate();
  const viewYear = viewedMonthStart.getFullYear();
  const viewMonth = viewedMonthStart.getMonth();
  const currentMonth = viewedMonthStart.toLocaleString("es-ES", {
    month: "long",
  });
  const currentYear = viewYear;

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isViewingCurrentMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const isPastMonth =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth < today.getMonth());

  const isFutureMonth =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const goPrevMonth = () => {
    setViewedMonthStart(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const goNextMonth = () => {
    setViewedMonthStart(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  // 📆 Comparar fechas (respecto al mes visible)
  const esMismaFecha = (fechaISO, diaCalendario) => {
    const fechaString = fechaISO.split("T")[0];
    const mesVisible = String(viewMonth + 1).padStart(2, "0");
    const fechaComparar = `${viewYear}-${mesVisible}-${String(
      diaCalendario,
    ).padStart(2, "0")}`;
    return fechaString === fechaComparar;
  };

  // 🎨 Estado visual del día
  const getDayStatus = (day) => {
    console.log(day);
    console.log("-------------------------------------");
    console.log(currentDay);
    console.log("-------------------------------------");
    const devocionalDelDia = rowData.find((d) =>
      esMismaFecha(d.fecha_publicacion, day),
    );

    if (isFutureMonth) {
      return "bg-white text-slate-400 border border-slate-200";
    }

    if (isPastMonth) {
      if (!devocionalDelDia) {
        return "bg-gray-300 text-gray-500";
      }
      return devocionalDelDia?.success
        ? "bg-green-500 text-white shadow-md"
        : "bg-red-500 text-white shadow-md";
    }

    // Mes actual (misma lógica que antes)
    if (day > currentDay) {
      return "bg-white text-slate-400 border border-slate-200";
    }

    if (day === currentDay && !devocionalDelDia) {
      return "bg-yellow-400 text-white ring-4 ring-yellow-200 shadow-lg";
    }

    if (day < currentDay && !devocionalDelDia) {
      return "bg-gray-300 text-gray-500";
    }

    return devocionalDelDia?.success
      ? "bg-green-500 text-white shadow-md"
      : "bg-red-500 text-white shadow-md";
  };

  // 👉 Click en día
  const handleDevocional = (day) => {
    const devocionalDelDia = rowData.find((d) =>
      esMismaFecha(d.fecha_publicacion, day),
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
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-2 mb-2">
          <button
            type="button"
            onClick={goPrevMonth}
            className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:px-5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold leading-none text-slate-500 transition-colors group-hover:bg-slate-200 group-hover:text-slate-700"
              aria-hidden
            >
              ‹
            </span>
            <span className="pr-1">Mes anterior</span>
          </button>
          <button
            type="button"
            onClick={goNextMonth}
            className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:px-5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
          >
            <span className="pl-1">Mes siguiente</span>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold leading-none text-slate-500 transition-colors group-hover:bg-slate-200 group-hover:text-slate-700"
              aria-hidden
            >
              ›
            </span>
          </button>
        </div>
        {/* 🗓️ Grilla */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {daysArray.map((day) => {
            const devocionalEncontrado = rowData.find((d) =>
              esMismaFecha(d.fecha_publicacion, day),
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
