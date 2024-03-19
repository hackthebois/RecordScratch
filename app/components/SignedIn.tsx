import { api } from "@/trpc/react";

const SignedIn = ({ children }: { children: React.ReactNode }) => {
	const [profile] = api.profiles.me.useSuspenseQuery();

	if (!profile) {
		return null;
	}

	return <>{children}</>;
};

export default SignedIn;
