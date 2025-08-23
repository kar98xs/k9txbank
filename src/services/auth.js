import axios from "axios";

const API_URL = "https://k9txelite.pythonanywhere.com/api";

const authService = {
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/register/`, userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login/`, {
      email,
      password,
    });
    if (response.data.access) {
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  resetPassword: async (email) => {
    const response = await axios.post(`${API_URL}/password-reset/request/`, {
      email,
    });
    return response.data;
  },

  verifyOTP: async (data) => {
    const response = await axios.post(
      `${API_URL}/password-reset/verify/`,
      data
    );
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/password/change/`,
      { old_password: oldPassword, new_password: newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  depositMoney: async (amount) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/deposit/`,
      { amount },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  transferMoney: async ({ to_account_number, amount }) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/transfer/`,
      { to_account_number, amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  resolveAccount: async (accountNumber) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/resolve-account/`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { account_number: accountNumber },
    });
    return response.data;
  },

  getBalance: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/balance/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getBlogs: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/blogs/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  createBlog: async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/blogs/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Blog creation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Blog creation error:", error.response || error);
      throw error;
    }
  },

  // Update the deleteBlog function with better error handling
  deleteBlog: async (blogId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      console.log(`Attempting to delete blog ${blogId}`); // Debug log

      const response = await axios.delete(`${API_URL}/blogs/${blogId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Blog deletion response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Blog deletion error:", {
        message: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  },

  getComments: async (blogId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/blogs/${blogId}/comments/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  addComment: async ({ blogId, content, parent = null }) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/blogs/${blogId}/comments/`,
      { content, parent },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  getTransactions: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/transactions/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getUsers: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/users/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getMe: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateMe: async (formData) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/me/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          ...response.data,
        })
      );
    }
    return response.data;
  },

  // Loans
  getLoans: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/loans/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  applyLoan: async ({ amount, term_months, purpose, interest_rate }) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/loans/`,
      { amount, term_months, purpose, interest_rate },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  actOnLoan: async (loanId, action) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      console.log(`Making loan ${action} request:`, loanId); // Debug log

      const response = await axios.post(
        `${API_URL}/loans/${loanId}/${action}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`Loan ${action} response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Loan ${action} error:`, {
        message: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  },

  // Axios interceptor for handling token refresh
  setupAxiosInterceptors: () => {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config || {};
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) throw new Error("No refresh token");
            const response = await axios.post(`${API_URL}/token/refresh/`, {
              refresh: refreshToken,
            });
            localStorage.setItem("token", response.data.access);
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            return axios(originalRequest);
          } catch (err) {
            authService.logout();
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );
  },
};

export default authService;
