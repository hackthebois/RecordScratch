import { getUserRating } from "@/app/_trpc/cached";
import { Rating, Resource } from "@/types/rating";
import { auth } from "@clerk/nextjs";
import { Star } from "lucide-react";
import { RatingDialog } from "../../components/RatingDialog";
import { SignInWrapper } from "../../components/SignInWrapper";
import { Button } from "../../components/ui/Button";
import { SignedIn, SignedOut } from "../AuthProvider";
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
	let userRating: Rating | null = initialUserRating;

	const { userId } = auth();

	if (!userRating && userId) {
		userRating = await getUserRating(resource, userId);
	}

	return (
		<>
			<SignedIn>
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
			</SignedIn>
			<SignedOut>
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
			</SignedOut>
		</>
	);
};
