import { getUserRating } from "@/app/_api/cached";
import { ReviewDialog } from "@/components/ReviewDialog";
import { SignInWrapper } from "@/components/SignInWrapper";
import { Button } from "@/components/ui/Button";
import { Resource } from "@/types/rating";
import { auth } from "@clerk/nextjs";
import { Text } from "lucide-react";
import { unstable_noStore } from "next/cache";
import { reviewAction } from "../_api/actions";

export const ReviewButton = async ({
	resource,
	name,
}: {
	resource: Resource;
	name: string;
}) => {
	unstable_noStore();
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
			name={name}
			reviewAction={reviewAction}
		>
			<Button variant="outline" className="gap-2 self-end">
				<Text size={18} color="#fb8500" />
				Review
			</Button>
		</ReviewDialog>
	);
};
