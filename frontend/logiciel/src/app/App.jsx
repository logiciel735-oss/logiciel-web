

import { RouterProvider } from "react-router-dom";
import { router } from "./routes/IndexRoutes";
import { AuthProvider } from "../features/auth/providers/AuthProvider";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;