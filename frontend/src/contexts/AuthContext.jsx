import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        try {
            const token = authService.getToken();
            const currentUser = authService.getCurrentUser();

            if (token && currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setLoading(true);
            console.log('AuthContext: Attempting login');
            const response = await authService.login(credentials);
            console.log('AuthContext: Login response', response);

            // Check response structure
            if (response.success) {
                // Response is in root
                setUser(response.data.user);
                setIsAuthenticated(true);
                toast.success('Login successful!');
                return { success: true, data: response.data };
            } else if (response.data?.success) {
                // Response is nested in data
                setUser(response.data.data.user);
                setIsAuthenticated(true);
                toast.success('Login successful!');
                return { success: true, data: response.data.data };
            }

            console.log('Login failed - no success flag');
            toast.error(response.error || response.data?.error || 'Login failed');
            return { success: false, error: response.error || response.data?.error };
        } catch (error) {
            console.error('AuthContext login error:', error);
            const errorMessage = error.message || 'Login failed';
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await authService.register(userData);

            if (response.success) {
                toast.success('Registration successful! Please login.');
                return { success: true };
            }

            toast.error(response.error || 'Registration failed');
            return { success: false, error: response.error };
        } catch (error) {
            const errorMessage = error.message || 'Registration failed';
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    //   const register = async (userData) => {
    //     try {
    //       setLoading(true);
    //       const response = await authService.register(userData);

    //       if (response.success) {
    //         toast.success('Registration successful! Please login.');
    //         return { success: true };
    //       }

    //       toast.error(response.error || 'Registration failed');
    //       return { success: false, error: response.error };
    //     } catch (error) {
    //       toast.error(error.message || 'Registration failed');
    //       return { success: false, error: error.message };
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    const logout = async () => {
        try {
            setLoading(true);

            // Try to call logout API if backend is available
            try {
                await authService.logout();
            } catch (apiError) {
                console.log('API logout failed, proceeding with client-side logout',apiError);
            }

            // Clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Reset state
            setUser(null);
            setIsAuthenticated(false);

            // Use navigate instead of window.location for SPA
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }

            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Logout failed');
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (userData) => {
        try {
            const response = await authService.updateProfile(userData);

            if (response.success) {
                setUser(response.data);
                toast.success('Profile updated successfully');
                return { success: true, data: response.data };
            }

            toast.error(response.error || 'Update failed');
            return { success: false, error: response.error };
        } catch (error) {
            toast.error(error.message || 'Update failed');
            return { success: false, error: error.message };
        }
    };

    const changePassword = async (passwordData) => {
        try {
            const response = await authService.changePassword(passwordData);

            if (response.success) {
                toast.success('Password changed successfully');
                return { success: true };
            }

            toast.error(response.error || 'Password change failed');
            return { success: false, error: response.error };
        } catch (error) {
            toast.error(error.message || 'Password change failed');
            return { success: false, error: error.message };
        }
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        isAdmin,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};