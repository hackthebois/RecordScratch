import { createLazyFileRoute } from "@tanstack/react-router";

const PrivacyPolicy = () => {
	return (
		<div className="flex flex-col gap-6">
			<h1>Privacy Policy</h1>
			<p>TODO</p>
		</div>
	);
};

export const Route = createLazyFileRoute("/_app/privacy-policy")({
	component: PrivacyPolicy,
});
