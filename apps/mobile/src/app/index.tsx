import { useAuth } from "@/lib/auth";
import { ExternalPathString, Redirect } from "expo-router";

const IndexPage = () => {
	const status = useAuth((s) => s.status);

	if (status === "unauthenticated") {
		return <Redirect href={"/(auth)/signin" as ExternalPathString} />;
	}

	if (status === "needsonboarding") {
		return <Redirect href={"/(auth)/onboard" as ExternalPathString} />;
	}

	return <Redirect href={{ pathname: "/(tabs)/(home)" as ExternalPathString }} />;
};

export default IndexPage;
