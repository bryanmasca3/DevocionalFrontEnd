import { useAuth } from "./Pages/AuthContext";
const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user, loading, logout } = useAuth();
  const handleLogout = () => {
    logout();
  };
  return (
    <header class="flex items-center justify-between bg-white shadow px-6 py-4">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        class=" cursor-pointer text-gray-600 hover:text-indigo-600 focus:outline-none transition"
        title="Mostrar / ocultar menú"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-7 h-7"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 5.75h16.5M3.75 12h16.5m-16.5 6.25h16.5"
          />
        </svg>
      </button>
      <button
        onClick={handleLogout}
        title="Cerrar Sesión"
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
      >
        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
    </header>
  );
};
export default Header;
