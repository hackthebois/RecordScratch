import { api } from "@/trpc/react";
import { Resource } from "@/types/rating";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Disc3 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Review } from "./Review";
import { ReviewDialog } from "./ReviewDialog";
import { SignInReviewButton } from "./SignInReviewButton";

const CommunityReviews = ({ pageLimit, resource }: { pageLimit: number; resource: Resource }) => {
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
		<div className="flex w-full flex-col gap-4">
			<div className="flex w-full gap-2">
				<SignedIn>
					<ReviewDialog resource={resource} />
				</SignedIn>
				<SignedOut>
					<SignInReviewButton />
				</SignedOut>
			</div>
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
		</div>
	);
};

export default CommunityReviews;
