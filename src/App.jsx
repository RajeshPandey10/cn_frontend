import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header.jsx";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserHomePage from "./layouts/user/userHomePage.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Profile from "./pages/Profile.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Orders from "./pages/Order.jsx";
import Checkout from "./components/Checkout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./Admin/pages/Dashboard.jsx";
import Layout from "./Admin/layouts/Layout.jsx";

const App = () => {
  // Create a wrapper component to handle header visibility
  const AppContent = () => {
    const location = useLocation();
    const { auth } = useAuth();
    const isAdminRoute = location.pathname.startsWith("/admin");
    const hideHeaderPaths = ["/admin/login", "/signin", "/signup"];
    const shouldShowHeader =
      !hideHeaderPaths.includes(location.pathname) && !isAdminRoute;

    return (
      <div className="flex flex-col min-h-screen">
        {shouldShowHeader && <Header />}

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* Protected User Routes - Use ProtectedRoute for user role */}
            <Route
              path="/userHomePage"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserHomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <Orders />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes - Use ProtectedRoute for admin role, with Layout and nested routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              {/* Add more admin child routes here, e.g. products, users, orders, etc. */}
            </Route>
          </Routes>
        </main>

        {shouldShowHeader && <Footer />}
        <ToastContainer />
      </div>
    );
  };

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <AppContent />
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
