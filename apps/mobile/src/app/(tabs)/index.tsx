import { Redirect } from "expo-router";
import { useAuth } from "~/lib/auth";

const IndexPage = () => {
	const status = useAuth((s) => s.status);

	if (status === "unauthenticated") {
		return <Redirect href="(auth)/signin" />;
	}

	if (status === "needsonboarding") {
		return <Redirect href="(auth)/onboard" />;
	}

	return <Redirect href="(home)" />;
};

export default IndexPage;
