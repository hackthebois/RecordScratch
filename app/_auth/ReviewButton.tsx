import { getUserRating } from "@/app/_trpc/cached";
import { ReviewDialog } from "@/components/ReviewDialog";
import { SignInWrapper } from "@/components/SignInWrapper";
import { Button } from "@/components/ui/Button";
import { Rating, Resource } from "@/types/rating";
import { auth } from "@clerk/nextjs";
import { Text } from "lucide-react";
import { SignedIn, SignedOut } from "../AuthProvider";
import { reviewAction } from "../actions";

export const ReviewButton = async ({
	resource,
	name,
}: {
	resource: Resource;
	name: string;
}) => {
	let userRating: Rating | null = null;
	const { userId } = auth();
	if (userId) {
		userRating = await getUserRating(resource, userId);
	}

	return (
		<>
			<SignedIn>
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
			</SignedIn>
			<SignedOut>
				<SignInWrapper>
					<Button variant="outline" className="gap-2 self-end">
						<Text size={18} color="#fb8500" />
						Review
					</Button>
				</SignInWrapper>
			</SignedOut>
		</>
	);
};
