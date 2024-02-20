import { Review as ReviewType } from "@/types/rating";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { RatingItem } from "./RatingItem";
import { UserAvatar } from "./UserAvatar";

export const Review = ({
	parentId,
	rating,
	profile,
	content,
	resourceId,
	category,
}: ReviewType) => {
	return (
		<div className="flex flex-col gap-4 py-4 text-card-foreground">
			<RatingItem resource={{ parentId, resourceId, category }} showType />
			<div className="flex flex-1 flex-col gap-3">
				<div className="flex items-center gap-1">
					{Array.from(Array(rating)).map((_, i) => (
						<Star key={i} size={18} color="#ffb703" fill="#ffb703" />
					))}
					{Array.from(Array(10 - rating)).map((_, i) => (
						<Star key={i} size={18} color="#ffb703" />
					))}
				</div>
				<Link
					to="/$handle"
					params={{
						handle: String(profile.handle),
					}}
					className="flex items-center gap-2"
				>
					<UserAvatar {...profile} size={30} />
					<p className="flex">{profile.name}</p>
				</Link>
				<p className="whitespace-pre-line text-sm">{content}</p>
			</div>
		</div>
	);
};
