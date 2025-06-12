import axios from "axios";

const backendDomain = "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: backendDomain,
  timeout: 5000,
  withCredentials: true,
});

// Helper for image URLs
export const imageUrl = (path) => `http://localhost:3000/${path}`;

// API endpoints object (flattened, based on your Postman documentation)
const ApiEndpoints = {
  // Auth
  login: {
    url: "/user/login",
    method: "POST",
    request: (data) => api.post("/user/login", data),
  },
  register: {
    url: "/user/register",
    method: "POST",
    request: (data) => api.post("/user/register", data),
  },
  logout: {
    url: "/user/logout",
    method: "POST",
    request: () => api.post("/user/logout"),
  },

  // User
  getProfile: {
    url: "/user/profile",
    method: "GET",
    request: () => api.get("/user/profile"),
  },
  updateProfile: {
    url: "/users/profile/edit",
    method: "PATCH",
    request: (data, file) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (file) formData.append("avatar", file);
      return api.patch("/users/profile/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  },
  getAllUsers: {
    url: "/users",
    method: "GET",
    request: () => api.get("/users"),
  },
  getUserById: {
    url: (id) => `/users/${id}`,
    method: "GET",
    request: (id) => api.get(`/users/${id}`),
  },
  deleteUser: {
    url: (id) => `/users/${id}`,
    method: "DELETE",
    request: (id) => api.delete(`/users/${id}`),
  },

  // Product
  getAllProducts: {
    url: "/products",
    method: "GET",
    request: () => api.get("/products"),
  },
  getProductById: {
    url: (id) => `/products/${id}`,
    method: "GET",
    request: (id) => api.get(`/products/${id}`),
  },
  addProduct: {
    url: "/products",
    method: "POST",
    request: (data, file) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (file) formData.append("image", file);
      return api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  },
  updateProduct: {
    url: (id) => `/products/${id}`,
    method: "PUT",
    request: (id, data, file) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (file) formData.append("image", file);
      return api.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
  },
  deleteProduct: {
    url: (id) => `/products/${id}`,
    method: "DELETE",
    request: (id) => api.delete(`/products/${id}`),
  },

  // Cart
  getCart: {
    url: "/cart",
    method: "GET",
    request: () => api.get("/cart"),
  },
  addToCart: {
    url: "/cart",
    method: "POST",
    request: (data) => api.post("/cart", data),
  },
  updateCart: {
    url: "/cart",
    method: "PUT",
    request: (data) => api.put("/cart", data),
  },
  removeFromCart: {
    url: (productId) => `/cart/${productId}`,
    method: "DELETE",
    request: (productId) => api.delete(`/cart/${productId}`),
  },
  clearCart: {
    url: "/cart/clear",
    method: "DELETE",
    request: () => api.delete("/cart/clear"),
  },

  // Wishlist
  getWishlist: {
    url: "/wishlist",
    method: "GET",
    request: () => api.get("/wishlist"),
  },
  addToWishlist: {
    url: "/wishlist",
    method: "POST",
    request: (data) => api.post("/wishlist", data),
  },
  removeFromWishlist: {
    url: (productId) => `/wishlist/${productId}`,
    method: "DELETE",
    request: (productId) => api.delete(`/wishlist/${productId}`),
  },
  clearWishlist: {
    url: "/wishlist/clear",
    method: "DELETE",
    request: () => api.delete("/wishlist/clear"),
  },

  // Orders
  createOrder: {
    url: "/orders",
    method: "POST",
    request: (data) => api.post("/orders", data),
  },
  getOrders: {
    url: "/orders",
    method: "GET",
    request: () => api.get("/orders"),
  },
  getOrderById: {
    url: (id) => `/orders/${id}`,
    method: "GET",
    request: (id) => api.get(`/orders/${id}`),
  },
  cancelOrder: {
    url: (id) => `/orders/${id}/cancel`,
    method: "PUT",
    request: (id) => api.put(`/orders/${id}/cancel`),
  },

  // Reviews
  getProductReviews: {
    url: (productId) => `/products/${productId}/reviews`,
    method: "GET",
    request: (productId) => api.get(`/products/${productId}/reviews`),
  },
  addReview: {
    url: (productId) => `/products/${productId}/reviews`,
    method: "POST",
    request: (productId, data) =>
      api.post(`/products/${productId}/reviews`, data),
  },
  deleteReview: {
    url: (reviewId) => `/reviews/${reviewId}`,
    method: "DELETE",
    request: (reviewId) => api.delete(`/reviews/${reviewId}`),
  },

  // Admin
  adminLogin: {
    url: "/admin/login",
    method: "POST",
    request: (data) => api.post("/admin/login", data),
  },
  getDashboardStats: {
    url: "/admin/dashboard-stats",
    method: "GET",
    request: () => api.get("/admin/dashboard-stats"),
  },
  getAdminOrders: {
    url: "/admin/orders",
    method: "GET",
    request: () => api.get("/admin/orders"),
  },
  updateOrderStatus: {
    url: (orderId) => `/admin/orders/${orderId}`,
    method: "PUT",
    request: (orderId, status) =>
      api.put(`/admin/orders/${orderId}`, { status }),
  },
};

export { api };
export default ApiEndpoints;
