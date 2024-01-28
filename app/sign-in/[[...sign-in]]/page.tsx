import { SignIn } from "@clerk/nextjs";

const Page = () => {
	return (
		<div className="flex h-[100svh] w-full items-center justify-center">
			<SignIn />
		</div>
	);
};

export default Page;
