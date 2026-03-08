import { X } from "lucide-react";

const RentalDetailsModal = ({ interaction, onClose }) => {
  if (!interaction) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111827] text-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-800 relative flex flex-col md:flex-row overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 text-gray-400 hover:text-white transition bg-gray-900/80 hover:bg-red-600 p-2 rounded-full"
        >
          <X size={20} />
        </button>

        {/* Movie Image Area */}
        <div className="md:w-2/5 relative h-48 md:h-auto shrink-0 bg-gray-900">
          <img 
            src={interaction.movie_image} 
            alt={interaction.movie_title} 
            className="w-full h-full object-cover object-center opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#111827]"></div>
        </div>

        {/* Details Area */}
        <div className="md:w-3/5 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Detalles de Operación</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Transacción ID</p>
              <p className="font-mono text-gray-300">#{interaction.id}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Cliente / Usuario</p>
              <p className="text-lg font-semibold text-white">{interaction.user_name}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Película Rentada</p>
              <p className="text-lg font-semibold text-white">{interaction.movie_title}</p>
            </div>

            <div className="flex gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Estado</p>
                <span className={`inline-block mt-1 px-3 py-1 pb-1.5 rounded-full text-xs uppercase tracking-wider font-bold ${
                  (interaction.action || '').toUpperCase() === 'RENTED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                  ((interaction.action || '').toUpperCase() === 'RETURNED' || (interaction.action || '').toUpperCase() === 'COMPLETED' || (interaction.action || '').toUpperCase() === 'CANCELLED') ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' :
                  'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                }`}>
                  {(interaction.action || '').toUpperCase() === 'RENTED' ? 'Rentada' : 
                   ((interaction.action || '').toUpperCase() === 'RETURNED' || (interaction.action || '').toUpperCase() === 'COMPLETED' || (interaction.action || '').toUpperCase() === 'CANCELLED') ? 'Completado' : 
                   (interaction.action || '').toUpperCase() === 'PENDING' ? 'Pendiente' : interaction.action}
                </span>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Fecha</p>
                <p className="text-gray-300 mt-1">{interaction.date}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Costo</p>
              <p className="text-green-400 font-mono font-bold">${interaction.price || "4.99"} USD</p>
            </div>

          </div>

          <button 
            onClick={onClose}
            className="w-full mt-8 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 rounded transition"
          >
            Cerrar Detalles
          </button>
        </div>

      </div>
    </div>
  );
};

export default RentalDetailsModal;
