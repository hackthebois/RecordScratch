"use client";

import { Review as ReviewType } from "@/types/rating";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Disc3 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Review } from "./Review";

export type GetInfiniteReviews = {
	page: number;
	limit: number;
};

export const InfiniteReviews = ({
	initialReviews,
	getReviews,
	pageLimit,
	id,
}: {
	initialReviews: ReviewType[];
	getReviews: (i: GetInfiniteReviews) => Promise<ReviewType[]>;
	pageLimit: number;
	id: string;
}) => {
	const { ref, inView } = useInView();

	const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
		queryKey: [`infinite-reviews`, pageLimit, id],
		queryFn: async ({ pageParam }) =>
			getReviews({
				page: pageParam,
				limit: pageLimit,
			}),
		initialPageParam: 1,
		initialData: {
			pages: [initialReviews],
			pageParams: [1],
		},
		getNextPageParam: (lastPage, _, lastPageParam) => {
			if (lastPage.length < pageLimit) {
				return null;
			}
			return lastPageParam + 1;
		},
	});

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView]);

	return (
		<>
			<div>
				{data?.pages.map((page, index) => (
					<div key={index}>
						{page.map((review, index) => (
							<Review key={index} {...review} />
						))}
					</div>
				))}
			</div>
			{hasNextPage && initialReviews.length > 0 && (
				<div ref={ref} className="flex h-40 flex-1 flex-col items-center justify-center">
					<Disc3 size={35} className="animate-spin" />
				</div>
			)}
		</>
	);
};
