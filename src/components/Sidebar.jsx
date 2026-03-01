import { NavLink } from "react-router-dom";
import { useAuth } from "./Pages/AuthContext";

const items = [
  {
    id: 1,
    type: 0,
    text: "Menú",
    icon: null,
    url: null,
  },
  {
    id: 2,
    type: 1,
    text: "Inicio",
    icon: (
      <svg
        class="w-6 h-6 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
        />
      </svg>
    ),
    url: "/",
  },
  {
    id: 3,
    type: 1,
    text: "Devocional",
    roles: ["adminitrador"],
    icon: (
      <svg
        class="w-6 h-6 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"
        />
      </svg>
    ),
    url: "/devocional",
  },
  {
    id: 5,
    type: 1,
    text: "Usuarios",
    roles: ["adminitrador"],
    icon: (
      <svg
        class="w-6 h-6 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="2"
          d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    ),
    url: "/usuarios",
  },
  {
    id: 7,
    type: 1,
    text: "Avance",
    icon: (
      <svg
        class="w-6 h-6 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 3v4a1 1 0 0 1-1 1H5m4 10v-2m3 2v-6m3 6v-3m4-11v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
        />
      </svg>
    ),
    url: "/avance",
  },
  {
    id: 8,
    type: 0,
    text: "Otros",
    icon: null,
    url: null,
  },
  {
    id: 9,
    type: 1,
    text: "Ayuda",
    icon: (
      <svg
        class="w-6 h-6 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 9a3 3 0 0 1 3-3m-2 15h4m0-3c0-4.1 4-4.9 4-9A6 6 0 1 0 6 9c0 4 4 5 4 9h4Z"
        />
      </svg>
    ),
    url: "/ayuda",
  },
];

const Sidebar = ({ isSidebarOpen }) => {
  const { user } = useAuth();

  const userRole = user?.tipo;

  const filteredItems = items.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

 
  return (
    isSidebarOpen && (
      <aside
        className={`bg-white border-r border-gray-200 w-64 flex flex-col justify-between fixed inset-y-0 left-0 transition-transform duration-300 ease-in-out z-40 
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div class="flex flex-col h-full">
          <div class="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
            <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              D
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-800 leading-tight">
                Devocional
              </h2>
              <p class="text-xs text-gray-500">SEC</p>
            </div>
          </div>

          <nav class="flex-1 overflow-y-auto px-3 text-sm">
            {filteredItems.map((item, index) => {
              return !item.type ? (
                <h3
                  key={index}
                  className="text-gray-400 uppercase font-semibold text-xs mt-4 mb-2 px-2"
                >
                  {item.text}
                </h3>
              ) : (
                <NavLink
                  key={index}
                  to={item.url}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
                >
                  {item.icon}
                  <span>{item.text}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 p-4 flex items-center gap-3 bg-white">
            {/* Foto de Perfil */}
            <img
              src="https://i.pravatar.cc/100?img=5"
              alt="Usuario"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
            />

            {/* Información del Usuario */}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-bold text-gray-800 truncate capitalize">
                {user?.usuario}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {user?.correo}
              </span>
            </div>                   
          </div>
        </div>
      </aside>
    )
  );
};

export default Sidebar;
