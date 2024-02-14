import { getDistribution, getProfile, getRecent } from "@/app/_api";
import {
	GetInfiniteReviews,
	InfiniteReviews,
} from "@/components/resource/InfiniteReviews";
import { QueryTabs } from "@/components/ui/LinkTabs";
import { cn } from "@/utils/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

const Page = async ({
	params: { handle },
	searchParams: { rating, category },
}: {
	params: {
		handle: string;
	};
	searchParams: {
		rating: string;
		category: string;
	};
}) => {
	const profile = await getProfile(handle);

	if (!profile) {
		notFound();
	}

	const getReviews = async (input: GetInfiniteReviews) => {
		"use server";
		return await getRecent({
			userId: profile.userId,
			rating: rating ? parseInt(rating) : undefined,
			category:
				category === "ALBUM" || category === "SONG"
					? category
					: undefined,
			...input,
		});
	};

	const [initialReviews, distribution] = await Promise.all([
		getReviews({ page: 1, limit: 20 }),
		getDistribution(profile.userId),
	]);

	let max: number = Math.max(...distribution);
	max = max === 0 ? 1 : max;

	return (
		<>
			<div className="flex max-w-lg flex-col rounded-md border p-6 pt-6">
				<div className="flex h-20 w-full items-end justify-between gap-1">
					{distribution.map((ratings, index) => (
						<Link
							href={
								Number(rating) === index + 1
									? `/${profile.handle}${
											category
												? `?category=${category}`
												: ""
									  }`
									: `/${profile.handle}?rating=${index + 1}${
											category
												? `&category=${category}`
												: ""
									  }`
							}
							className="flex h-full flex-1 flex-col-reverse"
							key={index}
						>
							<div
								style={{
									height: `${(ratings / max) * 100}%`,
								}}
								className={cn(
									"h-full min-h-0 w-full rounded-t bg-[#ffb703] hover:opacity-90",
									rating === `${index + 1}` && "bg-orange-500"
								)}
							/>
						</Link>
					))}
				</div>
				<div className="flex w-full items-end gap-1 pt-1">
					{distribution.map((_, index) => (
						<p
							key={index + 1}
							className="flex-1 text-center text-sm text-muted-foreground"
						>
							{index + 1}
						</p>
					))}
				</div>
			</div>
			<QueryTabs
				param="category"
				tabs={[
					{
						label: "All",
						value: null,
					},
					{
						label: "Album",
						value: "ALBUM",
					},
					{
						label: "Song",
						value: "SONG",
					},
				]}
			/>
			<InfiniteReviews
				id={`${profile.handle}:${rating}:${category}`}
				initialReviews={initialReviews}
				getReviews={getReviews}
				pageLimit={20}
			/>
		</>
	);
};

export default Page;
