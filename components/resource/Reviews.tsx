import {
	getAlbum,
	getCommunityReviews,
	getUserRating,
} from "@/app/_trpc/cached";
import { Rating, Resource } from "@/types/rating";
import { SignedIn, SignedOut, auth } from "@clerk/nextjs";
import { Text } from "lucide-react";
import { ReviewDialog } from "../ReviewDialog";
import { SignInWrapper } from "../SignInWrapper";
import { Button } from "../ui/Button";
import { InfiniteReviews } from "./InfiniteReviews";

const Reviews = async ({ resource }: { resource: Resource }) => {
	let name = undefined;
	if (resource.category === "ALBUM") {
		name = (await getAlbum(resource.resourceId)).name;
	}
	// TODO: Add song
	let userRating: Rating | null = null;
	const { userId } = await auth();
	if (userId) {
		userRating = await getUserRating(resource, userId);
	}

	const getReviews = async ({ page }: { page: number }) => {
		"use server";
		return await getCommunityReviews({
			resource,
			page,
		});
	};

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
			<InfiniteReviews
				initialReviews={await getReviews({ page: 1 })}
				getReviews={getReviews}
			/>
		</div>
	);
};

export default Reviews;
