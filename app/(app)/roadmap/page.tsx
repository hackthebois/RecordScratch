import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";

type RoadmapItem = {
	title: string;
	description: string;
};

const now: RoadmapItem[] = [
	{
		title: "Following",
		description:
			"Follow your friends and see their recent activity. View your followers and following lists.",
	},
];

const planned: RoadmapItem[] = [
	{
		title: "Lists",
		description: "Create lists of songs, albums and artists.",
	},
	{
		title: "Recommendations",
		description:
			"Based on your ratings, we'll recommend new music and personalized reviews.",
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

const Page = () => {
	return (
		<div className="flex h-[calc(100svh-56px-32px)] flex-1 flex-col gap-8 overflow-hidden sm:h-[calc(100svh-56px-48px)]">
			<h1>Roadmap</h1>
			<div className="flex h-full min-h-0 gap-4 overflow-x-auto pb-2">
				<RoadmapSection name="Planned" items={planned} />
				<RoadmapSection name="Now" items={now} />
				<RoadmapSection name="Released" items={released} />
			</div>
		</div>
	);
};

export default Page;
