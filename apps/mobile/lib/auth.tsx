import { Profile, ProfileSchema } from "@recordscratch/types";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useRef } from "react";
import SuperJSON from "superjson";
import { z } from "zod";
import { createStore, useStore } from "zustand";
import env from "~/env";

// Define the context type
type Auth = {
	status: "loading" | "authenticated" | "unauthenticated" | "needsonboarding";
	sessionId: string | null;
	profile: Profile | null;
	logout: () => Promise<void>;
	login: (session?: string) => Promise<void>;
	setSessionId: (sessionId: string) => Promise<void>;
	setProfile: (profile: Profile) => void;
};

type AuthStore = ReturnType<typeof createAuthStore>;

export const createAuthStore = () =>
	createStore<Auth>()((set, get) => ({
		status: "loading",
		sessionId: null,
		setSessionId: async (sessionId) => {
			await SecureStore.setItemAsync("sessionId", sessionId);
			set({ sessionId });
		},
		profile: null,
		setProfile: (profile) => set({ profile }),
		logout: async () => {
			await fetch(env.SITE_URL + "/api/auth/signout", {
				headers: {
					Authorization: `${get().sessionId}`,
				},
			});
			set({ sessionId: null, profile: null });
			await SecureStore.deleteItemAsync("sessionId");
		},
		login: async (session?: string) => {
			const oldSessionId = session ?? (await SecureStore.getItemAsync("sessionId"));

			if (!oldSessionId) {
				set({ status: "unauthenticated" });
				return;
			}

			const res = await fetch(`${env.SITE_URL}/api/auth/refresh?sessionId=${oldSessionId}`);
			const data = await res.json();
			const parsedData = z
				.object({
					sessionId: z.string(),
					profile: ProfileSchema.nullish(),
				})
				.safeParse(
					SuperJSON.deserialize({
						json: data,
						meta: {
							values: {
								"profile.createdAt": ["Date"],
								"profile.updatedAt": ["Date"],
							},
						},
					})
				);

			if (parsedData.error) {
				get().logout();
			} else {
				get().setSessionId(parsedData.data.sessionId);
				if (parsedData.data.profile) {
					get().setProfile(parsedData.data.profile);
					set({ status: "authenticated" });
				} else {
					set({ status: "needsonboarding" });
				}
			}
		},
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
