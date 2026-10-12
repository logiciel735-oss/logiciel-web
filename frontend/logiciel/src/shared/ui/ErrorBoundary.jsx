import { Component } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// Captura errores de renderizado para no dejar la página en blanco.
// En Layout se monta con key={pathname}: al navegar a otra ruta se reinicia.
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Error de interfaz:", error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="card max-w-md p-8 text-center hover:shadow-sm">
          <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <ExclamationTriangleIcon className="h-7 w-7" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-brand-navy">Algo salió mal</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Ocurrió un error inesperado al mostrar esta página. Recarga para intentarlo de nuevo.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button onClick={() => window.location.reload()} className="btn-primary">
              Recargar página
            </button>
            <a href="/" className="btn-secondary">
              Ir al inicio
            </a>
          </div>
        </div>
      </div>
    );
  }
}
