import { api } from "@/trpc/react";
import { Resource } from "@/types/rating";
import { Disc3 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Review } from "./Review";

export const InfiniteCommunityReviews = ({
	pageLimit,
	resource,
}: {
	pageLimit: number;
	resource: Resource;
}) => {
	const { ref, inView } = useInView();

	const { data, fetchNextPage, hasNextPage } = api.ratings.feed.community.useInfiniteQuery(
		{
			limit: pageLimit,
			resource,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		}
	);

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView, fetchNextPage]);

	return (
		<>
			<div>
				{data?.pages.map((page, index) => (
					<div key={index}>
						{page.items.map((review, index) => (
							<Review key={index} {...review} />
						))}
					</div>
				))}
			</div>
			{hasNextPage && (
				<div ref={ref} className="flex h-40 flex-1 flex-col items-center justify-center">
					<Disc3 size={35} className="animate-spin" />
				</div>
			)}
		</>
	);
};
