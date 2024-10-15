import { useRouteContext } from "@tanstack/react-router";

const SignedIn = ({ children }: { children: React.ReactNode }) => {
	const { profile } = useRouteContext({
		from: "__root__",
	});

	if (!profile) {
		return null;
	}

	return <>{children}</>;
};

export default SignedIn;
