"use client";

import { Review } from "@/app/_components/resource/Review";
import { Review as ReviewType } from "@/types/rating";
import { Disc3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export const InfiniteReviews = ({
	initialReviews,
	getReviews,
}: {
	initialReviews: ReviewType[];
	getReviews: ({ page }: { page: number }) => Promise<ReviewType[]>;
}) => {
	const [reviews, setReviews] = useState<ReviewType[]>(initialReviews);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(1);
	const { ref, inView } = useInView();

	const fetchNextPage = async () => {
		const newReviews = await getReviews({ page });
		setPage(page + 1);
		setReviews([...reviews, ...newReviews]);
		if (newReviews.length === 0) {
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
