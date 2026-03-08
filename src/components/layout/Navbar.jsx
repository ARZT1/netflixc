import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";

const Navbar = () => {
  const { logout, user } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
      <Link to="/dashboard" className="text-red-600 text-3xl font-bold tracking-wider hover:text-red-500 transition">
        NETFLIX
      </Link>
      <div className="flex gap-4 items-center">
        {user?.role === 'admin' && (
          <Link to="/admin" className="text-gray-300 hover:text-white transition text-sm">Admin Panel</Link>
        )}
        <Link to="/profile" className="text-gray-300 hover:text-white transition text-sm">Mi Perfil</Link>
        <button onClick={handleLogout} className="text-gray-300 hover:text-white transition text-sm font-semibold">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
