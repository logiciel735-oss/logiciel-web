import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../../widgets/navbar/ui/Navbar";
import Footer from "./Footer";
import ErrorBoundary from "../../ui/ErrorBoundary";

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary key={pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
