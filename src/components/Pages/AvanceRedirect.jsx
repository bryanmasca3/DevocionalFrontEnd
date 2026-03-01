import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Avance from "./Avance";

const AvanceRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Si NO es admin, lo mandamos a su id
    if (user.tipo !== "adminitrador") {
      navigate(`/avance/${user._id}`, { replace: true });
    }
  }, [user, navigate]);

  // Si es admin renderizamos directo la vista
  if (user?.tipo === "adminitrador") {
    return <Avance />;
  }

  return null;
};

export default AvanceRedirect;