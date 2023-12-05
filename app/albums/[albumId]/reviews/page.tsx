import {
	getAlbum,
	getCommunityReviews,
	getUserRating,
} from "@/app/_trpc/cached";
import { ReviewDialog } from "@/components/ReviewDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Rating, Resource } from "@/types/ratings";
import { UserDTO, UserDTOSchema } from "@/types/users";
import { auth } from "@clerk/nextjs";
import { Star } from "lucide-react";

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

const Review = ({
	review,
}: {
	review: Rating & {
		user?: UserDTO;
	};
}) => {
	return (
		<div className="flex gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
			<Avatar className="h-8 w-8">
				<AvatarImage src={review.user?.imageUrl} />
				<AvatarFallback />
			</Avatar>
			<div className="flex flex-1 flex-col gap-4">
				<div className="flex flex-1 justify-between">
					<div className="flex items-center gap-2">
						<p className="flex text-lg font-bold">
							{review.user?.firstName} {review.user?.lastName}
						</p>
						<p className="text-sm font-medium text-muted-foreground">
							•
						</p>
						<p className="text-sm font-medium text-muted-foreground">
							{timeAgo(new Date(review.updatedAt))}
						</p>
					</div>
					<div className="flex gap-1">
						{Array.from(Array(review.rating)).map((_, i) => (
							<Star
								key={i}
								size={18}
								color="#ffb703"
								fill="#ffb703"
							/>
						))}
					</div>
				</div>
				<p className="whitespace-pre-line">{review.content}</p>
			</div>
		</div>
	);
};

const Page = async ({
	params: { albumId },
}: {
	params: {
		albumId: string;
	};
}) => {
	const resource: Resource = {
		resourceId: albumId,
		category: "ALBUM",
	};
	const userRating = await getUserRating(resource);
	const reviews = await getCommunityReviews(resource);
	const album = await getAlbum(albumId);
	const me = auth();

	return (
		<div className="flex w-full flex-col gap-4">
			<ReviewDialog
				resource={resource}
				initialRating={userRating ?? undefined}
				name={album.name}
			>
				<Button variant="outline" className="self-end">
					Review
				</Button>
			</ReviewDialog>
			{userRating && userRating.content && me.user && (
				<Review
					review={{
						user: UserDTOSchema.parse(me.user),
						...userRating,
					}}
				/>
			)}
			{reviews.length > 0 ? (
				reviews.map((review, index) => (
					<Review key={index} review={review} />
				))
			) : (
				<p>No reviews yet</p>
			)}
		</div>
	);
};

export default Page;
