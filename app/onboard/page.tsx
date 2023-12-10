import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Onboarding } from "./Onboarding";

const Page = () => {
	const { sessionClaims } = auth();

	if (sessionClaims?.onboarded) {
		redirect("/");
	}

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-4">
			<Onboarding />
		</div>
	);
};

export default Page;
