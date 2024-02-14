"use client";

import { Review as ReviewType } from "@/types/rating";
import { Star } from "lucide-react";
import Link from "next/link";
import { RatingItem } from "../RatingItem";
import { UserAvatar } from "../UserAvatar";

export const Review = ({
	rating,
	profile,
	content,
	resourceId,
	category,
}: ReviewType) => {
	console.log("rating", rating);
	return (
		<div className="flex flex-col gap-4 py-4 text-card-foreground">
			<RatingItem resource={{ resourceId, category }} />
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
					href={`/${profile.handle}`}
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
