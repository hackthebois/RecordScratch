import HandleForm from "./HandleForm";

const Page = () => {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-4">
			<h1>Create Handle</h1>
			<p className="text-muted-foreground">
				To complete the sign up you must create a handle
			</p>
			<HandleForm />
		</div>
	);
};

export default Page;
