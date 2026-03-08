import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
const LoginForm = ({ onClose }) => {
  const { login } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Iniciando sesión con:", { email, password });
    const response = await login(email, password);
    if (response.success) {
      if (onClose) onClose();
      Swal.fire({
        title: "¡Bienvenido!",
        text: "Has iniciado sesión exitosamente.",
        icon: "success",
        background: "#111827",
        color: "#fff",
        confirmButtonColor: "#e50914"
      }).then(() => {
        if (response.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Credenciales inválidas",
        icon: "error",
        background: "#111827",
        color: "#fff",
        confirmButtonColor: "#e50914"
      });
    }
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111827] text-white w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-800 relative animate-fade-in">
        {onClose ? (
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
          >
            <X size={20} />
          </button>
        ) : (
          <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-white transition text-sm font-semibold">
            ← Volver
          </Link>
        )}
        <h2 className="flex justify-center text-3xl font-bold mb-2 mt-2">Iniciar Sesión</h2>
        <p className="flex justify-center text-center text-gray-400 mb-6">
          Accede a tu cuenta para disfrutar el contenido
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              placeholder="correo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-3 bg-[#1f2937] border border-gray-700 rounded-lg outline-none focus:border-red-500"
              required
            />
          </div>
          <div className="mb-6 relative">
            <label className="text-sm text-gray-300">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 pr-10 bg-[#1f2937] border border-gray-700 rounded-lg outline-none focus:border-red-500"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 transition p-3 rounded-lg font-semibold cursor-pointer">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};
export default LoginForm;
