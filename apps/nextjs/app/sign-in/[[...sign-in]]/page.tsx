import { SignIn } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className="flex-1 flex justify-center items-center">
			<SignIn />
		</div>
	);
}
