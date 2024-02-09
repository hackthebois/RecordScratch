import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/ScrollArea";

type Props = {};

const now = [
	{
		title: "Create the app",
		description: "Create the app with Next.js, TailwindCSS, and TypeScript",
	},
	{
		title: "Create the app",
		description: "Create the app with Next.js, TailwindCSS, and TypeScript",
	},
	{
		title: "Create the app",
		description: "Create the app with Next.js, TailwindCSS, and TypeScript",
	},
	{
		title: "Create the app",
		description: "Create the app with Next.js, TailwindCSS, and TypeScript",
	},
	{
		title: "Create the app",
		description: "Create the app with Next.js, TailwindCSS, and TypeScript",
	},
	{
		title: "Create the app",
		description: "Create the app with Next.js, TailwindCSS, and TypeScript",
	},
	{
		title: "Create the app",
		description: "Create the app with Next.js, TailwindCSS, and TypeScript",
	},
	{
		title: "Create the app",
		description: "Create the app with Next.js, TailwindCSS, and TypeScript",
	},
	{
		title: "Create the app",
		description: "Create the app with Next.js, TailwindCSS, and TypeScript",
	},
	{
		title: "Create the app",
		description: "Create the app with Next.js, TailwindCSS, and TypeScript",
	},
	{
		title: "Create the app",
		description: "Create the app with Next.js, TailwindCSS, and TypeScript",
	},
	{
		title: "Create the app",
		description: "Create the app with Next.js, TailwindCSS, and TypeScript",
	},
	{
		title: "Create the app",
		description: "Create the app with Next.js, TailwindCSS, and TypeScript",
	},
	{
		title: "Create the app",
		description: "Create the app with Next.js, TailwindCSS, and TypeScript",
	},
	{
		title: "Create the app",
		description: "Create the app with Next.js, TailwindCSS, and TypeScript",
	},
	{
		title: "Create the app",
		description: "Create the app with Next.js, TailwindCSS, and TypeScript",
	},
];

const Page = () => {
	return (
		<div className="flex h-[calc(100svh-56px-32px)] flex-1 flex-col gap-4 overflow-hidden sm:h-[calc(100svh-56px-48px)]">
			<h1>Roadmap</h1>
			<div className="flex h-full min-h-0 w-[400px] flex-col gap-4 rounded-xl border p-4">
				<h3>Now</h3>
				<ScrollArea className="h-full min-h-0">
					<div className="flex flex-col gap-2 pr-4">
						{now.map((item, index) => (
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
				</ScrollArea>
			</div>
		</div>
	);
};

export default Page;
