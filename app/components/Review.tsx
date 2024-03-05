import { Review as ReviewType } from "@/types/rating";
import { timeAgo } from "@/utils/date";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { ResourceItem } from "./ResourceItem";
import { UserAvatar } from "./UserAvatar";

export const Review = ({
	parentId,
	rating,
	profile,
	content,
	resourceId,
	category,
	updatedAt,
}: ReviewType) => {
	return (
		<div className="flex flex-col gap-4 py-4 text-card-foreground">
			<ResourceItem
				resource={{ parentId, resourceId, category }}
				showType
			/>
			<div className="flex flex-1 flex-col gap-3">
				<div className="flex items-center gap-1">
					{Array.from(Array(rating)).map((_, i) => (
						<Star
							key={i}
							size={18}
							color="#ffb703"
							fill="#ffb703"
						/>
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
					className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
				>
					<UserAvatar {...profile} size={30} />
					<p>{profile.name}</p>
					<p className="text-left text-sm text-muted-foreground">
						@{profile.handle} • {timeAgo(updatedAt)}
					</p>
				</Link>
				<p className="whitespace-pre-line text-sm">{content}</p>
			</div>
		</div>
	);
};
