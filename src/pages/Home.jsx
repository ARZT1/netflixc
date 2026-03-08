import { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import LoginForm from "../components/Login/LoginForm";

const Home = () => {
  const { catalog, fetchCatalog } = useAppStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (catalog.length === 0) {
      fetchCatalog();
    }
  }, [catalog.length, fetchCatalog]);

  // Ordenamos por rating (de mayor a menor) de manera segura y tomamos las top 5
  const popularMovies = [...catalog]
    .sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
    .slice(0, 5);

  const handleOpenModal = () => setIsLoginModalOpen(true);
  const handleCloseModal = () => setIsLoginModalOpen(false);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Absolute Header inside Home */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
        <h1 className="text-red-600 text-3xl font-bold tracking-wider">NETFLIX</h1>
        <button 
          onClick={handleOpenModal} 
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition"
        >
          Iniciar Sesión
        </button>
      </header>

      {/* Hero Section */}
      <section 
        className="relative w-full h-[70vh] flex items-center p-8 lg:p-16 border-b-8 border-gray-900"
        style={{
          backgroundImage: `url('https://www.peacocktv.com/dam/growth/assets/Collections/harry-potter/hp-franchise-social-2025.jpg')`, // Example Breaking Bad Hero
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

        <div className="relative z-10 max-w-2xl mt-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Bienvenido a <span className="text-red-600">Netflix</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow-md font-semibold">
            Explora estrenos, tendencias y clásicos. ¿Listo para maratonear?
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button 
              onClick={handleOpenModal}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md transition text-lg"
            >
              Ver más películas
            </button>

          </div>
        </div>
      </section>

      {/* Populares ahora Section */}
      <section className="p-8 lg:px-16 lg:py-12 bg-black relative z-20 -mt-10">
        <h2 className="text-2xl font-bold mb-6">Populares ahora</h2>
        <div className="flex flex-wrap md:flex-nowrap gap-4 lg:gap-6 overflow-x-auto pb-6 scrollbar-hide">
          {popularMovies.length > 0 ? (
            popularMovies.map((movie) => (
              <div 
                key={movie.id} 
                onClick={handleOpenModal}
                className="min-w-[150px] w-1/3 md:w-1/5 bg-[#18181b] rounded-xl overflow-hidden cursor-pointer flex flex-col transition hover:scale-105 duration-300 ring-1 ring-gray-800 hover:ring-gray-600"
              >
                <img 
                  src={movie.image_url || movie.image} 
                  alt={movie.title} 
                  className="w-full aspect-[2/3] object-cover rounded-t-xl" 
                />
                <div className="p-3 flex-1 flex items-start">
                  <h4 className="font-bold text-xs md:text-sm leading-tight text-white mb-1 line-clamp-2">
                    {movie.title}
                  </h4>
                </div>
              </div>
            ))
          ) : (
            // Skeleton Loader for initial fetch
            [1, 2, 3, 4, 5].map((skeleton) => (
              <div key={skeleton} className="min-w-[150px] w-1/5 aspect-[2/3] bg-[#18181b] rounded-xl animate-pulse"></div>
            ))
          )}
        </div>
      </section>

      {/* Render Modal si está abierto */}
      {isLoginModalOpen && <LoginForm onClose={handleCloseModal} />}
    </div>
  );
};

export default Home;
