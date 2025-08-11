import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useEsp32Store = create((set, get) => ({
    devices: [],
    data: [],
    isDataLoading: false,
    isDevicesLoading: false,
    selectedDevice: null,
    deviceName: "",

    getDevices: async () => {
        set({ isDevicesLoading: true });
        try {
            const res = await axiosInstance.get("/esp32/devices");
            set({ devices: res.data });
        } catch (error) {
            console.error("Error fetching devices:", error);
            toast.error("Failed to fetch devices. Please try again.");
        } finally {
            set({ isDevicesLoading: false });
        }
    },

    getData: async () => {
        set({ isDataLoading: true });
        try {
            const selectedDevice = get().selectedDevice;
            const res = await axiosInstance.get(`/esp32/${selectedDevice}`);
            set({ data: res.data });
            toast.success("Data fetched successfully!");
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch data. Please try again.");
        } finally {
            set({ isDataLoading: false });
        }
    },

    setSelectedDevice: (selectedDevice) => set({selectedDevice}),

    setDeviceName: (deviceName) => set({ deviceName }),

    setData: (data) => set({ data }),

    setDevices: (devices) => set({ devices }),

    createDevice: async (deviceName) => {
        try {
            await axiosInstance.post("/esp32/createEsp32", { deviceName });
            toast.success("Device created successfully!");
            await get().getDevices(); // Refresh devices list after creation
        } catch (error) {
            console.error("Error creating device:", error);
            toast.error("Failed to create device. Please try again.");
        }
    },

    renameDevice: async (deviceId, newDeviceName) => {
        try {
            await axiosInstance.patch("/esp32/renameDevice", { deviceId, newDeviceName });
            toast.success("Device renamed successfully!");
            await get().getDevices(); // Refresh devices list after renaming
        } catch (error) {
            console.error("Error renaming device:", error);
            toast.error("Failed to rename device. Please try again.");
        }
    },

    deleteDevice: async (deviceId) => {
        try {
            await axiosInstance.delete("/esp32/deleteDevice", {
                data: { deviceId }
            });
            toast.success("Device deleted successfully!");
            await get().getDevices(); 
        } catch (error) {
            console.error("Error deleting device:", error);
            toast.error("Failed to delete device. Please try again.");
        }
    },
}))