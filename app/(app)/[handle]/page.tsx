import { getDistribution, getProfile, getRecent } from "@/app/_trpc/cached";
import { Review } from "@/components/resource/Review";
import { cn } from "@/utils/utils";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";

const Page = async ({
	params: { handle },
	searchParams: { rating },
}: {
	params: {
		handle: string;
	};
	searchParams: {
		rating: string;
	};
}) => {
	const profile = await getProfile(handle);

	if (!profile) {
		notFound();
	}

	unstable_noStore();

	const recent = await getRecent({
		userId: profile.userId,
		rating: rating ? parseInt(rating) : undefined,
	});

	const distribution = await getDistribution(profile.userId);
	const max = Math.max(...distribution);

	return (
		<>
			<table className="flex max-w-lg flex-col rounded-md border px-4 pb-2 pt-8">
				<thead>
					<tr className="flex h-20 w-full items-end justify-between gap-1">
						{distribution.map((ratings, index) => (
							<th
								style={{
									height: `${(ratings / max) * 100}%`,
								}}
								className="flex flex-1"
								key={index}
							>
								<Link
									href={
										Number(rating) === index + 1
											? `/${profile.handle}`
											: `/${profile.handle}?rating=${
													index + 1
											  }`
									}
									className={cn(
										"h-full min-h-0 w-full bg-[#ffb703] hover:opacity-90",
										rating === `${index + 1}` &&
											"bg-orange-500"
									)}
								/>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					<tr className="flex w-full items-end justify-between gap-1 pt-3">
						{distribution.map((_, index) => (
							<th key={index} className="flex-1">
								{index + 1}
							</th>
						))}
					</tr>
				</tbody>
			</table>
			<div className="flex w-full flex-col">
				{recent.map((recent, index) => (
					<Review
						key={index}
						review={recent}
						profile={profile}
						resource={{
							category: recent.category,
							resourceId: recent.resourceId,
						}}
					/>
				))}
			</div>
		</>
	);
};

export default Page;
