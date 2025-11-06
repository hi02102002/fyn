import { create } from "zustand";

interface AuthLoadingState {
	loading: boolean;
	setLoading: (value: boolean) => void;
}

export const useAuthLoading = create<AuthLoadingState>((set) => ({
	loading: false,
	setLoading: (value) => set({ loading: value }),
}));
