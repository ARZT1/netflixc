import { useEffect, useState } from "react";
import { X, Film } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

const AdminUserDetailsModal = ({ selectedUser, onClose }) => {
  const [userHistory, setUserHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserHistory = async () => {
      if (!selectedUser) return;
      try {
        const API_URL = "https://f3b22fa3c34192b3.mokky.dev";
        const [rentalsRes, moviesRes] = await Promise.all([
          fetch(`${API_URL}/rentals?user_id=${selectedUser.id}`), // Mokky filtering
          fetch(`${API_URL}/movies`)
        ]);

        const rentalsData = await rentalsRes.json();
        const moviesData = await moviesRes.json();

        const enrichedHistory = rentalsData
          .filter(r => (r.status || '').toUpperCase() === 'RENTED')
          .map(rental => {
            const matchedMovie = moviesData.find(m => m.id === rental.movie_id) || {};
            return {
              ...rental,
              image_url: matchedMovie.image_url || matchedMovie.image || "https://image.tmdb.org/t/p/w200/51tqzRtKMMZEYUpSYfkZZ8d6xGC.jpg"
            };
          }).sort((a, b) => b.id - a.id); // Newest first

        setUserHistory(enrichedHistory);
      } catch (error) {
        console.error("Error fetching user history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserHistory();
  }, [selectedUser]);

  if (!selectedUser) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111827] text-white w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl border border-gray-800 relative flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-xl font-bold shadow-lg">
              {(selectedUser.name || selectedUser.email).charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{selectedUser.name || "Usuario Sin Nombre"}</h2>
              <p className="text-sm text-gray-400">{selectedUser.email}</p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition bg-gray-800 hover:bg-red-600 p-2 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable History */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-300">
            <Film size={20} className="text-red-500" /> Historial de Transacciones
          </h3>

          {isLoading ? (
             <div className="text-center py-10 text-gray-500">Cargando historial del cliente...</div>
          ) : userHistory.length === 0 ? (
             <div className="text-center py-10 bg-gray-800/30 rounded-xl border border-gray-800">
               <p className="text-gray-400">Este usuario aún no tiene actividad registrada.</p>
             </div>
          ) : (
            <div className="space-y-4">
              {userHistory.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 bg-gray-800/20 p-4 rounded-xl border border-gray-800 hover:border-gray-600 transition items-center">
                  <img 
                    src={item.image_url} 
                    alt={item.movie_title}
                    className="w-16 h-24 object-cover rounded shadow-md shrink-0"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-bold text-lg mb-1">{item.movie_title}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Transacción #{item.id}</p>
                    <span className={`px-3 py-1 pb-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                        (item.status || '').toUpperCase() === 'RENTED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                        ((item.status || '').toUpperCase() === 'RETURNED' || (item.status || '').toUpperCase() === 'COMPLETED' || (item.status || '').toUpperCase() === 'CANCELLED') ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' : 
                        'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' 
                      }`}>
                        {(item.status || '').toUpperCase() === 'RENTED' ? 'Rentada' : 
                         ((item.status || '').toUpperCase() === 'RETURNED' || (item.status || '').toUpperCase() === 'COMPLETED' || (item.status || '').toUpperCase() === 'CANCELLED') ? 'Completado' : 
                         (item.status || '').toUpperCase() === 'PENDING' ? 'Pendiente' : item.status}
                      </span>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="block text-green-400 font-mono font-bold">${item.price || "4.99"}</span>
                    <span className="block text-xs text-gray-500 mt-1">USD</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetailsModal;
