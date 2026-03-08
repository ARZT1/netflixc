const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0b0f14] text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl text-gray-400 mb-8">Página no encontrada.</p>
      <a href="/" className="text-red-500 hover:text-red-400">Volver al inicio</a>
    </div>
  );
};
export default NotFound;
