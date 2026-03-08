import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import MovieModal from "../../components/Dashboard/MovieModal";

const Dashboard = () => {
  const { catalog, categories, isLoadingCatalog: isLoading, fetchCatalog } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  useEffect(() => {
    if (id && catalog.length > 0) {
      const movie = catalog.find((m) => m.id.toString() === id);
      setSelectedMovie(movie || null);
    } else {
      setSelectedMovie(null);
    }
  }, [id, catalog]);

  if (isLoading) {
    return <div className="min-h-screen bg-[#0b0f14] text-white flex items-center justify-center">Cargando catálogo...</div>;
  }

  // Filtrado de películas por búsqueda y categoría
  const filteredCatalog = catalog.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchedCategory = selectedCategory === "All" || (movie.category || "General") === selectedCategory;
    return matchesSearch && matchedCategory;
  });

  // Determinar si debemos renderizar categorías organizadas o un layout tipo grid plano (ej. cuando se busca)
  const isFiltering = searchTerm.length > 0 || selectedCategory !== "All";

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white p-8">
      <Navbar />

      {/* Control Bar: Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-[#111827] p-4 rounded-lg border border-gray-800 shadow-md">
        <h2 className="text-2xl font-bold hidden md:block">Catálogo</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por título..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1f2937] border border-gray-700 text-white rounded-md pl-10 pr-4 py-2 focus:outline-none focus:border-red-500 transition"
            />
          </div>

          {/* Category Filter */}
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 bg-[#1f2937] border border-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:border-red-500 transition cursor-pointer"
          >
            <option value="All">Todas las categorías</option>
            {categories?.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredCatalog.length === 0 && (
        <div className="text-center text-gray-500 py-16">
          <p className="text-xl">No se encontraron películas que coincidan con tu búsqueda.</p>
        </div>
      )}

      {/* Grid view if searching or filtering directly, otherwise keep the Category horizontal rows */}
      {isFiltering ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredCatalog.map(movie => (
            <div 
              key={movie.id} 
              onClick={() => navigate(`/dashboard/movie/${movie.id}`)}
              className="bg-[#111827] rounded-lg overflow-hidden cursor-pointer group relative transition hover:scale-105 duration-300 ring-1 ring-gray-800 hover:ring-gray-600 flex flex-col"
            >
              <img src={movie.image_url || movie.image} alt={movie.title} className="w-full aspect-[2/3] object-cover rounded-t-lg" />
              <div className="p-3 bg-[#111827]">
                  <h4 className="font-bold text-sm leading-tight text-white mb-1 line-clamp-1">{movie.title}</h4>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Render Rows per Category
        categories?.map((category) => {
          const categoryMovies = filteredCatalog.filter(m => (m.category || "General") === category);
          
          if (categoryMovies.length === 0) return null;

          return (
            <div key={category} className="mb-10">
              <h3 className="text-xl font-semibold mb-4 text-gray-200 border-l-4 border-red-600 pl-3">{category}</h3>
              
              <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                {categoryMovies.map(movie => (
                  <div 
                    key={movie.id} 
                    onClick={() => navigate(`/dashboard/movie/${movie.id}`)}
                    className="min-w-[150px] w-[150px] md:min-w-[180px] md:w-[180px] bg-[#111827] rounded-lg overflow-hidden cursor-pointer group relative transition hover:scale-105 duration-300 ring-1 ring-gray-800 hover:ring-gray-600"
                  >
                    <img src={movie.image_url || movie.image} alt={movie.title} className="w-full aspect-[2/3] object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <h4 className="font-bold text-xs md:text-sm leading-tight text-white mb-1">{movie.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* Render Modal if a movie is selected */}
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => navigate("/dashboard")} 
        />
      )}
    </div>
  );
};

export default Dashboard;

