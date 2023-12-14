import { Profile } from "@/types/profile";
import { Rating } from "@/types/rating";
import { timeAgo } from "@/utils/date";
import { Star } from "lucide-react";
import UserAvatar from "../UserAvatar";

export const Review = ({
	review,
}: {
	review: Rating & {
		profile: Profile;
	};
}) => {
	console.log(review);
	return (
		<div className="flex gap-4 bg-card py-4 text-card-foreground shadow-sm">
			<UserAvatar {...review.profile} size={40} />
			<div className="flex flex-1 flex-col gap-3">
				<div className="flex flex-1 justify-between">
					<div className="flex items-center gap-2">
						<p className="flex font-semibold">
							{review.profile.name}
						</p>
						<p className="text-sm font-medium text-muted-foreground">
							•
						</p>
						<p className="text-sm font-medium text-muted-foreground">
							{timeAgo(new Date(review.updatedAt))}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-1">
					{Array.from(Array(review.rating)).map((_, i) => (
						<Star
							key={i}
							size={18}
							color="#ffb703"
							fill="#ffb703"
						/>
					))}
					{Array.from(Array(10 - review.rating)).map((_, i) => (
						<Star key={i} size={18} color="#ffb703" />
					))}
				</div>
				<p className="whitespace-pre-line text-sm">{review.content}</p>
			</div>
		</div>
	);
};
