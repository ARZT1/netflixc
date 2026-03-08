import { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { useAppStore } from "../../store/useAppStore";
const EditProfileModal = ({ onClose }) => {
  const { user } = useAppStore();
  const [formData, setFormData] = useState({
    name: user?.name || "Usuario Netflix",
    email: user?.email || "",
    phone: user?.phone || "+123456789"
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Perfil Actualizado",
      text: "Tus datos personales han sido guardados correctamente.",
      icon: "success",
      background: "#111827",
      color: "#fff",
      confirmButtonColor: "#e50914"
    });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111827] text-white w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-800 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition bg-gray-800 hover:bg-gray-700 p-2 rounded-full"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Editar Perfil</h2>
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-gray-800 shadow-lg">
            {formData.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-400 font-semibold mb-1 block">Nombre Completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#1f2937] border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 font-semibold mb-1 block">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#1f2937] border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 font-semibold mb-1 block">Teléfono (Opcional)</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-[#1f2937] border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 mt-4 rounded-lg shadow-lg shadow-red-900/20 transition"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};
export default EditProfileModal;
