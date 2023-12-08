import {
	getAlbum,
	getArtist,
	getCommunityReviews,
	getUserRating,
} from "@/app/_trpc/cached";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Rating, Resource } from "@/types/ratings";
import { SignedIn, SignedOut, auth } from "@clerk/nextjs";
import { Star, Text } from "lucide-react";
import { unstable_noStore } from "next/cache";
import { ReviewDialog } from "./ReviewDialog";
import { SignInWrapper } from "./SignInWrapper";
import { Button } from "./ui/Button";

const timeAgo = (date: Date): string => {
	console.log(date);
	const now = new Date();
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	let interval = Math.floor(seconds / 31536000);

	if (interval > 1) {
		return `${interval} years ago`;
	}
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
		return `${interval} months ago`;
	}
	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
		return `${interval} days ago`;
	}
	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
		return `${interval} hours ago`;
	}
	interval = Math.floor(seconds / 60);
	if (interval > 1) {
		return `${interval} minutes ago`;
	}

	return `${Math.floor(seconds)} seconds ago`;
};

const ReviewsList = async ({ resource }: { resource: Resource }) => {
	unstable_noStore();
	const reviews = await getCommunityReviews(resource);

	return (
		<>
			{reviews.length > 0 ? (
				<div className="gap-4">
					{reviews.map((review, index) => (
						<div
							key={index}
							className="flex gap-4 rounded-lg bg-card py-4 text-card-foreground shadow-sm"
						>
							<Avatar className="h-10 w-10">
								<AvatarImage src={review.user?.imageUrl} />
								<AvatarFallback />
							</Avatar>
							<div className="flex flex-1 flex-col gap-3">
								<div className="flex flex-1 justify-between">
									<div className="flex items-center gap-2">
										<p className="flex font-semibold">
											{review.user?.firstName}{" "}
											{review.user?.lastName}
										</p>
										<p className="text-sm font-medium text-muted-foreground">
											•
										</p>
										<p className="text-sm font-medium text-muted-foreground">
											{timeAgo(
												new Date(review.updatedAt)
											)}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-1">
									{Array.from(Array(review.rating)).map(
										(_, i) => (
											<Star
												key={i}
												size={18}
												color="#ffb703"
												fill="#ffb703"
											/>
										)
									)}
									{Array.from(Array(10 - review.rating)).map(
										(_, i) => (
											<Star
												key={i}
												size={18}
												color="#ffb703"
											/>
										)
									)}
								</div>
								<p className="whitespace-pre-line text-sm">
									{review.content}
								</p>
							</div>
						</div>
					))}
				</div>
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
