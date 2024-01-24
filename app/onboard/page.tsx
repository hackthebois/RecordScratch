import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AuthProvider from "../AuthProvider";
import { createProfile } from "../_api/actions";
import { Onboarding } from "./Onboarding";

export const dynamic = "force-dynamic";

const Page = () => {
	const { sessionClaims } = auth();

	if (sessionClaims?.onboarded) {
		redirect("/");
	}

	return (
		<div className="flex h-[100svh] w-full flex-col items-center justify-center gap-4">
			<Suspense>
				<AuthProvider>
					<Onboarding createProfile={createProfile} />
				</AuthProvider>
			</Suspense>
		</div>
	);
};

export default Page;
