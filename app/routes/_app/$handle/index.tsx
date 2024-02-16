import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$handle/")({
	component: Handle,
});

function Handle() {
	const handle = Route.useParams().handle;

	return (
		<div className="flex flex-col gap-6">
			<h1>Handle</h1>
			<p>{handle}</p>
		</div>
	);
}
