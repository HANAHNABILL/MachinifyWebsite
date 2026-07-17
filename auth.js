// Frontend Authentication Utility Module
const AuthService = {
    // API endpoint configuration
    API_URL: 'http://localhost:3000/api',

    // Store token in localStorage
    setToken: (token) => {
        localStorage.setItem('token', token);
    },

    // Retrieve token from localStorage
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Store user info in localStorage
    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Retrieve user info from localStorage
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Logout: Clear token and user data
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    },

    // Login function
    login: async (email, password) => {
        try {
            const response = await fetch(`${AuthService.API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                AuthService.setToken(data.token);
                if (data.user) {
                    AuthService.setUser(data.user);
                }
                return { success: true, data };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    },

    // Register function
    register: async (fullName, email, password, role = 'engineer') => {
        try {
            const response = await fetch(`${AuthService.API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fullName, email, password, role })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                AuthService.setToken(data.token);
                if (data.user) {
                    AuthService.setUser(data.user);
                }
                return { success: true, data };
            } else {
                return { success: false, message: data.message || 'Registration failed' };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    },

    // Forgot password function
    forgotPassword: async (email) => {
        try {
            const response = await fetch(`${AuthService.API_URL}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            return { success: response.ok, message: data.message };
        } catch (error) {
            console.error('Forgot password error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    },

    // Make authenticated API request
    request: async (endpoint, options = {}) => {
        const token = AuthService.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${AuthService.API_URL}${endpoint}`, {
                ...options,
                headers
            });

            // If 401, token might be expired, logout
            if (response.status === 401) {
                AuthService.logout();
                return null;
            }

            // try to parse json, otherwise return raw response
            const text = await response.text();
            try { return JSON.parse(text); } catch (_) { return text; }
        } catch (error) {
            console.error('API request error:', error);
            return null;
        }
    },

    // Verify token is valid (optional)
    verifyToken: () => {
        const token = AuthService.getToken();
        if (!token) return false;

        try {
            // Decode JWT (basic check - doesn't verify signature)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000;
            return expiry > Date.now();
        } catch (error) {
            return false;
        }
    }
};

// Export for CommonJS environments (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthService;
}
