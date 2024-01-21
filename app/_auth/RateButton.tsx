import { SignInWrapper } from "@/components/SignInWrapper";
import { RateForm, Rating, Resource } from "@/types/rating";
import { auth } from "@clerk/nextjs";
import { Star } from "lucide-react";
import { unstable_noStore } from "next/cache";
import { RatingDialog } from "../../components/RatingDialog";
import { Button } from "../../components/ui/Button";

export const RateButton = async ({
	resource,
	name,
	userRating = null,
	onRate,
}: {
	resource: Resource;
	name?: string;
	userRating: Rating | null;
	onRate: (rating: RateForm) => void;
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
			onRate={onRate}
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
