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
import { Rating, UserRating } from "@/drizzle/db/schema";
import { Ratings, Resource } from "@/types/ratings";

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

RatingDialog.Button = ({
	userRating,
	onChange,
}: {
	userRating: UserRating | null;
	onChange: (rating: number) => void;
}) => {
	return (
		<RatingDialog name="Album" onChange={onChange}>
			<Button variant="outline" size="sm">
				<Star
					color="orange"
					fill={userRating ? "orange" : "none"}
					size={18}
					className="mr-2"
				/>
				{userRating?.rating ? userRating.rating : "Rate"}
			</Button>
		</RatingDialog>
	);
};

const RatingProvider = ({
	resource,
	children,
	initialRatings,
}: {
	resource: Resource;
	initialRatings?: Ratings;
	children: ({
		rating,
		userRating,
		onChange,
	}: {
		userRating: UserRating | null;
		rating: Rating | null;
		onChange: (rating: number) => void;
	}) => JSX.Element;
}) => {
	const utils = trpc.useContext();
	const { data: userRating = null } = trpc.rating.getUserRating.useQuery(
		resource,
		{
			initialData: initialRatings?.userRating,
		}
	);

	const { data: rating = null } = trpc.rating.getAverage.useQuery(resource, {
		initialData: initialRatings?.rating,
	});

	const { mutate } = trpc.rating.rate.useMutation({
		onSuccess: () => {
			utils.rating.getAverage.invalidate(resource);
			utils.rating.getUserRating.invalidate(resource);
		},
	});

	const onChange = (rating: number) => {
		mutate({
			...resource,
			rating,
			description: "",
		});
	};

	console.log({ userRating, rating });

	return children({
		userRating,
		rating,
		onChange,
	});
};

export { RatingDialog, RatingProvider };
