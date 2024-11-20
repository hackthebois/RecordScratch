import env from "@/env";
import { Profile, ProfileSchema, UserSchema } from "@recordscratch/types";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { createContext, useContext, useEffect, useRef } from "react";
import SuperJSON from "superjson";
import { z } from "zod";
import { createStore, useStore } from "zustand";
import { api } from "./api";
import { catchError } from "./errors";
import { registerForPushNotificationsAsync } from "./notifications";

// Define the context type
type Auth = {
	status: "loading" | "authenticated" | "unauthenticated" | "needsonboarding";
	sessionId: string | null;
	profile: Profile | null;
	logout: () => Promise<void>;
	login: (session?: string) => Promise<void>;
	setSessionId: (sessionId: string) => Promise<void>;
	setProfile: (profile: Profile) => void;
	setStatus: (status: Auth["status"]) => void;
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
		setStatus: (status) => set({ status }),
		profile: null,
		setProfile: (profile) => set({ profile }),
		logout: async () => {
			await fetch(env.SITE_URL + "/api/auth/signout", {
				headers: {
					Authorization: `${get().sessionId}`,
				},
			});
			set({ sessionId: null, profile: null, status: "unauthenticated" });
			await SecureStore.deleteItemAsync("sessionId");
		},
		login: async (session?: string) => {
			const sessionId = session ?? (await SecureStore.getItemAsync("sessionId"));

			const expoPushToken = await registerForPushNotificationsAsync();

			if (!sessionId) {
				set({ status: "unauthenticated" });
				return;
			}

			const res = await fetch(`${env.SITE_URL}/api/auth/me`, {
				headers: {
					"Expo-Push-Token": expoPushToken ?? "",
					Authorization: sessionId,
				},
			});
			const data = await res.json();
			const parsedData = z
				.object({
					user: UserSchema.extend({
						profile: ProfileSchema.nullish(),
					}).nullable(),
				})
				.safeParse(
					SuperJSON.deserialize({
						json: data,
						meta: {
							values: {
								"user.profile.createdAt": ["Date"],
								"user.profile.updatedAt": ["Date"],
							},
						},
					})
				);

			if (parsedData.error || !parsedData.data.user) {
				get().logout();
			} else {
				get().setSessionId(sessionId);
				if (parsedData.data.user.profile) {
					get().setProfile(parsedData.data.user.profile);
					set({ status: "authenticated" });
				} else {
					set({ status: "needsonboarding" });
				}
			}
		},
	}));

export const AuthContext = createContext<AuthStore | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const store = useRef(createAuthStore()).current;
	const login = useStore(store, (s) => s.login);
	const logout = useStore(store, (s) => s.logout);
	const status = useStore(store, (s) => s.status);

	useEffect(() => {
		login()
			.catch((e) => {
				catchError(e);
				logout().then(() => {
					router.replace("/signin");
				});
			})
			.finally(async () => {
				await SplashScreen.hideAsync();
			});
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

export const Prefetch = ({ handle, userId }: { handle: string; userId: string }) => {
	api.profiles.get.usePrefetchQuery(handle);
	api.ratings.user.streak.usePrefetchQuery({ userId });
	api.ratings.user.totalLikes.usePrefetchQuery({ userId });
	api.profiles.distribution.usePrefetchQuery({ userId });
	api.lists.topLists.usePrefetchQuery({ userId });
	api.profiles.getTotalRatings.usePrefetchQuery({ userId });
	api.profiles.followCount.usePrefetchQuery({
		profileId: userId,
		type: "followers",
	});
	api.profiles.followCount.usePrefetchQuery({
		profileId: userId,
		type: "following",
	});

	return null;
};

export const PrefetchProfile = (props: { handle?: string; userId?: string }) => {
	const profile = useAuth((s) => s.profile);
	const handle = props.handle ?? profile?.handle ?? "";
	const userId = props.userId ?? profile?.userId ?? "";

	if (handle && userId) {
		return <Prefetch handle={handle} userId={userId} />;
	}

	return null;
};
