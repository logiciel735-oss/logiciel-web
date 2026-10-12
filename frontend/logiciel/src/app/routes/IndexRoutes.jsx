import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./publicRoutes";
import { privateRoutes } from "./PrivateRoute";

export const router = createBrowserRouter([
  ...publicRoutes,
  ...privateRoutes,
]);