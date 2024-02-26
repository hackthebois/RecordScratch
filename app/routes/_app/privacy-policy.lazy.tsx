import { Head } from "@/components/Head";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_app/privacy-policy")({
	component: PrivacyPolicy,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
});

function PrivacyPolicy() {
	return (
		<div className="flex flex-col gap-6">
			<Head title="Privacy Policy" />
			<h1>Privacy Policy</h1>
			<p>TODO</p>
		</div>
	);
}
