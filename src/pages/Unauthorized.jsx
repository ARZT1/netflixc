const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-[#0b0f14] text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-2">403</h1>
      <p className="text-xl text-gray-400 mb-8">No tienes permiso para ver esta página.</p>
      <a href="/dashboard" className="text-red-500 hover:text-red-400">Volver al Dashboard</a>
    </div>
  );
};

export default Unauthorized;
