import Layout from "../../shared/components/layout/Layout";
import { ProtectedRoutes } from "./ProtectedRoutes";

import ProfilePage from "../../pages/ProfilePage";
import AdminUsersManagement from "../../pages/AdminUsersManagement";



export const privateRoutes = [
  {
    element: <Layout />,
    children: [
      {
        path: "/profile",
        element: (
          <ProtectedRoutes>
            <ProfilePage />
          </ProtectedRoutes>
        ),
      },
      // {
      //   path: "/dashboard",
      //   element: (
      //     <ProtectedRoutes role="user">
      //       <UserDashboard />
      //     </ProtectedRoutes>
      //   ),
      // },
      // {
      //   path: "/admin",
      //   element: (
      //     <ProtectedRoutes role="admin">
      //       <AdminDashboard />
      //     </ProtectedRoutes>
      //   ),
      // },
      {
        path: "/admin/users",
        element: (
          <ProtectedRoutes role="admin">
            <AdminUsersManagement />
          </ProtectedRoutes>
        ),
      },
    ],
  },
];