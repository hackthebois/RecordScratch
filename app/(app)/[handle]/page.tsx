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

	const distribution = await getDistribution(profile.userId);
	const max = Math.max(...distribution);

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

	return (
		<>
			<div className="flex max-w-lg flex-col rounded-md border p-6 pt-8">
				<div className="flex h-20 w-full items-end justify-between gap-1">
					{distribution.map((ratings, index) => (
						<div
							style={{
								height: `${(ratings / max) * 100}%`,
							}}
							className="flex flex-1"
							key={index}
						>
							<Link
								href={
									Number(rating) === index + 1
										? `/${profile.handle}${
												category
													? `?category=${category}`
													: ""
										  }`
										: `/${profile.handle}?rating=${
												index + 1
										  }${
												category
													? `&category=${category}`
													: ""
										  }`
								}
								className={cn(
									"h-full min-h-0 w-full rounded-t bg-[#ffb703] hover:opacity-90",
									rating === `${index + 1}` && "bg-orange-500"
								)}
								prefetch={false}
							/>
						</div>
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
				key={`${profile.handle}:${rating}:${category}`}
				initialReviews={await getReviews({ page: 1, limit: 25 })}
				getReviews={getReviews}
				pageLimit={25}
			/>
		</>
	);
};

export default Page;
