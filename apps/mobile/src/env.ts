import * as Updates from "expo-updates";
import { Platform } from "react-native";

let env = {
	ENV: "development",
	R2_PUBLIC_URL: "https://cdn.recordscratch.app",
	SCHEME: "recordscratch://",
	SITE_URL: Platform.OS === "android" ? "http://recordscratch.app" : "https://recordscratch.app",
	// SITE_URL: "https://humane-cockatoo-instantly.ngrok-free.app",
	DEBUG: true,
};

if (Updates.channel === "production") {
	env.ENV = "production";
	env.SITE_URL = "https://recordscratch.app";
	env.DEBUG = false;
} else if (Updates.channel === "staging") {
	env.ENV = "staging";
	env.SITE_URL = "https://recordscratch.app"; // No staging site yet
}

export default env;
