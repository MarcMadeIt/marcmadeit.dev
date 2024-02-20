import { Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import Home from "./pages/home/Home";
import Login from "./pages/log/Login";
import Register from "./pages/register/Register.jsx";
import { UserContext, UserContextProvider } from "./data/userContext.jsx";
import Admin from "./pages/admin/Admin.jsx";
import Blogs from "./pages/blogs/Blogs.jsx";
import BlogPage from "./pages/blogs/blogPage/BlogPage.jsx";
import EditBlog from "./pages/admin/editBlog/EditBlog.jsx";
import { useContext } from "react";
import Library from "./pages/library/Library.jsx";

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
        <Route element={<Register />} path="/register" />

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

        {/* Other Public Routes */}
        <Route path="/blogs/blog/:id" element={<BlogPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
