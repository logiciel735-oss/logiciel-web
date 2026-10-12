import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// Campo de contraseña con botón para mostrar/ocultar (el estado lo controla el padre)
export default function PasswordInput({ show, onToggle, ...props }) {
  return (
    <div className="relative">
      <input {...props} type={show ? "text" : "password"} className="input-base py-2.5 pr-11" />
      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-brand-teal"
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {show ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
        </button>
      )}
    </div>
  );
}
