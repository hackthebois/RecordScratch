import * as Updates from "expo-updates";
import { Platform } from "react-native";

let env = {
	ENV: "development",
	R2_PUBLIC_URL: "https://cdn.recordscratch.app",
	SCHEME: "recordscratch://",
	SITE_URL: Platform.OS === "android" ? "http://192.168.1.100:3000" : "https://recordscratch.app",
	DEBUG: false,
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
