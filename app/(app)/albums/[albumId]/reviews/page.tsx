import { getCommunityReviews } from "@/app/_api";
import {
	GetInfiniteReviews,
	InfiniteReviews,
} from "@/components/resource/InfiniteReviews";
import { Skeleton } from "@/components/ui/skeleton";
import { Resource } from "@/types/rating";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ReviewButton = dynamic(() => import("@/app/_auth/ReviewButton"), {
	ssr: false,
});

const Page = async ({
	params: { albumId },
}: {
	params: {
		albumId: string;
	};
}) => {
	const resource: Resource = {
		category: "ALBUM",
		resourceId: albumId,
	};

	const getReviews = async (input: GetInfiniteReviews) => {
		"use server";
		return await getCommunityReviews({
			...input,
			resource,
		});
	};

	const initialReviews = await getReviews({ page: 1, limit: 20 });
	return (
		<div className="flex w-full flex-col gap-4">
			<div className="flex w-full gap-2">
				<Suspense fallback={<Skeleton className="h-10 w-20" />}>
					<ReviewButton resource={resource} />
				</Suspense>
			</div>
			<InfiniteReviews
				id={albumId}
				initialReviews={initialReviews}
				getReviews={getReviews}
				pageLimit={20}
			/>
		</div>
	);
};

export default Page;
