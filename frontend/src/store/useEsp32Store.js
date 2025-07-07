import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useEsp32Store = create((set, get) => ({
    deviceReading: null,
    isFetchingData: false,

    FetchData: async () => {
        set({ isFetchingData: true });
        try {
            const res = await axiosInstance.get(`/esp32/${deviceId}`);
            set({ deviceReading: res.data });
            toast.success("Data fetched successfully!");
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch data. Please try again.");
        } finally {
            set({ isFetchingData: false });
        }
    },
}))