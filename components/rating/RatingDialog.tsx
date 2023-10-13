"use client";

import { trpc } from "@/app/_trpc/react";
import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";
import { RatingCategory } from "@/drizzle/db/schema";
import { Resource } from "@/types/ratings";

import { Star } from "lucide-react";
import { create } from "zustand";

export type Rate = {
	resource: Resource;
	name: string;
	initialRating: number | null;
};

export type RatingDialogState = {
	open: boolean;
	resource: Resource | null;
	name: string | null;
	initialRating?: number | null;
	hoverRating: number | null;
	newRating: number | null;
	setNewRating: (rating: number | null) => void;
	setHoverRating: (rating: number | null) => void;
	setOpen: (open: boolean) => void;
	rate: (input: Rate) => void;
};

const initialState = {
	open: false,
	resource: null,
	name: "",
	initialRating: null,
	hoverRating: null,
	newRating: null,
};

export const useRatingDialog = create<RatingDialogState>((set) => ({
	...initialState,
	setOpen: (open) => {
		set({ open });
		if (!open) {
			set(initialState);
		}
	},
	setNewRating: (newRating) => {
		set({ newRating });
	},
	setHoverRating: (hoverRating) => {
		set({ hoverRating });
	},
	rate: (input) => {
		set({
			open: true,
			...input,
		});
	},
}));

export const RatingDialogProvider = () => {
	const utils = trpc.useContext();
	const {
		open,
		setOpen,
		resource,
		name,
		initialRating,
		newRating,
		hoverRating,
		setHoverRating,
		setNewRating,
	} = useRatingDialog();

	const { mutate } = trpc.rating.rate.useMutation({
		onSuccess: async (_, resource) => {
			if (resource.category === RatingCategory.SONG) {
				utils.rating.getAllUserSongRatings.invalidate();
				utils.rating.getAllAverageSongRatings.invalidate();
			} else {
				utils.rating.getAverage.invalidate();
				utils.rating.getUserRating.invalidate();
			}
		},
	});

	if (!resource || !name) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="w-full sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Rate "{name}"</DialogTitle>
					<DialogDescription>Select a star amount</DialogDescription>
				</DialogHeader>
				<div className="flex justify-between">
					{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
						<div
							key={index}
							onClick={() => setNewRating(index)}
							onMouseOver={() => setHoverRating(index)}
							onMouseLeave={() => setHoverRating(null)}
							className="flex flex-1 justify-center py-2 hover:cursor-pointer"
						>
							<Star
								color="orange"
								fill={
									hoverRating
										? index <= hoverRating
											? "orange"
											: "none"
										: newRating
										? index <= newRating
											? "orange"
											: "none"
										: initialRating
										? index <= Number(initialRating)
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
								mutate({
									...resource,
									rating: newRating,
									description: "",
								});
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
	);
};
