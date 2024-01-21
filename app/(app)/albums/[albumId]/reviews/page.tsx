import { getAlbum, getCommunityReviews } from "@/app/_api/cached";
import { ReviewButton } from "@/app/_auth/ReviewButton";
import {
	GetInfiniteReviews,
	InfiniteReviews,
} from "@/components/resource/InfiniteReviews";
import { Resource } from "@/types/rating";
import { Suspense } from "react";

const Page = async ({
	params: { albumId },
}: {
	params: {
		albumId: string;
	};
}) => {
	const album = await getAlbum(albumId);
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

	return (
		<div className="flex w-full flex-col gap-4">
			<div className="flex w-full gap-2">
				<Suspense>
					<ReviewButton resource={resource} name={album.name} />
				</Suspense>
			</div>
			<InfiniteReviews
				initialReviews={await getReviews({ page: 1, limit: 10 })}
				getReviews={getReviews}
				pageLimit={10}
			/>
		</div>
	);
};

export default Page;
