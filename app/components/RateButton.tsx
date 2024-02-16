import { SignInWrapper } from "@/components/SignInWrapper";
import { Rating, Resource } from "@/types/rating";
import { useAuth } from "@clerk/clerk-react";
import { Star } from "lucide-react";
import { RatingDialog } from "./RatingDialog";
import { Button } from "./ui/Button";

export const RateButton = ({
	resource,
	name,
	userRating = null,
}: {
	resource: Resource;
	name?: string;
	userRating: Rating | null;
}) => {
	const { userId } = useAuth();

	if (!userId) {
		return (
			<SignInWrapper>
				<Button variant="outline" size="sm">
					<Star color="#fb8500" fill="none" size={18} className="mr-2" />
					Rate
				</Button>
			</SignInWrapper>
		);
	}

	return <RatingDialog resource={resource} initialRating={userRating ?? undefined} name={name} />;
};

export default RateButton;
