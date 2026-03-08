import { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import Navbar from "../../components/layout/Navbar";
import EditProfileModal from "../../components/Profile/EditProfileModal";
import AdminUserDetailsModal from "../../components/panelAdmin/AdminUserDetailsModal";
import MovieModal from "../../components/Dashboard/MovieModal";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const Profile = () => {
  const { user, users, rentedMovies, myList, fetchRentedMovies, removeFromMyList, cancelRental, hasRole, fetchUsers } = useAppStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdminUser, setSelectedAdminUser] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const isAdmin = hasRole('admin');

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    } else {
      fetchRentedMovies();
    }
  }, [isAdmin, fetchUsers, fetchRentedMovies]);

  useEffect(() => {
    if (id && rentedMovies?.length > 0) {
      const movie = rentedMovies.find((m) => m.movie_id?.toString() === id || m.id?.toString() === id);
      setSelectedMovie(movie || null);
    } else {
      setSelectedMovie(null);
    }
  }, [id, rentedMovies]);

  const handleCancelRental = async (rentalId, title) => {
    const result = await Swal.fire({
      title: '¿Cancelar Renta?',
      text: `Estás a punto de cancelar la solicitud/renta de "${title}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
      background: "#111827",
      color: "#fff",
      confirmButtonColor: "#e50914",
      cancelButtonColor: "#374151"
    });

    if (result.isConfirmed) {
      const success = await cancelRental(rentalId);
      if (success) {
        Swal.fire({
          title: "Cancelada",
          text: "La película ha sido removida de tus rentas.",
          icon: "success",
          background: "#111827", color: "#fff", confirmButtonColor: "#e50914"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white p-8">
      <Navbar />

      {/* User Header Info */}
      <div className="bg-[#111827] rounded-xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center gap-6 border border-gray-800 shadow-xl">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-red-600 rounded-full flex items-center justify-center text-4xl md:text-5xl font-bold border-4 border-[#0b0f14] shadow-lg shrink-0">
          {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-extrabold mb-1">{user?.name || "Usuario Netflix"}</h2>
          <p className="text-gray-400 mb-4">{user?.email || "correo@ejemplo.com"}</p>
          <div className="inline-block bg-gray-800 px-3 py-1 rounded text-sm text-gray-300 font-semibold mb-4 md:mb-0">
            Rol: <span className="text-white capitalize">{user?.role || "Cliente"}</span>
          </div>
        </div>
        <div className="shrink-0 w-full md:w-auto">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-full md:w-auto bg-gray-800 hover:bg-gray-700 border border-gray-600 border-b-4 hover:border-b-gray-500 hover:-translate-y-1 active:border-b active:translate-y-0 text-white font-bold py-3 px-8 rounded transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
            Editar Perfil
          </button>
        </div>
      </div>

      {isAdmin ? (
        // ==========================
        // VISTA PARA ADMINISTRADOR
        // ==========================
        <div>
          <div className="flex items-center gap-3 mb-6 border-l-4 border-red-600 pl-3">
            <h2 className="text-2xl font-bold">Usuarios Registrados ({users?.length || 0})</h2>
            <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs font-bold border border-yellow-500/30">Admin View</span>
          </div>

          {!users || users.length === 0 ? (
            <div className="bg-[#111827]/50 border border-gray-800 rounded-lg p-10 text-center">
              <p className="text-gray-400 text-lg">Cargando usuarios desde la base de datos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {users.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedAdminUser(client)}
                  className="bg-[#111827] rounded-xl p-6 border border-gray-800 hover:border-gray-500 transition shadow-lg flex items-center gap-4 group text-left w-full hover:-translate-y-1 duration-200"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-800 text-gray-300 flex items-center justify-center text-xl font-bold shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    {(client.name || client.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h4 className="font-bold text-lg truncate text-white">{client.name || "Usuario Sin Nombre"}</h4>
                    <p className="text-sm text-gray-400 truncate mb-1">{client.email}</p>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded inline-block ${client.role === 'admin' ? 'bg-red-900/30 text-red-500' : 'bg-blue-900/30 text-blue-400'}`}>
                      {client.role || 'cliente'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedAdminUser && (
            <AdminUserDetailsModal
              selectedUser={selectedAdminUser}
              onClose={() => setSelectedAdminUser(null)}
            />
          )}

        </div>
      ) : (
        // ==========================
        // VISTA PARA CLIENTES
        // ==========================
        <>
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 border-l-4 border-red-600 pl-3">Películas Rentadas ({rentedMovies?.length || 0})</h2>
            {!rentedMovies || rentedMovies.length === 0 ? (
              <div className="bg-[#111827]/50 border border-gray-800 rounded-lg p-10 text-center">
                <p className="text-gray-400 text-lg">Aún no has rentado ninguna película.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {rentedMovies.map((movie) => (
                  <div 
                    key={movie.rental_id} 
                    onClick={() => navigate(`/profile/movie/${movie.id || movie.movie_id}`)}
                    className="cursor-pointer bg-[#111827] rounded-xl overflow-hidden relative group transition hover:scale-105 duration-300 ring-1 ring-gray-800 hover:ring-gray-600 flex flex-col h-full shadow-lg"
                  >
                    <div className="relative aspect-[2/3] w-full">
                      <img src={movie.image_url || movie.image} alt={movie.title} className="w-full h-full object-cover" />

                      {/* Dynamic Status Badge */}
                      <div className={`absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 rounded shadow-md ${movie.status === 'RENTED' ? 'bg-blue-600' :
                          (movie.status === 'COMPLETED' || movie.status === 'CANCELLED' || movie.status === 'RETURNED') ? 'bg-gray-600' :
                            'bg-red-800'
                        }`}>
                        {movie.status === 'RENTED' ? 'Rentada' :
                          (movie.status === 'COMPLETED' || movie.status === 'CANCELLED' || movie.status === 'RETURNED') ? 'Completado' : movie.status}
                      </div>

                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between opacity-0 group-hover:opacity-100 absolute inset-0 bg-black/90 transition-opacity">
                      <h4 className="font-bold text-sm text-center mb-2 line-clamp-2 mt-4">{movie.title}</h4>

                      {movie.status === 'RENTED' && (
                        <div className="w-full bg-blue-600/20 text-blue-400 py-2 text-xs font-bold rounded mt-auto text-center uppercase tracking-wider cursor-default pointer-events-none">
                          Rentada
                        </div>
                      )}

                      {(movie.status === 'COMPLETED' || movie.status === 'CANCELLED' || movie.status === 'RETURNED') && (
                        <div className="w-full bg-gray-800/80 text-gray-400 py-2 text-xs font-bold rounded mt-auto text-center uppercase tracking-wider cursor-not-allowed pointer-events-none">
                          Completado
                        </div>
                      )}

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6 border-l-4 border-red-600 pl-3">Mi Lista ({myList?.length || 0})</h2>
            {!myList || myList.length === 0 ? (
              <div className="bg-[#111827]/50 border border-gray-800 rounded-lg p-10 text-center">
                <p className="text-gray-400 text-lg">Tu lista de reproducción está vacía.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {myList.map((movie) => (
                  <div key={movie.id} className="bg-[#111827] rounded-xl overflow-hidden relative group transition hover:scale-105 duration-300 ring-1 ring-gray-800 hover:ring-gray-600 flex flex-col h-full shadow-lg">
                    <div className="relative aspect-[2/3] w-full">
                      <img src={movie.image_url || movie.image} alt={movie.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 absolute inset-0 bg-black/90 transition-opacity text-center mt-auto">
                      <h4 className="font-bold text-sm mb-2 pt-4">{movie.title}</h4>
                      <button
                        onClick={() => removeFromMyList(movie.id)}
                        className="bg-gray-700 hover:bg-red-600 border border-gray-600 hover:border-red-500 py-2 text-xs font-bold rounded mt-auto transition w-full"
                      >
                        Quitar de la lista
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {isEditModalOpen && <EditProfileModal onClose={() => setIsEditModalOpen(false)} />}
      {selectedMovie && <MovieModal movie={selectedMovie} hideActions={true} onClose={() => navigate("/profile")} />}
    </div>
  );
};

export default Profile;

