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

import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
	name: string;
	albumId: string;
	children?: React.ReactNode;
};

const RatingDialog = ({ name, children, albumId }: Props) => {
	const [starHover, setStarHover] = useState<number | null>(null);
	const [rating, setRating] = useState<number | null>(null);
	const [open, setOpen] = useState(false);
	const { openSignIn } = useClerk();
	const { mutate } = trpc.rating.rateAlbum.useMutation({
		onError: (error) => {
			console.error(error.message);
		},
	});

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
										mutate({
											rating,
											albumId,
										});
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
				<button onClick={() => openSignIn()}>{children}</button>
			</SignedOut>
		</>
	);
};

export default RatingDialog;
