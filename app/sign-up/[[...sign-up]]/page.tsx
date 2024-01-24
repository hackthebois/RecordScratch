import AuthProvider from "@/app/AuthProvider";
import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

const Page = () => {
	return (
		<div className="flex h-[100svh] w-full items-center justify-center">
			<Suspense>
				<AuthProvider>
					<SignUp />
				</AuthProvider>
			</Suspense>
		</div>
	);
};

export default Page;
