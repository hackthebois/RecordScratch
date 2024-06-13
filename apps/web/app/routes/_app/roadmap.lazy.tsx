import { Head } from "@/components/Head";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_app/roadmap")({
	component: Roadmap,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
});

type RoadmapItem = {
	title: string;
	description: string;
};

const now: RoadmapItem[] = [
	{
		title: "Likes",
		description:
			"Drop a like on your favourite reviews to show your support for others.",
	},
	{
		title: "Notifications",
		description:
			"New integrated notifications to update you on new followers and those who have liked your reviews.",
	},
];

const planned: RoadmapItem[] = [
	{
		title: "List Reviews",
		description: "Allow for other users to rate and review your lists.",
	},

	{
		title: "Review Sharing",
		description:
			"Allow for the option to share your reviews with others outside of recordscratch.",
	},
	{
		title: "Badges",
		description:
			"New badge system that will be displayed on user profiles. These badges will detail certain accomplishments like reaching a certain amount of reviews/likes/followers and etc.",
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
		title: "Playable Music",
		description:
			"Allow for the option to play certain songs/albums on spotify and apple music directly.",
	},
];

const released: RoadmapItem[] = [
	{
		title: "Ratings and Reviews",
		description: "Rate and review songs and albums",
	},
	{
		title: "Search",
		description: "Search for songs, albums, artists, and other users.",
	},
	{
		title: "User Profiles",
		description:
			"View users' profiles, rating distributions and recent activity.",
	},
	{
		title: "Feeds",
		description:
			"View recent activity from everyone and users' you follow.",
	},
	{
		title: "Music Information",
		description:
			"View detailed information about songs, albums, and artists.",
	},
	{
		title: "Lists",
		description: "Create lists of songs, albums and artists.",
	},
	{
		title: "Following",
		description:
			"Follow your friends and see their recent activity. View your followers and following lists.",
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
		<div className="flex h-full min-h-0 w-[400px] min-w-[300px] flex-col gap-4 rounded-xl border p-4">
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
			<Head
				title="Roadmap"
				description="View the released, in progress and planned features"
			/>
			<h1 className="p-4 sm:p-6">Roadmap</h1>
			<div className="mb-4 flex h-full min-h-0 gap-4 overflow-x-auto px-4 pb-2">
				<RoadmapSection name="Planned" items={planned} />
				<RoadmapSection name="Now" items={now} />
				<RoadmapSection name="Released" items={released} />
			</div>
		</div>
	);
}
