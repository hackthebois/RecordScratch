import { Profile } from "@recordscratch/types";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useRef } from "react";
import { createStore, useStore } from "zustand";

// Define the context type
type Auth = {
	status: "loading" | "authenticated" | "unauthenticated";
	sessionId: string | null;
	profile: Profile | null;
	logout: () => void;
	login: () => Promise<void>;
	setSessionId: (sessionId: string) => void;
	setProfile: (profile: Profile) => void;
};

type AuthStore = ReturnType<typeof createAuthStore>;

export const createAuthStore = () =>
	createStore<Auth>()((set) => ({
		status: "loading",
		sessionId: null,
		profile: null,
		logout: () => set({ sessionId: null, profile: null }),
		login: async () => {
			const sessionId = await SecureStore.getItemAsync("sessionId");
			if (!sessionId) {
				set({ status: "unauthenticated" });
				return;
			}
			set({ sessionId, status: "authenticated" });
		},
		setSessionId: async (sessionId) => {
			await SecureStore.setItemAsync("sessionId", sessionId);
			set({ sessionId });
		},
		setProfile: (profile) => set({ profile }),
	}));

export const AuthContext = createContext<AuthStore | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const store = useRef(createAuthStore()).current;
	const login = useStore(store, (s) => s.login);
	const status = useStore(store, (s) => s.status);

	useEffect(() => {
		login();
	}, [login]);

	if (status === "loading") {
		return null;
	}

	return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
};

export function useAuth<T>(selector: (state: Auth) => T): T {
	const store = useContext(AuthContext);
	if (!store) throw new Error("Missing AuthContext.Provider in the tree");
	return useStore(store, selector);
}
