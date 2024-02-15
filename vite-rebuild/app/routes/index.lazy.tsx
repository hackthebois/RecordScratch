import { createLazyFileRoute } from "@tanstack/react-router";
import { api } from "app/trpc/react";

const Index = () => {
	const { data: test } = api.test.useQuery();

	return (
		<div className="p-2">
			<h3>Welcome Home!</h3>
			<p>{test}</p>
		</div>
	);
};

export const Route = createLazyFileRoute("/")({
	component: Index,
});
