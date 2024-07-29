import { Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import Home from "./pages/home/Home.jsx";
import Login from "./pages/log/Login.jsx";
import Register from "./pages/register/Register.jsx";
import { UserContext, UserContextProvider } from "./data/userContext.jsx";
import Admin from "./pages/admin/Admin.jsx";
import Blogs from "./pages/blogs/Blogs.jsx";
import BlogPage from "./pages/blogs/blogPage/BlogPage.jsx";
import EditBlog from "./pages/admin/editBlog/EditBlog.jsx";
import { useContext } from "react";
import Library from "./pages/library/Library.jsx";
import Projects from "./pages/projects/Projects.jsx";
import Podcasts from "./pages/podcasts/Podcasts.jsx";

function ProtectedRoute({ element, path }) {
  const { userInfo } = useContext(UserContext);

  return userInfo.id ? (
    element
  ) : (
    <Navigate to="/" replace state={{ from: path }} />
  );
}

function App() {
  return (
    <UserContextProvider>
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
          path="/edit/:id"
          element={<ProtectedRoute element={<EditBlog />} />}
        />

        {/* Public Route */}
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/library" element={<Library />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/podcasts" element={<Podcasts />} />

        {/* Other Public Routes */}
        <Route path="/blogs/blog/:id" element={<BlogPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
