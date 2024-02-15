"use client";

import { SignInWrapper } from "@/recordscratch/components/SignInWrapper";
import { Rating, Resource } from "@/recordscratch/types/rating";
import { useAuth } from "@clerk/nextjs";
import { Star } from "lucide-react";
import { RatingDialog } from "../../components/RatingDialog";
import { Button } from "../../components/ui/Button";
import { rateAction } from "../_api/actions";

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
		/>
	);
};

export default RateButton;
