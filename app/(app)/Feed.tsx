"use client";

import { Review } from "@/components/resource/Review";
import { Review as ReviewType } from "@/types/rating";
import { Disc3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getFeed } from "../_trpc/cached";

const Feed = ({ initialReviews }: { initialReviews: ReviewType[] }) => {
	const [reviews, setReviews] = useState<ReviewType[]>(initialReviews);
	const [page, setPage] = useState(1);
	const { ref, inView } = useInView();

	const fetchNextPage = async () => {
		const newReviews = await getFeed({ page });
		setPage(page + 1);
		setReviews([...reviews, ...newReviews]);
	};

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView]);

	return (
		<>
			{reviews.map((review, index) => (
				<Review key={index} {...review} />
			))}
			<div
				ref={ref}
				className="flex h-40 flex-1 flex-col items-center justify-center"
			>
				<Disc3 size={35} className="animate-spin" />
			</div>
		</>
	);
};

export default Feed;
