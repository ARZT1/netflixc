import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import RentalDetailsModal from "../../components/panelAdmin/RentalDetailsModal";
import { Eye } from "lucide-react";

const API_URL = "https://f3b22fa3c34192b3.mokky.dev";

const AdminPanel = () => {
  const [interactions, setInteractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRental, setSelectedRental] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [rentalsRes, usersRes, moviesRes] = await Promise.all([
          fetch(`${API_URL}/rentals`),
          fetch(`${API_URL}/users`),
          fetch(`${API_URL}/movies`)
        ]);

        const rentalsData = await rentalsRes.json();
        let usersData = await usersRes.json();
        const moviesData = await moviesRes.json();

        // Mokky users endpoint might return nested array: [[{user}]]
        if (Array.isArray(usersData) && usersData.length > 0 && Array.isArray(usersData[0])) {
          usersData = usersData[0];
        }

        const mappedData = rentalsData.map(rental => {
          const matchedUser = usersData.find(u => u.id === rental.user_id) || {};
          const matchedMovie = moviesData.find(m => m.id === rental.movie_id) || {};

          return {
            id: rental.id,
            user_name: matchedUser.name || `User ID: ${rental.user_id}`,
            action: rental.status,
            movie_title: rental.movie_title || matchedMovie.title,
            movie_image: matchedMovie.image_url || matchedMovie.image || "https://image.tmdb.org/t/p/w200/51tqzRtKMMZEYUpSYfkZZ8d6xGC.jpg",
            price: rental.price,
            date: new Date().toLocaleDateString() // Fecha simulada del cliente local
          };
        });

        // Filtramos para que solo exista el estado RENTADA como lo pidió el usuario
        const filteredData = mappedData.filter(d => (d.action || '').toUpperCase() === 'RENTED');

        // Ordenamos simulando mostrar las más recientes primero asumiendo IDs incrementales
        const sortedData = filteredData.sort((a, b) => b.id - a.id);
        setInteractions(sortedData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-[#0b0f14] text-white flex items-center justify-center">Obteniendo registros...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white p-8">
      <Navbar />

      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold border-l-4 border-red-600 pl-3">Dashboard Administrador</h2>
          <p className="text-gray-400 mt-2 ml-4">Historial maestro de rentas y cancelaciones del sistema.</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-[#111827] rounded-xl border border-gray-800 shadow-2xl">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-900 border-b border-gray-800">
            <tr>
              <th className="px-6 py-5">Usuario</th>
              <th className="px-6 py-5">Película</th>
              <th className="px-6 py-5">Acción</th>
              <th className="px-6 py-5">Fecha</th>
              <th className="px-6 py-5 text-center">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {interactions?.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No hay registros de rentas en la base de datos.</td>
              </tr>
            ) : (
              interactions.map((interaction) => (
                <tr key={interaction.id} className="border-b border-gray-800/60 hover:bg-gray-800/40 transition">
                  <td className="px-6 py-4 font-semibold text-white whitespace-nowrap flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-500 font-bold flex items-center justify-center border border-red-900 shrink-0">
                      {interaction.user_name.charAt(0).toUpperCase()}
                    </div>
                    {interaction.user_name}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-200">{interaction.movie_title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 pb-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold ${
                      (interaction.action || '').toUpperCase() === 'RENTED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                      ((interaction.action || '').toUpperCase() === 'RETURNED' || (interaction.action || '').toUpperCase() === 'COMPLETED' || (interaction.action || '').toUpperCase() === 'CANCELLED') ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' : 
                      'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                    }`}>
                      {(interaction.action || '').toUpperCase() === 'RENTED' ? 'Rentada' : 
                       ((interaction.action || '').toUpperCase() === 'RETURNED' || (interaction.action || '').toUpperCase() === 'COMPLETED' || (interaction.action || '').toUpperCase() === 'CANCELLED') ? 'Completado' : 
                       (interaction.action || '').toUpperCase() === 'PENDING' ? 'Pendiente' : interaction.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{interaction.date}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setSelectedRental(interaction)}
                      className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition inline-flex items-center justify-center"
                      title="Ver Detalles"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Render Modal */}
      {selectedRental && (
        <RentalDetailsModal 
          interaction={selectedRental}
          onClose={() => setSelectedRental(null)}
        />
      )}
    </div>
  );
};

export default AdminPanel;

