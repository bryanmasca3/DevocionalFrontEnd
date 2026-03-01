import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

ModuleRegistry.registerModules([AllCommunityModule]);

const Elementos = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [rowTipo, setTipo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [nuevoElemento, setNuevoElemento] = useState({
    id_pregunta: id,
    id_tipo: "",
    orden: 0,
    texto_ayuda: "",
    respuesta: "",
    descripcion: "",
  });
  const API_URL = "http://localhost:9001/api/v1/elemento";
  const fetchElemento = async () => {
    try {
      const response = await axios.get(`${API_URL}?id_pregunta=${id}`);
      setRowData(response.data);
    } catch (error) {
      console.error("Error al cargar devocional:", error);
    }
  };
  const fetchElementoTipo = async () => {
    try {
      const response = await axios.get(`${API_URL}/tipo`);
      console.log(response.data);
      setTipo(response.data);
    } catch (error) {
      console.error("Error al cargar devocional:", error);
    }
  };
  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este devocional?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchElemento();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };
  const handleEditar = (data) => {
    setEditingId(data._id);
    setNuevoElemento({
      id_pregunta: data.id_pregunta,
      id_tipo: data.id_tipo,
      orden: data.orden,
      texto_ayuda: data.texto_ayuda,
      respuesta: data.respuesta,
      descripcion: data.descripcion,
    });
    setIsModalOpen(true);
  };
  useEffect(() => {
    fetchElemento();
    fetchElementoTipo();
  }, [id]);

  const handleGuardar = async (e) => {
    e.preventDefault();

    console.log(nuevoElemento);
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, nuevoElemento);
      } else {
        await axios.post(API_URL, nuevoElemento);
      }
      cerrarModal();
      fetchElemento();
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };
  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNuevoElemento({
      id_pregunta: "",
      id_tipo: "",
      orden: 0,
      texto_ayuda: "",
      respuesta: "",
    });
  };

  const [colDefs] = useState([
    { field: "orden", headerName: "Orden", flex: 1, maxWidth: 80 },
    { field: "id_tipo", headerName: "Tipo", flex: 1, minWidth: 150 },
    { field: "descripcion", headerName: "Descripcion", flex: 1 },
    { field: "texto_ayuda", headerName: "Texto Ayuda", flex: 1 },
    { field: "respuesta", headerName: "Respuesta", flex: 1 },
    {
      headerName: "Acciones",
      cellRenderer: (params) => (
        <div className="flex gap-2 items-center h-full justify-center">
          <button
            onClick={() => handleEditar(params.data)}
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
  return (
    <div className="min-h-screen p-4 md:p-8 font-sans">
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Panel de Elementos
            </h1>
            <p className="text-slate-500 text-sm">
              Administra el contenido espiritual de tu plataforma
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-indigo-200 active:scale-95"
          >
            <span>+ Nuevas Elementos</span>
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
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={cerrarModal}
            ></div>
            <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-indigo-600 p-6 text-white">
                <h3 className="text-xl font-bold">
                  {editingId ? "Editar Elemento" : "Nuevo Elemento"}
                </h3>
                <p className="text-indigo-100 text-xs mt-1">
                  Completa la información del tipo y contenido del elemento.
                </p>
              </div>
              <form
                onSubmit={handleGuardar}
                className="p-8 max-h-[80vh] overflow-y-auto"
              >
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Tipo de Elemento
                      </label>
                      <select
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800 appearance-none cursor-pointer"
                        value={nuevoElemento.id_tipo}
                        onChange={(e) =>
                          setNuevoElemento({
                            ...nuevoElemento,
                            id_tipo: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled>
                          Selecciona un tipo
                        </option>
                        {rowTipo.map((tipo) => (
                          <option key={tipo._id} value={tipo._id}>
                            {tipo.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Orden
                      </label>
                      <input
                        type="number"
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800"
                        placeholder="0"
                        value={nuevoElemento.orden}
                        onChange={(e) =>
                          setNuevoElemento({
                            ...nuevoElemento,
                            orden: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                  {rowTipo.find((t) => t._id === nuevoElemento.id_tipo)
                    ?.descripcion === "label" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        rows="2"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800 resize-none"
                        placeholder="Instrucciones breves..."
                        value={nuevoElemento.descripcion}
                        onChange={(e) =>
                          setNuevoElemento({
                            ...nuevoElemento,
                            descripcion: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}

                  {/* Texto de Ayuda */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Texto de Ayuda
                    </label>
                    <textarea
                      rows="2"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800 resize-none"
                      placeholder="Instrucciones breves..."
                      value={nuevoElemento.texto_ayuda}
                      onChange={(e) =>
                        setNuevoElemento({
                          ...nuevoElemento,
                          texto_ayuda: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Respuesta */}

                  {rowTipo.find((t) => t._id === nuevoElemento.id_tipo)
                    ?.descripcion === "texto" && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Respuesta / Contenido
                      </label>
                      <textarea
                        required
                        rows="4"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800 resize-none"
                        placeholder="Escribe el contenido principal aquí..."
                        value={nuevoElemento.respuesta}
                        onChange={(e) =>
                          setNuevoElemento({
                            ...nuevoElemento,
                            respuesta: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                {/* Botones */}
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

export default Elementos;
