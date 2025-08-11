import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const Base_URL = import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    userProfile: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in CheckAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created succesfully!");
        } catch (error) {
            console.log("Error in Signup:", error);
            toast.error("Signup failed. Please try again.");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Login successful!");
        } catch (error) {
            console.log("Error in Login:", error);
            toast.error("Login failed. Please check your credentials.");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logout successful!");
        } catch (error) {
            console.log("Error in Logout:", error);
            toast.error("Logout failed. Please try again.");
        }
    },

    getUserProfile: async () => {
        try {
            const res = await axiosInstance.get("/auth/getUserProfile");
            set({ userProfile: res.data });
        } catch (error) {
            console.log("Error in Get User Profile:", error);
            toast.error("Failed to fetch user profile.");
        }
    },
}))