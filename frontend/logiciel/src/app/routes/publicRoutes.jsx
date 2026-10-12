import Layout from "../../shared/components/layout/Layout";

import HomePage from "../../pages/HomePage";
import AboutPage from "../../pages/AboutPage";
import ProjectsPage from "../../pages/ProjectsPage";
import PublicationsPage from "../../pages/PublicationsPage";
import NewsPage from "../../pages/NewsPage";
import ContactPage from "../../pages/ContactPage";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import ConfirmEmail from "../../pages/ConfirmEmail";
import ProjectDetailPage from "../../pages/ProjectDetailPage";
import EventDetailWidget from "../../widgets/event-detail/EventDetailWidget";
import MembersDetailPage from "../../pages/MembersDetailPage";
import NewsDetailWidget from "../../widgets/news-detail/NewsDetailWidget";
import MyProjects from "../../pages/MyProjects";

export const publicRoutes = [
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/members/:uid", element: <MembersDetailPage /> },
      { path: "/confirm-email", element: <ConfirmEmail /> },
      { path: "/projects", element: <ProjectsPage /> },
      { path: "/projects/:estado/:id", element: <ProjectDetailPage /> },
      { path: "/publications", element: <PublicationsPage /> },
      { path: "/news", element: <NewsPage /> },
      { path: "/news/:id", element: <NewsDetailWidget /> },
      { path: "/events/:id", element: <EventDetailWidget /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/my-proyects", element: <MyProjects /> },
    ],
  },
];