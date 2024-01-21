import { getUserRating } from "@/app/_trpc/cached";
import { SignInWrapper } from "@/components/SignInWrapper";
import { Rating, Resource } from "@/types/rating";
import { auth } from "@clerk/nextjs";
import { Star } from "lucide-react";
import { unstable_noStore } from "next/cache";
import { RatingDialog } from "../../components/RatingDialog";
import { Button } from "../../components/ui/Button";
import { deleteRatingAction, rateAction } from "../actions";

export const RateButton = async ({
	resource,
	name,
	initialUserRating = null,
}: {
	resource: Resource;
	name?: string;
	initialUserRating?: Rating | null;
}) => {
	unstable_noStore();
	let userRating: Rating | null = initialUserRating;

	const { userId } = auth();

	if (!userId) {
		return (
			<SignInWrapper>
				<Button variant="outline" size="sm">
					<Star
						color="#fb8500"
						fill="none"
						size={18}
						className="mr-2"
					/>
					Rate
				</Button>
			</SignInWrapper>
		);
	}

	if (!userRating && userId) {
		userRating = await getUserRating(resource);
	}

	return (
		<RatingDialog
			resource={resource}
			initialRating={userRating ?? undefined}
			name={name}
			rateAction={rateAction}
			deleteRatingAction={deleteRatingAction}
		>
			<Button variant="outline" size="sm">
				<Star
					color="#fb8500"
					fill={userRating ? "#fb8500" : "none"}
					size={18}
					className="mr-2"
				/>
				{userRating?.rating ? userRating?.rating : "Rate"}
			</Button>
		</RatingDialog>
	);
};
