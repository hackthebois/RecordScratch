import { api } from "@/trpc/react";
import { RouterInputs } from "@/trpc/shared";
import { Disc3 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Review } from "../review/Review";

export const InfiniteProfileReviews = ({
	input,
}: {
	input: RouterInputs["ratings"]["user"]["recent"];
}) => {
	const { ref, inView } = useInView();

	const { data, fetchNextPage, hasNextPage } =
		api.ratings.user.recent.useInfiniteQuery(
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

	const reviews = data?.pages.flatMap((page) => page.items);

	return (
		<>
			<div className="flex flex-col gap-3 pt-3">
				{reviews?.map((review, index) => (
					<Review key={index} {...review} />
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
