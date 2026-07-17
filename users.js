// User Management Utility Module
const UserService = {
    // Get current authenticated user
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    // Update user info
    updateCurrentUser: (userUpdates) => {
        const currentUser = UserService.getCurrentUser();
        if (currentUser) {
            const updatedUser = { ...currentUser, ...userUpdates };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        }
        return null;
    },
    
    // Get user role
    getUserRole: () => {
        const user = UserService.getCurrentUser();
        return user ? user.role : null;
    },
    
    // Check if user has specific role
    hasRole: (role) => {
        const userRole = UserService.getUserRole();
        return userRole === role;
    },
    
    // Check if user has admin privileges
    isAdmin: () => {
        return UserService.hasRole('admin');
    },
    
    // Check if user is verified
    isVerified: () => {
        const user = UserService.getCurrentUser();
        return user ? user.isVerified : false;
    },
    
    // Protect routes - redirect if not authenticated
    protectRoute: () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },
    
    // Protect admin routes
    protectAdminRoute: () => {
        const token = localStorage.getItem('token');
        const user = UserService.getCurrentUser();
        
        if (!token || user?.role !== 'admin') {
            alert('You do not have permission to access this page.');
            window.location.href = 'Dashboard.html';
            return false;
        }
        return true;
    },
    
    // Get user display name
    getDisplayName: () => {
        const user = UserService.getCurrentUser();
        return user ? user.fullName : 'User';
    },
    
    // Get user email
    getUserEmail: () => {
        const user = UserService.getCurrentUser();
        return user ? user.email : null;
    },
    
    // Get user ID
    getUserId: () => {
        const user = UserService.getCurrentUser();
        return user ? user.id : null;
    },
    
    // Update user profile (calls backend)
    updateProfile: async (updateData) => {
        try {
            const response = await fetch('http://localhost:3000/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updateData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
            
            const data = await response.json();
            
            // Update local user data
            if (data.user) {
                UserService.updateCurrentUser(data.user);
            }
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Profile update error:', error);
            return { success: false, message: error.message };
        }
    },
    
    // Change password (calls backend)
    changePassword: async (currentPassword, newPassword) => {
        try {
            const response = await fetch('http://localhost:3000/api/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                return { success: false, message: data.message };
            }
            
            return { success: true, message: data.message };
        } catch (error) {
            console.error('Change password error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    },
    
    // Delete user account
    deleteAccount: async (password) => {
        try {
            const response = await fetch('http://localhost:3000/api/delete-account', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                return { success: false, message: data.message };
            }
            
            // Clear local storage and redirect
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
            
            return { success: true, message: data.message };
        } catch (error) {
            console.error('Delete account error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        }
    },
    
    // Get all users (admin only)
    getAllUsers: async () => {
        if (!UserService.isAdmin()) {
            return { success: false, message: 'Unauthorized' };
        }
        
        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            
            const data = await response.json();
            return { success: true, users: data.users };
        } catch (error) {
            console.error('Get users error:', error);
            return { success: false, message: error.message };
        }
    },
    
    // Create session timestamp (for tracking user activity)
    createSession: () => {
        const sessionData = {
            loginTime: new Date().toISOString(),
            userId: UserService.getUserId(),
            email: UserService.getUserEmail()
        };
        sessionStorage.setItem('session', JSON.stringify(sessionData));
        return sessionData;
    },
    
    // Get session info
    getSession: () => {
        const session = sessionStorage.getItem('session');
        return session ? JSON.parse(session) : null;
    },
    
    // End session
    endSession: () => {
        sessionStorage.removeItem('session');
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserService;
}
