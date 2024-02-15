import { getUserRating } from "@/recordscratch/app/_api";
import { ReviewDialog } from "@/recordscratch/components/ReviewDialog";
import { SignInWrapper } from "@/recordscratch/components/SignInWrapper";
import { Button } from "@/recordscratch/components/ui/Button";
import { Resource } from "@/recordscratch/types/rating";
import { auth } from "@clerk/nextjs";
import { Text } from "lucide-react";
import { reviewAction } from "../_api/actions";

export const ReviewButton = async ({ resource }: { resource: Resource }) => {
	const { userId } = auth();

	if (!userId) {
		return (
			<SignInWrapper>
				<Button variant="outline" className="gap-2 self-end">
					<Text size={18} color="#fb8500" />
					Review
				</Button>
			</SignInWrapper>
		);
	}

	const userRating = await getUserRating(resource, userId);

	return (
		<ReviewDialog
			resource={resource}
			initialRating={userRating ?? undefined}
			reviewAction={reviewAction}
		>
			<Button variant="outline" className="gap-2 self-end">
				<Text size={18} color="#fb8500" />
				Review
			</Button>
		</ReviewDialog>
	);
};

export default ReviewButton;
