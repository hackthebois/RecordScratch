import * as Updates from "expo-updates";
import { Platform } from "react-native";

let env = {
	R2_PUBLIC_URL: "https://cdn.recordscratch.app",
	SCHEME: "recordscratch://",
	SITE_URL: Platform.OS === "android" ? "http://localhost:3000" : "http://localhost:3000",
};

if (Updates.channel === "production") {
	env.SITE_URL = "https://recordscratch.app";
} else if (Updates.channel === "staging") {
	env.SITE_URL = "https://recordscratch.app"; // No staging site yet
}

export default env;
