import { getCommunityReviews } from "@/app/_trpc/cached";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Star } from "lucide-react";

const Page = async ({
	params: { albumId },
}: {
	params: {
		albumId: string;
	};
}) => {
	const reviews = await getCommunityReviews({
		resourceId: albumId,
		category: "ALBUM",
	});

	return (
		<div className="w-full">
			{reviews.length > 0 ? (
				reviews.map(({ user, rating }, index) => (
					<div
						className="flex gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
						key={index}
					>
						<Avatar className="h-8 w-8">
							<AvatarImage src={user.imageUrl} />
							<AvatarFallback />
						</Avatar>
						<div className="flex flex-1 items-center justify-between">
							<p className="font-medium">
								{user.firstName} {user.lastName}
							</p>
							<div className="flex gap-1">
								{Array.from(Array(rating)).map((_, i) => (
									<Star
										key={i}
										size={18}
										color="#ffb703"
										fill="#ffb703"
									/>
								))}
							</div>
						</div>
					</div>
				))
			) : (
				<p>No reviews yet</p>
			)}
		</div>
	);
};

export default Page;
