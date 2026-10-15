import Layout from "../../shared/components/layout/Layout";
import { ProtectedRoutes } from "./ProtectedRoutes";

import ProfilePage from "../../pages/ProfilePage";
import AdminUsersManagement from "../../pages/AdminUsersManagement";
import AuditPage from "../../pages/AuditPage";



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
      {
        path: "/admin/users",
        element: (
          <ProtectedRoutes role="admin">
            <AdminUsersManagement />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/admin/auditoria",
        element: (
          <ProtectedRoutes role="admin">
            <AuditPage />
          </ProtectedRoutes>
        ),
      },
    ],
  },
];