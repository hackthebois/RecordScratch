import { getRating, getUserRating } from "@/recordscratch/app/_api";
import RateButton from "@/recordscratch/app/_auth/RateButton";
import { Rating, Resource } from "@/recordscratch/types/rating";
import { auth } from "@clerk/nextjs";
import { RatingInfo } from "./ui/RatingInfo";

export const Ratings = async ({ resource }: { resource: Resource }) => {
	const rating = await getRating(resource);

	let userRating: Rating | null = null;
	const { userId } = auth();
	if (userId) {
		userRating = await getUserRating(resource, userId);
	}

	return (
		<div className="flex items-center gap-4">
			<RatingInfo rating={rating} />
			<RateButton resource={resource} userRating={userRating} />
		</div>
	);
};
