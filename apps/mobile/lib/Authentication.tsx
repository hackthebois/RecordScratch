import { Profile } from "@recordscratch/types";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define the context type
interface AuthContextType {
	sessionId: string | null;
	myProfile: Profile | null;
	setSessionId: (id: string) => Promise<void>;
	clearSessionId: () => Promise<void>;
	setProfile: (profile: Profile) => void;
	clearProfile: () => void;
}

// Create the Auth context with a default value of undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};

const getSessionId = async () => {
	return await SecureStore.getItemAsync("sessionId");
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [sessionId, setId] = useState<string | null>(null);
	const [myProfile, setMyProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchSessionId = async () => {
			const id = await getSessionId();
			setId(id);
			setLoading(false);
		};

		fetchSessionId();
	}, []);

	useEffect(() => {
		if (!loading) {
			if (!sessionId) router.replace("/signin");
			else if (!myProfile) router.replace("");
		}
	}, [loading, sessionId, myProfile, router]);

	const setSessionId = async (id: string) => {
		await SecureStore.setItemAsync("sessionId", id);
		setId(id);
	};

	const clearSessionId = async () => {
		await SecureStore.deleteItemAsync("sessionId");
		setId(null);
	};

	const setProfile = (profile: Profile) => {
		setMyProfile(profile);
	};
	const clearProfile = () => {
		setMyProfile(null);
	};

	if (loading) {
		return null; // or some loading spinner/component
	}

	return (
		<AuthContext.Provider
			value={{ sessionId, setSessionId, clearSessionId, myProfile, setProfile, clearProfile }}
		>
			{children}
		</AuthContext.Provider>
	);
};
