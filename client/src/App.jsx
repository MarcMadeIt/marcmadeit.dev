import { Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import Home from "./pages/home/Home.jsx";
import Login from "./pages/log/Login.jsx";
import Register from "./pages/register/Register.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import Admin from "./pages/admin/Admin.jsx";
import Blogs from "./pages/blogs/Blogs.jsx";
import BlogPage from "./pages/blogs/blogPage/BlogPage.jsx";
import Projects from "./pages/projects/Projects.jsx";
import Podcasts from "./pages/podcasts/Podcasts.jsx";
import EditProject from "./pages/admin/edit/editProject/EditProject.jsx";
import EditPodcast from "./pages/admin/edit/editPodcast/EditPodcast.jsx";
import EditBlog from "./pages/admin/edit/editBlog/EditBlog.jsx";
import { useContext } from "react";

function ProtectedRoute({ element, path }) {
  const { user } = useContext(AuthContext);

  return user ? element : <Navigate to="/" replace state={{ from: path }} />;
}

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/register"
        element={<ProtectedRoute element={<Register />} path="/register" />}
      />

      {/* Protected Routes */}
      <Route
        path="/admin"
        element={<ProtectedRoute element={<Admin />} path="/admin" />}
      />

      <Route
        path="/blog/edit/:id"
        element={<ProtectedRoute element={<EditBlog />} />}
      />
      <Route
        path="/project/edit/:id"
        element={<ProtectedRoute element={<EditProject />} />}
      />
      <Route
        path="/podcast/edit/:id"
        element={<ProtectedRoute element={<EditPodcast />} />}
      />

      {/* Public Route */}
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/podcasts" element={<Podcasts />} />

      {/* Other Public Routes */}
      <Route path="/blogs/blog/:id" element={<BlogPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
