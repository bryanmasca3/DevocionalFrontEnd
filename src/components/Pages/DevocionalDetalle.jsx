import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "flowbite-react";
import { useAuth } from "./AuthContext";
const DevocionalDetalle = () => {
  const { user, login } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [respuestas, setRespuestas] = useState({});

  const handleChange = (elementoId, value) => {
    setRespuestas((prev) => ({
      ...prev,
      [elementoId]: value,
    }));
  };
  const handleResponse = async (preguntaId) => {
    const preguntaActual = detalle.preguntas.find((p) => p._id === preguntaId);
    if (!preguntaActual) return;
    const elementosIds = preguntaActual.elementos.map((el) =>
      el._id.toString(),
    );
    const payload = Object.entries(respuestas)
      .filter(([id_elemento]) => elementosIds.includes(id_elemento))
      .map(([id_elemento, texto]) => ({
        texto_ingresado: texto,
        id_elemento,
        id_usuario: user._id,
        id_pregunta: preguntaId,
      }));

    try {
      console.log(payload);
      await axios.post("https://devocionalbackend.onrender.com/api/v1/respuesta", payload);
      await handlerUpdateDevocional();
      await fetchDetalle();
    } catch (error) {
      console.error("Error al enviar las respuestas:", error);
    }
  };

  const handlerUpdateDevocional = async () => {
    try {
      await axios.put(
        `https://devocionalbackend.onrender.com/api/v1/devocional/${id}/usuario`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
    } catch (error) {
      console.error("Error al enviar las respuestas:", error);
    }
  };
  const fetchDetalle = async () => {
    try {
      console.log(user);
      console.log("************************");
      const response = await axios.get(
        `https://devocionalbackend.onrender.com/api/v1/devocional/${id}/usuario`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
      const data = response.data;
      console.log(data);
      setDetalle(data);
      const respuestasIniciales = {};

      data.preguntas.forEach((pregunta) => {
        pregunta.elementos.forEach((elemento) => {
          if (elemento.id_respuesta) {
            respuestasIniciales[elemento._id] =
              elemento.id_respuesta.texto_ingresado;
          }
        });
      });
      console.log(respuestasIniciales);
      setRespuestas(respuestasIniciales);
    } catch (error) {
      console.error("Error al obtener el detalle:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDetalle();
  }, [id]);
  return (
    <div className="min-h-screen  p-6">
      <div className="mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white flex justify-between">
          <h1 className="text-3xl font-bold">Devocional </h1>
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer mb-4 flex items-center gap-2 text-indigo-100 hover:text-white transition-colors"
          >
            ← Volver al calendario
          </button>
        </div>
        <div className="p-8">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : detalle.devocional ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-2">
                  Título
                </h2>
                <p className="text-2xl text-slate-800 font-semibold">
                  {detalle.devocional.titulo}
                </p>
              </div>

              <div className="prose prose-slate max-w-none">
                <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-2">
                  Reflexión
                </h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {detalle.devocional.descripcion}
                </p>
              </div>
              <div className="space-y-10">
                {detalle.preguntas &&
                  detalle.preguntas.map((pregunta, index) => {
                    const todosRespondidos =
                      pregunta.elementos.length > 0 &&
                      pregunta.elementos
                        .filter((it) => it.id_tipo.descripcion === "texto")
                        .every((el) => el.id_respuesta);

                    return (
                      <div
                        key={pregunta._id || index}
                        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">
                            {index + 1}
                          </span>
                          <h3 className="text-lg font-bold text-slate-800">
                            {pregunta.titulo}
                          </h3>
                        </div>

                        <div className="ml-11 space-y-6">
                          {pregunta.reflexion && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 text-sm italic">
                              <span className="font-bold not-italic block mb-1 uppercase text-[10px] tracking-widest text-slate-500">
                                Reflexión:
                              </span>
                              "{pregunta.reflexion}"
                            </div>
                          )}
                          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm leading-loose">
                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-4">
                              {pregunta.elementos &&
                                pregunta.elementos
                                  .sort((a, b) => a.orden - b.orden)
                                  .map((elemento) => (
                                    <div
                                      key={elemento._id}
                                      className="inline-flex flex-col group"
                                    >
                                      <div className="flex items-baseline gap-2">
                                        {elemento.id_tipo.descripcion ==
                                        "label" ? (
                                          elemento.descripcion && (
                                            <span className="text-slate-800 font-medium">
                                              {elemento.descripcion}
                                            </span>
                                          )
                                        ) : (
                                          <div className="flex gap-2">
                                            <div className="flex flex-col items-center">
                                              <input
                                                type="text"
                                                value={(
                                                  respuestas[elemento._id] || ""
                                                ).toUpperCase()}
                                                disabled={
                                                  !!elemento.id_respuesta
                                                }
                                                onChange={(e) =>
                                                  handleChange(
                                                    elemento._id,
                                                    e.target.value,
                                                  )
                                                }
                                                className={`
                                              min-w-[100px] 
                                              text-center
                                              bg-transparent 
                                              border-b-2 
                                              px-1 py-0.5 
                                              text-sm font-medium 
                                              placeholder:text-slate-300 placeholder:text-xs
                                              transition-all duration-300
                                              ${elemento.id_respuesta ? "cursor-not-allowed" : " focus:outline-none"}
                                              ${
                                                elemento.id_respuesta
                                                  ? elemento.respuesta.toUpperCase() ===
                                                    (
                                                      respuestas[
                                                        elemento._id
                                                      ] || ""
                                                    ).toUpperCase()
                                                    ? "border-green-600 text-green-600"
                                                    : "border-red-600 text-red-600"
                                                  : "border-slate-200 text-indigo-600 focus:border-indigo-500 focus:outline-none"
                                              }
                                            `}
                                                placeholder=""
                                              />
                                              {elemento.texto_ayuda && (
                                                <span className="text-[12px] text-indigo-400 italic mt-1 animate-pulse">
                                                  {elemento.texto_ayuda?.toUpperCase()}
                                                </span>
                                              )}
                                            </div>
                                            {elemento.id_respuesta && (
                                              <span
                                                className={`mt-1 text-lg font-bold ${
                                                  elemento.respuesta.toUpperCase() ===
                                                  (
                                                    respuestas[elemento._id] ||
                                                    ""
                                                  ).toUpperCase()
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                }`}
                                              >
                                                {elemento.respuesta.toUpperCase() ===
                                                (
                                                  respuestas[elemento._id] || ""
                                                ).toUpperCase()
                                                  ? "✓"
                                                  : "✕"}
                                              </span>
                                            )}
                                          </div>
                                        )}

                                        {/*  <div className="min-w-[120px] border-b-2 border-slate-300 px-2 text-indigo-600 font-bold text-center">
                                        {elemento.respuesta || "\u00A0"}
                                      </div> */}
                                      </div>

                                      {/*  {elemento.texto_ayuda && (
                                      <span className="text-[10px] text-indigo-400 italic mt-1 animate-pulse">
                                        {elemento.texto_ayuda}
                                      </span>
                                    )} */}
                                    </div>
                                  ))}
                            </div>
                          </div>
                          {pregunta.oracion && (
                            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-indigo-800 text-sm italic">
                              <span className="font-bold not-italic block mb-1 uppercase text-[10px] tracking-widest">
                                Oración:
                              </span>
                              "{pregunta.oracion}"
                            </div>
                          )}
                        </div>

                        {pregunta.elementos.length > 0 && (
                          <div className="flex justify-end mt-4">
                            <button
                              type="button"
                              onClick={() => handleResponse(pregunta._id)}
                              disabled={todosRespondidos}
                              className={` px-4 py-2 rounded-md transition-colors shadow-sm
                          ${
                            todosRespondidos
                              ? "cursor-not-allowed bg-gray-400 cursor-not-allowed text-white"
                              : " cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white"
                          }
                        `}
                              title="Ver"
                            >
                              {" "}
                              Guardar Respuestas
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-500">
                No hay un devocional registrado para este día todavía.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevocionalDetalle;
