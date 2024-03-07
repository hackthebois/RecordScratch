import { api } from "@/trpc/react";
import { RouterInputs } from "@/trpc/shared";
import { Disc3 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Review } from "./Review";

export const RecentFeedReviews = ({
	input,
}: {
	input?: RouterInputs["ratings"]["feed"]["recent"];
}) => {
	const { ref, inView } = useInView();

	const { data, fetchNextPage, hasNextPage } =
		api.ratings.feed.recent.useInfiniteQuery(
			{
				...input,
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
			{!data && <div className="h-screen" />}
			{hasNextPage && (
				<div
					ref={ref}
					className="flex h-40 flex-1 flex-col items-center justify-center"
				>
					<Disc3 size={35} className="animate-spin" />
				</div>
			)}
		</>
	);
};

export const FollowingFeedReviews = ({
	input,
}: {
	input?: RouterInputs["ratings"]["feed"]["following"];
}) => {
	const { ref, inView } = useInView();

	const { data, fetchNextPage, hasNextPage } =
		api.ratings.feed.following.useInfiniteQuery(
			{
				...input,
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
				<div
					ref={ref}
					className="flex h-40 flex-1 flex-col items-center justify-center"
				>
					<Disc3 size={35} className="animate-spin" />
				</div>
			)}
		</>
	);
};
