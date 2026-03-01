import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
const AvanceDetalle = () => {
  const { user } = useAuth();
   const { id } = useParams();
  const [data, setData] = useState([]);

  const API_URL = `https://devocionalbackend.onrender.com/api/v1/avance/${id}/usuario`;

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(response.data);
      setData(response.data);
    };

    fetchData();
  }, []);

  const year = new Date().getFullYear();

  const meses = Array.from({ length: 12 }, (_, i) => i);

  const obtenerDiasDelMes = (mes) => {
    return new Date(year, mes + 1, 0).getDate();
  };

  const existeDevocional = (mes, dia) => {
    const fecha = `${year}-${String(mes + 1).padStart(2, "0")}-${String(
      dia,
    ).padStart(2, "0")}`;

    return data.find((d) => d.fecha_publicacion.split("T")[0] === fecha);
  };

  const getColor = (mes, dia) => {
    const dev = existeDevocional(mes, dia);

    if (!dev) return "bg-gray-300";

    return dev.success ? "bg-green-500" : "bg-red-500";
  };

  return (
    <div className="min-h-screen p-10 bg-slate-50">
      <h1 className="text-3xl font-bold text-center mb-10">
        Avance Anual {year}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {meses.map((mes) => {
          const dias = obtenerDiasDelMes(mes);

          return (
            <div key={mes} className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-bold mb-4 capitalize">
                {new Date(year, mes).toLocaleString("es-ES", {
                  month: "long",
                })}
              </h2>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: dias }, (_, i) => (
                  <div
                    key={i}
                    className={`
    w-8 h-8 
    flex items-center justify-center
    text-[10px] font-bold text-white
    rounded-md
    transition-all hover:scale-110
    ${getColor(mes, i + 1)}
  `}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvanceDetalle;
