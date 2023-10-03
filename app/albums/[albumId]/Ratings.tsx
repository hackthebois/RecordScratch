"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/Dialog";
import { AlbumRatingAverage, UserAlbumRating } from "@/drizzle/db/albumFuncs";
import { SongRatingAverages, UserSongRating } from "@/drizzle/db/songFuncs";
import { SpotifyAlbum, SpotifyTrack } from "@/types/spotify";
import { cn, findSongAverage } from "@/utils/utils";

import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
	name: string;
	onChange: (rating: number) => void;
	children?: React.ReactNode;
};

const RatingDialog = ({ name, children, onChange }: Props) => {
	const [starHover, setStarHover] = useState<number | null>(null);
	const [rating, setRating] = useState<number | null>(null);
	const [open, setOpen] = useState(false);
	const { openSignIn } = useClerk();

	useEffect(() => {
		// Reset the rating when the dialog is opened
		if (open) {
			setRating(null);
			setStarHover(null);
		}
	}, [open]);

	return (
		<>
			<SignedIn>
				<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
					<DialogTrigger asChild>{children}</DialogTrigger>
					<DialogContent className="w-full sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Rate {name}</DialogTitle>
							<DialogDescription>
								Select a star amount
							</DialogDescription>
						</DialogHeader>
						<div className="flex justify-between">
							{Array.from(Array(10).keys()).map((index) => (
								<div
									key={index}
									onClick={() => setRating(index)}
									onMouseOver={() => setStarHover(index)}
									onMouseLeave={() => setStarHover(null)}
									className="flex flex-1 justify-center py-2 hover:cursor-pointer"
								>
									<Star
										color="orange"
										fill={
											starHover !== null
												? index <= starHover
													? "orange"
													: "none"
												: rating !== null
												? index <= rating
													? "orange"
													: "none"
												: "none"
										}
									/>
								</div>
							))}
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								className="w-full"
								onClick={() => {
									if (rating !== null) {
										onChange(rating + 1);
										setOpen(false);
									}
								}}
							>
								Rate
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</SignedIn>
			<SignedOut>
				<div onClick={() => openSignIn()}>{children}</div>
			</SignedOut>
		</>
	);
};

const SongRatingDialog = ({
	song,
	albumId,
	initialData,
	children,
}: {
	song: SpotifyTrack;
	albumId: string;
	initialData?: UserSongRating;
	children?: React.ReactNode;
}) => {
	const utils = trpc.useContext();
	const { mutate } = trpc.song.rateSong.useMutation({
		onSuccess: () => {
			utils.song.invalidate();
			utils.song.getAllAverageSongRatings.invalidate();
		},
	});
	const { data: userRating } = trpc.song.getUserRating.useQuery(
		{
			songId: song.id,
			albumId,
		},
		{
			initialData,
		}
	);

	return (
		<RatingDialog
			name={song.name}
			onChange={(rating) =>
				mutate({
					albumId,
					songId: song.id,
					rating,
				})
			}
		>
			{children ? (
				children
			) : (
				<Button variant="outline" size="sm">
					<Star
						color="orange"
						fill={userRating ? "orange" : "none"}
						size={18}
						className="mr-2"
					/>
					{userRating ? userRating.rating : "Rate"}
				</Button>
			)}
		</RatingDialog>
	);
};

const AlbumRatingDialog = ({
	album,
	initialData,
	children,
}: {
	album: SpotifyAlbum;
	initialData?: UserAlbumRating;
	children?: React.ReactNode;
}) => {
	const utils = trpc.useContext();
	const { mutate } = trpc.album.rateAlbum.useMutation({
		onSuccess: () => {
			utils.album.getUserRating.invalidate();
			utils.album.getAlbumAverage.invalidate();
		},
	});
	const { data: userRating } = trpc.album.getUserRating.useQuery(
		{
			albumId: album.id,
		},
		{
			initialData,
		}
	);

	return (
		<RatingDialog
			name={album.name}
			onChange={(rating) =>
				mutate({
					albumId: album.id,
					rating,
					description: "",
				})
			}
		>
			{children ? (
				children
			) : (
				<Button variant="outline" size="sm">
					<Star
						color="orange"
						fill={userRating ? "orange" : "none"}
						size={18}
						className="mr-2"
					/>
					{userRating ? userRating.rating : "Rate"}
				</Button>
			)}
		</RatingDialog>
	);
};

const AlbumRating = ({
	initialData,
	albumId,
}: {
	initialData?: AlbumRatingAverage;
	albumId: string;
}) => {
	const { data: albumRating } = trpc.album.getAlbumAverage.useQuery(
		{
			albumId: albumId,
		},
		{
			initialData,
		}
	);

	return (
		<div className="flex items-center gap-2">
			<Star
				color="orange"
				fill={albumRating?.ratingAverage ? "orange" : "none"}
				size={30}
			/>
			{albumRating?.ratingAverage ? (
				<div>
					<p className="text-lg font-semibold">
						{albumRating?.ratingAverage
							? `${albumRating.ratingAverage} / 10`
							: "No Ratings"}
					</p>
					<p className="text-xs text-muted-foreground">
						{albumRating.totalRatings}
					</p>
				</div>
			) : (
				<p>No Ratings</p>
			)}
		</div>
	);
};

const SongRating = ({
	initialData,
	albumId,
	songId,
}: {
	initialData: SongRatingAverages;
	albumId: string;
	songId: string;
}) => {
	const { data: ratings } = trpc.song.getAllAverageSongRatings.useQuery(
		{
			albumId,
		},
		{
			initialData,
		}
	);

	console.log(ratings);

	const rating = findSongAverage(ratings, songId);

	return (
		<span
			className={cn(
				"flex items-center justify-center gap-2",
				!rating && "hidden"
			)}
		>
			<Star color="orange" fill={rating ? "orange" : "none"} size={18} />
			<p>{rating ? Number(rating).toFixed(1) : "0.0"}</p>
		</span>
	);
};

export {
	AlbumRating,
	AlbumRatingDialog,
	RatingDialog,
	SongRating,
	SongRatingDialog,
};
