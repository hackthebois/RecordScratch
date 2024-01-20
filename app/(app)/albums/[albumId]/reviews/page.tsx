import {
	getAlbum,
	getCommunityReviews,
	getUserRating,
} from "@/app/_trpc/cached";
import { ReviewDialog } from "@/components/ReviewDialog";
import { SignInWrapper } from "@/components/SignInWrapper";
import {
	GetInfiniteReviews,
	InfiniteReviews,
} from "@/components/resource/InfiniteReviews";
import { Button } from "@/components/ui/Button";
import { Rating, Resource } from "@/types/rating";
import { SignedIn, SignedOut, auth } from "@clerk/nextjs";
import { Text } from "lucide-react";

const Page = async ({
	params: { albumId },
}: {
	params: {
		albumId: string;
	};
}) => {
	const album = await getAlbum(albumId);
	const resource: Resource = {
		category: "ALBUM",
		resourceId: albumId,
	};

	let userRating: Rating | null = null;
	const { userId } = await auth();
	if (userId) {
		userRating = await getUserRating(resource, userId);
	}

	const getReviews = async (input: GetInfiniteReviews) => {
		"use server";
		console.log(input);
		return await getCommunityReviews({
			...input,
			resource,
		});
	};

	return (
		<div className="flex w-full flex-col gap-4">
			<div className="flex w-full gap-2">
				<SignedIn>
					<ReviewDialog
						resource={resource}
						initialRating={userRating ?? undefined}
						name={album.name}
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
				initialReviews={await getReviews({ page: 1, limit: 10 })}
				getReviews={getReviews}
				pageLimit={10}
			/>
		</div>
	);
};

export default Page;
