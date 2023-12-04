import { serverTrpc } from "@/app/_trpc/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { Star } from "lucide-react";

const Page = async ({
	params: { albumId },
}: {
	params: {
		albumId: string;
	};
}) => {
	const reviews = await serverTrpc.resource.rating.community(albumId);

	return (
		<div className="w-full">
			{reviews.length > 0 ? (
				reviews.map((review, index) => (
					<Card className="w-full" key={index}>
						<CardHeader className="gap-3">
							{review.title && (
								<CardTitle>{review.title}</CardTitle>
							)}
							<div className="flex gap-1">
								{Array.from(Array(review.rating)).map(
									(_, i) => (
										<Star
											key={i}
											size={20}
											color="#ffb703"
											fill="#ffb703"
										/>
									)
								)}
							</div>
						</CardHeader>
						{review.description && (
							<CardContent>{review.description}</CardContent>
						)}
						<CardFooter className="gap-3">
							<Avatar className="h-8 w-8">
								<AvatarImage src={review.user.imageUrl} />
								<AvatarFallback />
							</Avatar>
							<p>
								{review.user.firstName} {review.user.lastName}
							</p>
						</CardFooter>
					</Card>
				))
			) : (
				<p>No reviews yet</p>
			)}
		</div>
	);
};

export default Page;
