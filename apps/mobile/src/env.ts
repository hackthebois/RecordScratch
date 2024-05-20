import { Platform } from "react-native";

export const env = {
	R2_PUBLIC_URL: "https://pub-e7db95dc6e1e42f5b6e54c7af15e3db1.r2.dev",
	CF_PAGES_URL: Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000",
};
