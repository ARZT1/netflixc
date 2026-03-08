import { X } from "lucide-react";
import Swal from "sweetalert2";
import { useAppStore } from "../../store/useAppStore";

const MovieModal = ({ movie, onClose, hideActions }) => {
  const { rentMovie, addToMyList, user } = useAppStore();

  if (!movie) return null;

  const handleRent = async () => {
    const success = await rentMovie(movie);
    if (success) {
      Swal.fire({
        title: "¡Rentada!",
        text: `Has rentado "${movie.title}" exitosamente.`,
        icon: "success",
        background: "#111827",
        color: "#fff",
        confirmButtonColor: "#e50914",
        timer: 2000,
        showConfirmButton: false
      });
      onClose();
    } else {
      Swal.fire({
        title: "Aviso",
        text: `Ocurrió un error o ya habías rentado "${movie.title}".`,
        icon: "info",
        background: "#111827",
        color: "#fff",
        confirmButtonColor: "#e50914"
      });
    }
  };

  const handleAddToList = () => {
    const success = addToMyList(movie);
    if (success) {
      Swal.fire({
        title: "¡Agregada!",
        text: `"${movie.title}" añadida a tu lista.`,
        icon: "success",
        background: "#111827",
        color: "#fff",
        confirmButtonColor: "#e50914",
        timer: 2000,
        showConfirmButton: false
      });
      onClose();
    } else {
      Swal.fire({
        title: "Aviso",
        text: `"${movie.title}" ya está en tu lista.`,
        icon: "info",
        background: "#111827",
        color: "#fff",
        confirmButtonColor: "#e50914"
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111827] text-white w-full max-w-4xl h-auto md:h-[550px] rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 bg-black/50 text-gray-300 hover:text-white hover:bg-black/80 transition p-2 rounded-full"
        >
          <X size={24} />
        </button>

        {/* Image Section */}
        <div className="md:w-5/12 relative h-64 md:h-full shrink-0">
          <img 
            src={movie.image_url || movie.image} 
            alt={movie.title} 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-[#111827]/80 md:to-[#111827]"></div>
        </div>

        {/* Content Section */}
        <div className="md:w-7/12 p-8 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 drop-shadow-md">{movie.title}</h2>
          
          <div className="flex flex-col gap-3 text-sm text-gray-300 mb-6 bg-[#1f2937]/50 p-4 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-xs w-24">Categoría:</span>
              <span className="bg-red-600/20 text-red-500 px-3 py-1 rounded-full font-semibold border border-red-900/50">
                {movie.category || "General"}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-xs w-24">Calificación:</span>
              <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-900/20 px-3 py-1 rounded-full border border-yellow-700/30">
                {/* SVG Estrella estática para diseño */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
                <span>{(movie.rating || 0).toString().substring(0, 3)} / 10</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-xs w-24">Precio:</span>
              <span className="text-green-400 font-mono font-bold bg-green-900/20 px-3 py-1 rounded-full border border-green-700/30">
                ${movie.price || "4.99"} USD
              </span>
            </div>
          </div>

          <p className="text-gray-300 mb-8 leading-relaxed line-clamp-4 text-sm md:text-base border-l-2 border-red-600 pl-4 italic">
            "{movie.description || "Sin descripción disponible para este título."}"
          </p>

          {/* Action Buttons */}
          {!hideActions && (
            user?.role !== 'admin' ? (
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button 
                  onClick={handleRent} 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition flex-1 text-center shadow-lg shadow-red-900/20 flex justify-center items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                  </svg>
                  Rentar ahora
                </button>
                <button 
                  onClick={handleAddToList} 
                  className="bg-gray-800 border border-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition flex-1 text-center flex justify-center items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Mi Lista
                </button>
              </div>
            ) : (
              <div className="mt-auto bg-yellow-900/20 border border-yellow-700/30 p-4 rounded-xl text-center shadow-lg">
                <p className="text-yellow-500 text-sm font-semibold flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                  </svg>
                  Modo Administrador Activo. Acciones de cliente deshabilitadas.
                </p>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
};

export default MovieModal;
