import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
ModuleRegistry.registerModules([AllCommunityModule]);

const Devocional = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [rowData, setRowData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [nuevoDevocional, setNuevoDevocional] = useState({
    titulo: "",
    descripcion: "",
    fecha_publicacion: new Date().toISOString().split("T")[0],
  });

  const API_URL = "https://devocionalbackend.onrender.com/api/v1/devocional";

  const fetchDevocional = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log(response.data); 
      setRowData(response.data);
    } catch (error) {
      console.error("Error al cargar devocional:", error);
    }
  };

  useEffect(() => {
    fetchDevocional();
  }, []);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este devocional?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchDevocional();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };
  const handleEditarClick = (data) => {
    setEditingId(data._id);
    setNuevoDevocional({
      titulo: data.titulo,
      descripcion: data.descripcion,
      fecha_publicacion: data.fecha_publicacion,
    });
    setIsModalOpen(true);
  };
  const handlePreguntasClick = (data) => {
    navigate(`/devocional/${data._id}/preguntas`);
  };

  const [colDefs] = useState([
    { field: "titulo", headerName: "Título", flex: 1, minWidth: 150 },
    { field: "descripcion", headerName: "Descripción", flex: 2, minWidth: 250 },
    {
      field: "fecha_publicacion",
      headerName: "Fecha de publicación",
      flex: 1,
      minWidth: 150,
      valueFormatter: (params) => {
        if (!params.value) return "Sin fecha";
        const fecha = new Date(params.value);
        return fecha.toISOString().split("T")[0];
      },
    },
    {
      headerName: "Acciones",
      cellRenderer: (params) => (
        <div className="flex gap-2 items-center h-full justify-center">
          <button
            onClick={() => handlePreguntasClick(params.data)}
            className="p-1.5 bg-sky-100 text-sky-600 hover:bg-sky-600 hover:text-white rounded-md transition-colors shadow-sm"
            title="Ver"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
          <button
            onClick={() => handleEditarClick(params.data)}
            className="p-1.5 bg-amber-100 text-amber-600 hover:bg-amber-600 hover:text-white rounded-md transition-colors shadow-sm"
            title="Editar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button
            onClick={() => handleEliminar(params.data._id)}
            className="p-1.5 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-md transition-colors shadow-sm"
            title="Eliminar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ),
      width: 110,
      pinned: "right",
    },
  ]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, nuevoDevocional);
      } else {
        await axios.post(API_URL, nuevoDevocional);
      }
      cerrarModal();
      fetchDevocional();
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNuevoDevocional({
      titulo: "",
      descripcion: "",
      fecha_publicacion: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans">
      <div className="mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Panel de Devocionales
            </h1>
            <p className="text-slate-500 text-sm">
              Administra el contenido espiritual de tu plataforma
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-indigo-200 active:scale-95"
          >
            <span>+ Nuevo Devocional</span>
          </button>
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div
            className="ag-theme-quartz"
            style={{ height: 500, width: "100%" }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={colDefs}
              pagination={true}
              paginationPageSize={10}
              animateRows={true}
              rowHeight={60}
              headerHeight={50}
              defaultColDef={{
                sortable: true,
                resizable: true,
                filter: true,
              }}
            />
          </div>
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={cerrarModal}
            ></div>

            {/* Contenido Modal */}
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-indigo-600 p-6 text-white">
                <h3 className="text-xl font-bold">
                  {editingId ? "Editar Registro" : "Nuevo Devocional"}
                </h3>
                <p className="text-indigo-100 text-xs mt-1">
                  Completa todos los campos para continuar
                </p>
              </div>

              <form onSubmit={handleGuardar} className="p-8">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                      placeholder="Ej: Caminando con fe"
                      value={nuevoDevocional.titulo}
                      onChange={(e) =>
                        setNuevoDevocional({
                          ...nuevoDevocional,
                          titulo: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Fecha Publicación
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                      placeholder="Ej: Caminando con fe"
                      value={nuevoDevocional.fecha_publicacion}
                      onChange={(e) =>
                        setNuevoDevocional({
                          ...nuevoDevocional,
                          fecha_publicacion: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      required
                      rows="4"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 resize-none"
                      placeholder="Escribe el mensaje aquí..."
                      value={nuevoDevocional.descripcion}
                      onChange={(e) =>
                        setNuevoDevocional({
                          ...nuevoDevocional,
                          descripcion: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                  >
                    {editingId ? "Guardar Cambios" : "Crear Ahora"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Devocional;
