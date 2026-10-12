export default function MiembroCardEstatico({ miembro }) {
  return (
    <div className="group min-w-[260px] bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:border-teal-100">

      {/* Avatar con inicial */}
      <div className="relative mb-4">
        <div className="w-32 h-32 rounded-full bg-teal-600 text-white flex items-center justify-center text-4xl font-bold shadow-inner ring-4 ring-slate-50 group-hover:ring-teal-50 transition-all">
          {miembro.name?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Información */}
      <div className="text-center w-full">
        <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-teal-600 transition-colors">
          {miembro.name}
        </h3>
        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-wide">
          {miembro.role}
        </p>
      </div>
    </div>
  );
}