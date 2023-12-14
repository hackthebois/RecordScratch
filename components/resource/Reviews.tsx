import {
	getAlbum,
	getArtist,
	getCommunityReviews,
	getUserRating,
} from "@/app/_trpc/cached";
import { Rating, Resource } from "@/types/rating";
import { SignedIn, SignedOut, auth } from "@clerk/nextjs";
import { Text } from "lucide-react";
import { unstable_noStore } from "next/cache";
import { ReviewDialog } from "../ReviewDialog";
import { SignInWrapper } from "../SignInWrapper";
import { Button } from "../ui/Button";
import { Review } from "./Review";

const ReviewsList = async ({ resource }: { resource: Resource }) => {
	unstable_noStore();
	const reviews = await getCommunityReviews(resource);

	return (
		<>
			{reviews.length > 0 ? (
				reviews.map((review, index) => (
					<Review key={index} review={review} />
				))
			) : (
				<p className="mt-10 text-center text-muted-foreground">
					No reviews yet
				</p>
			)}
		</>
	);
};

const Reviews = async ({ resource }: { resource: Resource }) => {
	let name = undefined;
	if (resource.category === "ALBUM") {
		name = (await getAlbum(resource.resourceId)).name;
	} else if (resource.category === "ARTIST") {
		name = (await getArtist(resource.resourceId)).name;
	}
	// TODO: Add song
	let userRating: Rating | null = null;
	const { userId } = await auth();
	if (userId) {
		userRating = await getUserRating(resource);
	}

	return (
		<div className="flex w-full flex-col gap-4">
			<div className="flex w-full gap-2">
				<SignedIn>
					<ReviewDialog
						resource={resource}
						initialRating={userRating ?? undefined}
						name={name}
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
			</div>
			<ReviewsList resource={resource} />
		</div>
	);
};

export default Reviews;
