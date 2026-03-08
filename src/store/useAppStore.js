import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Swal from 'sweetalert2';

const API_URL = "https://f3b22fa3c34192b3.mokky.dev";

export const useAppStore = create(
  persist(
    (set, get) => ({
      // --- AUTH STATE ---
      user: null,
      users: [],
      isAuthenticated: false,
      isLoadingAuth: false,

      // --- CATALOG STATE ---
      catalog: [],
      categories: [],
      isLoadingCatalog: false,

      // --- CART/RENTALS STATE ---
      rentedMovies: [],
      myList: [],
      isLoadingRentals: false,

      // ========================
      //       AUTH ACTIONS
      // ========================
      fetchUsers: async () => {
        try {
          const res = await fetch(`${API_URL}/users`);
          let data = await res.json();
          if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
            data = data[0]; 
          }
          set({ users: data });
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      },

      login: async (email, password) => {
        try {
          set({ isLoadingAuth: true });
          const res = await fetch(`${API_URL}/users`);
          let data = await res.json();
          
          if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
            data = data[0]; // Flatten one level
          }

          const loggedUser = data.find(u => u.email === email && u.password === password);

          if (loggedUser) {
            set({ 
              user: { id: loggedUser.id, name: loggedUser.name, email: loggedUser.email, role: loggedUser.role }, 
              isAuthenticated: true 
            });
            return { success: true, role: loggedUser.role };
          }
          return { success: false };
        } catch (error) {
          console.error("Login Error:", error);
          Swal.fire({
            title: 'Error',
            text: "Error al iniciar sesión, intente nuevamente",
            icon: 'error',
            background: "#111827", color: "#fff", confirmButtonColor: "#e50914"
          });
          return { success: false };
        } finally {
          set({ isLoadingAuth: false });
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, rentedMovies: [], myList: [], users: [] });
      },

      hasRole: (roles) => {
        const currentUser = get().user;
        if (!currentUser) return false;
        
        if (Array.isArray(roles)) {
            return roles.includes(currentUser.role);
        }
        return currentUser.role === roles;
      },

      // ========================
      //     CATALOG ACTIONS
      // ========================
      fetchCatalog: async () => {
        set({ isLoadingCatalog: true });
        try {
          const res = await fetch(`${API_URL}/movies`);
          const movies = await res.json();
          
          const categories = [...new Set(movies.map(m => m.category || "General"))];
          set({ catalog: movies, categories });
        } catch (error) {
          console.error("Error fetching catalog:", error);
        } finally {
          set({ isLoadingCatalog: false });
        }
      },

      // ========================
      //     RENTALS ACTIONS
      // ========================
      rentMovie: async (movie) => {
        const currentUser = get().user;
        if (!currentUser) return false;

        // Avoid adding the same movie twice
        if (get().rentedMovies.some((r) => r.movie_id === movie.id || r.id === movie.id)) { // Added r.id === movie.id for consistency
          return false;
        }

        const rentalData = {
          user_id: currentUser.id,
          movie_id: movie.id,
          movie_title: movie.title,
          price: movie.price || 4.99,
          status: "RENTED",
        };

        try {
          const res = await fetch(`${API_URL}/rentals`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rentalData),
          });

          if (res.ok) {
            get().fetchRentedMovies(); // Refresh UI
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error renting movie:", error);
          return false;
        }
      },

      fetchRentedMovies: async () => {
        const currentUser = get().user;
        if (!currentUser) return;

        set({ isLoadingRentals: true });
        try {
          const [rentalsRes, moviesRes] = await Promise.all([
            fetch(`${API_URL}/rentals?user_id=${currentUser.id}&status=RENTED`),
            fetch(`${API_URL}/movies`) // Necesitamos el catálogo para extraer las imágenes reales
          ]);

          const rentalsData = await rentalsRes.json();
          const catalogData = await moviesRes.json();

          const loadedMovies = rentalsData.map(rental => {
            const originalMovie = catalogData.find(m => m.id === rental.movie_id) || {};
            return {
              ...originalMovie, // Inject all properties like description/rating
              id: rental.movie_id, // keep it formatted for standard use
              rental_id: rental.id, 
              title: rental.movie_title,
              status: rental.status,
              category: originalMovie.category || "",
              price: rental.price,
              image_url: originalMovie.image_url || originalMovie.image || `https://image.tmdb.org/t/p/w200/51tqzRtKMMZEYUpSYfkZZ8d6xGC.jpg`
            };
          });
          set({ rentedMovies: loadedMovies });
        } catch (error) {
          console.error("Error fetching rentals:", error);
        } finally {
          set({ isLoadingRentals: false });
        }
      },

      cancelRental: async (rentalId) => {
        try {
          // Cambiar el estado a CANCELLED o eliminar el registro dependiendo del diseño del API
          const res = await fetch(`${API_URL}/rentals/${rentalId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "CANCELLED" })
          });

          if (res.ok) {
            set((state) => ({
              rentedMovies: state.rentedMovies.filter((m) => m.rental_id !== rentalId)
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error cancelling rental:", error);
          return false;
        }
      },

      addToMyList: (movie) => {
        const isAlreadyInList = get().myList.some((m) => m.id === movie.id);
        if (isAlreadyInList) return false;

        set((state) => ({ myList: [...state.myList, movie] }));
        return true;
      },

      removeFromMyList: (movieId) => {
        set((state) => ({ myList: state.myList.filter((m) => m.id !== movieId) }));
      }
    }),
    {
      name: "netflix-clone-storage", // local storage key
      storage: createJSONStorage(() => localStorage)
    }
  )
);
