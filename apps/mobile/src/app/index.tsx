import { useAuth } from "@/lib/auth";
import { Redirect } from "expo-router";

const IndexPage = () => {
	const status = useAuth((s) => s.status);

	if (status === "unauthenticated") {
		return <Redirect href="/(auth)/signin" />;
	}

	if (status === "needsonboarding") {
		return <Redirect href="/(auth)/onboard" />;
	}

	return <Redirect href={{ pathname: "/(tabs)/(home)" }} />;
};

export default IndexPage;
