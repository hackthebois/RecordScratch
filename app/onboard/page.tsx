import { auth } from "@clerk/nextjs";
import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";
import { createProfile } from "../_api/actions";
import { Onboarding } from "./Onboarding";

const Page = () => {
	unstable_noStore();
	const { sessionClaims } = auth();

	if (sessionClaims?.onboarded) {
		redirect("/");
	}

	return (
		<div className="flex h-[100svh] w-full flex-col items-center justify-center gap-4">
			<Onboarding createProfile={createProfile} />
		</div>
	);
};

export default Page;
