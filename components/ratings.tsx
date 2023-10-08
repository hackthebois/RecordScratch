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
	rating: number | null;
	onChange: (rating: number | null) => void;
	children?: React.ReactNode;
};

const RatingDialog = ({ name, children, onChange, rating }: Props) => {
	const [starHover, setStarHover] = useState<number | null>(null);
	const [newRating, setNewRating] = useState<number | null>(null);
	const [open, setOpen] = useState(false);
	const { openSignIn } = useClerk();

	useEffect(() => {
		// Reset the rating when the dialog is opened
		if (open) {
			setNewRating(null);
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
							<DialogTitle>Rate "{name}"</DialogTitle>
							<DialogDescription>
								Select a star amount
							</DialogDescription>
						</DialogHeader>
						<div className="flex justify-between">
							{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
								<div
									key={index}
									onClick={() => setNewRating(index)}
									onMouseOver={() => setStarHover(index)}
									onMouseLeave={() => setStarHover(null)}
									className="flex flex-1 justify-center py-2 hover:cursor-pointer"
								>
									<Star
										color="orange"
										fill={
											starHover
												? index <= starHover
													? "orange"
													: "none"
												: newRating
												? index <= newRating
													? "orange"
													: "none"
												: rating
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
									if (newRating !== null) {
										onChange(newRating);
										setOpen(false);
									}
								}}
								disabled={newRating === null}
							>
								Rate
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</SignedIn>
			<SignedOut>
				<div
					onClick={() =>
						openSignIn({
							redirectUrl: window.location.href,
						})
					}
				>
					{children}
				</div>
			</SignedOut>
		</>
	);
};

RatingDialog.Button = ({
	userRating,
	onChange,
	name,
}: {
	name: string;
	userRating: UserRating | null;
	onChange: (rating: number | null) => void;
}) => {
	console.log(userRating?.rating ?? null);
	return (
		<RatingDialog
			name={name}
			onChange={onChange}
			rating={userRating?.rating ?? null}
		>
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
		onChange: (rating: number | null) => void;
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

	const { mutate: invalidate } = trpc.rating.invalidateResource.useMutation();

	const { mutate } = trpc.rating.rate.useMutation({
		onSuccess: () => {
			invalidate({ ...resource });
			utils.rating.getAverage.invalidate(resource);
			utils.rating.getUserRating.invalidate(resource);
		},
	});

	const onChange = (rating: number | null) => {
		if (rating === null) {
			// TODO: Delete rating
		} else {
			mutate({
				...resource,
				rating,
				description: "",
			});
		}
	};

	return children({
		userRating,
		rating,
		onChange,
	});
};

export { RatingDialog, RatingProvider };
