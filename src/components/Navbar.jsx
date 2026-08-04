import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkBase =
  "px-3 py-2 rounded-md text-sm font-medium transition-colors";
const linkActive = "bg-brand-500 text-white";
const linkInactive = "text-slate-600 hover:bg-brand-50 hover:text-brand-700";

export default function Navbar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <span className="text-lg font-semibold text-brand-700">
          Agenda Virtual
        </span>
        <div className="flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/registros"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Registros
          </NavLink>
          <NavLink
            to="/calendario"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Calendario
          </NavLink>
          <button
            onClick={handleSignOut}
            className="ml-2 rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
