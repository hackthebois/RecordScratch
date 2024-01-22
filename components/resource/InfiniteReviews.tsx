"use client";

import { Review } from "@/components/resource/Review";
import { Review as ReviewType } from "@/types/rating";
import { Disc3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export type GetInfiniteReviews = {
	page: number;
	limit: number;
};

export const InfiniteReviews = ({
	initialReviews,
	getReviews,
	pageLimit,
}: {
	initialReviews: ReviewType[];
	getReviews: (i: GetInfiniteReviews) => Promise<ReviewType[]>;
	pageLimit: number;
}) => {
	const [reviews, setReviews] = useState<ReviewType[]>(initialReviews);
	const [hasMore, setHasMore] = useState(pageLimit === initialReviews.length);
	const [page, setPage] = useState(2);
	const { ref, inView } = useInView();

	const fetchNextPage = async () => {
		const newReviews = await getReviews({ page, limit: pageLimit });
		setPage(page + 1);
		setReviews([...reviews, ...newReviews]);
		if (newReviews.length < pageLimit) {
			setHasMore(false);
		}
	};

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView]);

	return (
		<>
			<div>
				{reviews.map((review, index) => (
					<Review key={index} {...review} />
				))}
			</div>
			{hasMore && initialReviews.length > 0 && (
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
