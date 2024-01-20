"use client";

import { Review as ReviewType } from "@/types/rating";
import { Star } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "../UserAvatar";
import { AlbumItem } from "./album/AlbumItem";

export const Review = ({ rating, profile, album, name }: ReviewType) => {
	return (
		<div className="flex flex-col gap-4 py-4 text-card-foreground">
			<AlbumItem
				album={album}
				name={name}
				category={rating.category}
				showType
			/>
			<div className="flex flex-1 flex-col gap-3">
				<div className="flex items-center gap-1">
					{Array.from(Array(rating.rating)).map((_, i) => (
						<Star
							key={i}
							size={18}
							color="#ffb703"
							fill="#ffb703"
						/>
					))}
					{Array.from(Array(10 - rating.rating)).map((_, i) => (
						<Star key={i} size={18} color="#ffb703" />
					))}
				</div>
				<Link
					href={`/${profile.handle}`}
					className="flex items-center gap-2"
					prefetch={false}
				>
					<UserAvatar {...profile} size={30} />
					<p className="flex">{profile.name}</p>
				</Link>
				<p className="whitespace-pre-line text-sm">{rating.content}</p>
			</div>
		</div>
	);
};
