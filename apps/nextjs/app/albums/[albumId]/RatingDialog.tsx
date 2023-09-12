"use client";

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
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
	name: string;
	onSubmit: (rating: number) => void;
	children?: React.ReactNode;
};

const RatingDialog = ({ name, onSubmit, children }: Props) => {
	const [starHover, setStarHover] = useState<number | null>(null);
	const [starRating, setStarRating] = useState<number | null>(null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		// Reset the rating when the dialog is opened
		if (open) {
			setStarRating(null);
			setStarHover(null);
		}
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="w-full sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Rate {name}</DialogTitle>
					<DialogDescription>Select a star amount</DialogDescription>
				</DialogHeader>
				<div className="flex justify-between">
					{Array.from(Array(10).keys()).map((index) => (
						<div
							key={index}
							onClick={() => setStarRating(index)}
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
										: starRating !== null
										? index <= starRating
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
							if (starRating !== null) {
								onSubmit(starRating);
								setOpen(false);
							}
						}}
					>
						Rate
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default RatingDialog;