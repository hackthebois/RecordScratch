import { createLazyFileRoute } from "@tanstack/react-router";

const Roadmap = () => {
	return (
		<div className="p-2">
			<h3>Roadmap</h3>
		</div>
	);
};

export const Route = createLazyFileRoute("/roadmap")({
	component: Roadmap,
});
