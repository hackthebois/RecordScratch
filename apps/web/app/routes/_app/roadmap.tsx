import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/roadmap")({
	component: Roadmap,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
	meta: () => [{ title: "Roadmap" }],
});

type RoadmapItem = {
	title: string;
	description: string;
};

const consideration: RoadmapItem[] = [
	{
		title: "Uploading and playing music",
		description:
			"Allow artists to upload their music and users to play it directly on the site.",
	},
];

const planned: RoadmapItem[] = [
	{
		title: "Sharing",
		description:
			"Allow for the option to share your reviews, lists and more",
	},
	{
		title: "Badges",
		description:
			"Profile badges to show off user achievements and activity.",
	},
	{
		title: "Polls and Mini Games",
		description:
			"We plan on adding user polling and interactive mini games that users can engage in",
	},
	{
		title: "Recommendations",
		description:
			"Based on your ratings, we'll recommend new music and personalized reviews.",
	},
	{
		title: "Progression",
		description:
			"Track your progress within albums and artists, and see how you compare to others.",
	},
];

const now: RoadmapItem[] = [
	{
		title: "Mobile App",
		description:
			"Our primary focus right now is developing a mobile app for RecordScratch",
	},
];

const RoadmapSection = ({
	name,
	items,
}: {
	name: string;
	items: RoadmapItem[];
}) => {
	return (
		<div className="flex h-full min-h-0 w-full flex-col gap-4 rounded-xl border p-4">
			<h3>{name}</h3>
			<div className="flex flex-col gap-2 overflow-y-auto pr-2">
				{items.map((item, index) => (
					<Card
						key={index}
						className="flex flex-col gap-2 transition-colors hover:bg-secondary"
					>
						<CardHeader>
							<CardTitle>{item.title}</CardTitle>
							<CardDescription>
								{item.description}
							</CardDescription>
						</CardHeader>
					</Card>
				))}
			</div>
		</div>
	);
};

function Roadmap() {
	return (
		<div className="-m-4 flex h-[calc(100svh-56px)] flex-1 flex-col overflow-hidden sm:-m-6">
			<h1 className="p-4 sm:p-6">Roadmap</h1>
			<div className="mb-4 flex h-full min-h-0 gap-4 overflow-x-auto px-4 pb-2">
				<RoadmapSection
					name="Under Consideration"
					items={consideration}
				/>
				<RoadmapSection name="Planned" items={planned} />
				<RoadmapSection name="Current" items={now} />
			</div>
		</div>
	);
}
