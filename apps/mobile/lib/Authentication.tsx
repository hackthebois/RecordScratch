import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define the context type
interface AuthContextType {
	sessionId: string | null;
	login: (id: string) => Promise<void>;
	logout: () => Promise<void>;
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
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchSessionId = async () => {
			const id = await getSessionId();
			setSessionId(id);
			setLoading(false);
		};

		fetchSessionId();
	}, []);

	useEffect(() => {
		if (!loading && !sessionId) {
			router.replace("/signin");
		}
	}, [loading, sessionId, router]);

	const login = async (id: string) => {
		await SecureStore.setItemAsync("sessionId", id);
		setSessionId(id);
	};

	const logout = async () => {
		await SecureStore.deleteItemAsync("sessionId");
		setSessionId(null);
	};

	if (loading) {
		return null; // or some loading spinner/component
	}

	return (
		<AuthContext.Provider value={{ sessionId, login, logout }}>{children}</AuthContext.Provider>
	);
};
