import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Layout/Main";
import Login from "./components/Pages/Login";
import Usuarios from "./components/Pages/Usuarios";
import Devocional from "./components/Pages/Devocional";
import DevocionalDetalle from "./components/Pages/DevocionalDetalle";

import "./App.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Preguntas from "./components/Pages/Preguntas";
import Elementos from "./components/Pages/Elementos";
import Home from "./components/Pages/Home";
import { AuthProvider } from "./components/Pages/AuthContext";
import ProtectedRoute from "./components/Pages/ProtectedRoute";
import PublicRoute from "./components/Pages/PublicRoute";
import CambiarContrasena from "./components/Pages/CambiarContrasena";
import Avance from "./components/Pages/Avance";
import AvanceDetalle from "./components/Pages/AvanceDetalle";
import AvanceRedirect from "./components/Pages/AvanceRedirect";
function App() {
  const [count, setCount] = useState(0);
  ModuleRegistry.registerModules([AllCommunityModule]);
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* RUTA PÚBLICA */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/cambiarcontrasena"
              element={
                <ProtectedRoute>
                  <CambiarContrasena />
                </ProtectedRoute>
              }
            />
            {/* RUTAS PROTEGIDAS (GENERALES Y ADMIN) */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Main />
                </ProtectedRoute>
              }
            >
              {/* Accesibles por cualquier usuario logueado */}
              <Route index element={<Home />} />
              <Route path="devocional/:id" element={<DevocionalDetalle />} />
              {/* <Route path="avance" element={<Avance />} /> */}
              <Route path="avance" element={<AvanceRedirect />} />
              <Route path="avance/:id" element={<AvanceDetalle />} />
              <Route path="ayuda" element={<div>Ayuda</div>} />

              <Route path="devocional" element={<Devocional />} />
              <Route path="devocional/:id/preguntas" element={<Preguntas />} />
              <Route path="preguntas/:id/elementos" element={<Elementos />} />
              <Route path="usuarios" element={<Usuarios />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
