import { SignInWrapper } from "@/components/SignInWrapper";
import { Rating, Resource } from "@/types/rating";
import { auth } from "@clerk/nextjs";
import { Star } from "lucide-react";
import { unstable_noStore } from "next/cache";
import { RatingDialog } from "../../components/RatingDialog";
import { Button } from "../../components/ui/Button";
import { rateAction } from "../_api/actions";

export const RateButton = async ({
	resource,
	name,
	userRating = null,
}: {
	resource: Resource;
	name?: string;
	userRating: Rating | null;
}) => {
	unstable_noStore();
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

	return (
		<RatingDialog
			resource={resource}
			initialRating={userRating ?? undefined}
			name={name}
			onRate={rateAction}
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
