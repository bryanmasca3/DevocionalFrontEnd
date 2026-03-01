import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import axios from "axios";
import { useNavigate } from "react-router-dom";

ModuleRegistry.registerModules([AllCommunityModule]);

const Avance = () => {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);  

  const API_URL = "http://localhost:9001/api/v1/usuario";

  const fetchUsuario = async () => {
    try {
      const response = await axios.get(API_URL);
      setRowData(response.data);
    } catch (error) {
      console.error("Error al cargar devocional:", error);
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, []);

  const handleVerClick = (data) => {
    navigate(`/avance/${data._id}`);
  };

  const [colDefs] = useState([
    { field: "nombre", headerName: "Nombre", flex: 2, minWidth: 250 },
    {
      headerName: "Acciones",
      cellRenderer: (params) => (
        <div className="flex gap-2 items-center h-full justify-center">
          <button
            onClick={() => handleVerClick(params.data)}
            className="cursor-pointer p-1.5 bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white rounded-md transition-colors shadow-sm"
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
                d="M2.458 12C3.732 7.943 7.523 5 12 5
         c4.477 0 8.268 2.943 9.542 7
         -1.274 4.057-5.065 7-9.542 7
         -4.477 0-8.268-2.943-9.542-7z"
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
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Panel de Avance
            </h1>
            <p className="text-slate-500 text-sm">
              Bienvenido a tu panel de avance
            </p>
          </div>
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
      </div>
    </div>
  );
};

export default Avance;
