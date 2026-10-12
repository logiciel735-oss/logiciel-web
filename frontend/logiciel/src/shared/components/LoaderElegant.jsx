import logo from "../assets/logo/logo-logiciel.png";

const LoaderElegant = ({ text = "Cargando..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm px-4">
      <div className="flex flex-col items-center gap-4">
        
        {/* Contenedor del logo */}
        <div className="w-28 sm:w-36 md:w-44">
          <img
            src={logo}
            alt="Loading"
            className="w-full h-auto object-contain animate-pulse"
          />
        </div>

        {/* Texto */}
        <p className="text-gray-600 text-sm sm:text-base tracking-wide animate-fade text-center">
          {text}
        </p>

        {/* Barra elegante */}
        <div className="w-32 sm:w-40 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-indigo-600 animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default LoaderElegant;
