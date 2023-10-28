"use client";

import { trpc } from "@/app/_trpc/react";
import { Button, buttonVariants } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";
import { Resource, UserRating } from "@/types/ratings";
import { zodResolver } from "@hookform/resolvers/zod";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { create } from "zustand";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/AlertDialog";
import { Form, FormControl, FormField, FormItem } from "../ui/Form";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

export type Rate = {
	resource: Resource;
	name: string;
	initialRating: UserRating | null;
};

export type RatingDialogState = {
	open: boolean;
	resource: Resource | null;
	name: string | null;
	initialRating?: UserRating | null;
	setOpen: (open: boolean) => void;
	rate: (input: Rate) => void;
};

const initialState = {
	open: false,
	resource: null,
	name: "",
	initialRating: null,
};

export const useRatingDialog = create<RatingDialogState>((set) => ({
	...initialState,
	setOpen: (open) => {
		set({ open });
		if (!open) {
			set(initialState);
		}
	},
	rate: (input) => {
		set({
			open: true,
			...input,
		});
	},
}));

const RatingInput = ({
	value: rating,
	onChange,
}: {
	value: number | null;
	onChange: (rating: number | null) => void;
}) => {
	const [hoverRating, setHoverRating] = useState<number | null>(null);

	return (
		<div className="flex justify-between">
			{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
				<div
					key={index}
					onClick={() => onChange(index)}
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
	);
};

const RatingFormSchema = z.object({
	rating: z.number().min(1).max(10),
	title: z.string().optional(),
	description: z.string().optional(),
});
type RatingForm = z.infer<typeof RatingFormSchema>;

export const RatingDialogProvider = () => {
	const utils = trpc.useContext();
	const { open, setOpen, resource, name, initialRating } = useRatingDialog();

	const { mutate } = trpc.rating.rate.useMutation({
		onSuccess: async (_, resource) => {
			if (resource.category === "SONG") {
				utils.rating.getAllUserSongRatings.invalidate();
				utils.rating.getAllAverageSongRatings.invalidate();
			} else {
				utils.rating.getAverage.invalidate();
				utils.rating.getUserRating.invalidate();
			}
		},
	});

	const { mutate: deleteMutate } = trpc.rating.deleteUserRating.useMutation({
		onSuccess: async (_, resource) => {
			if (resource.category === "SONG") {
				utils.rating.getAllUserSongRatings.invalidate();
				utils.rating.getAllAverageSongRatings.invalidate();
			} else {
				utils.rating.getAverage.invalidate();
				utils.rating.getUserRating.invalidate();
			}
		},
	});

	const form = useForm<RatingForm>({
		resolver: zodResolver(RatingFormSchema),
	});

	useEffect(() => {
		form.reset({
			rating: initialRating?.rating,
			title: initialRating?.title ?? undefined,
			description: initialRating?.description ?? undefined,
		});
	}, [initialRating]);

	if (!resource || !name) {
		return null;
	}

	const onSubmit = async ({
		title = "",
		description = "",
		rating,
	}: RatingForm) => {
		console.log({ title, description, rating });
		mutate({
			...resource,
			description,
			rating,
			title,
		});
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="w-full sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Review "{name}"</DialogTitle>
					<DialogDescription>
						Select a rating and write a review (optional)
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="rating"
							render={({ field: { onChange, value } }) => (
								<FormItem>
									<FormControl>
										<RatingInput
											value={value}
											onChange={onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Review title"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											placeholder="Detail your thoughts..."
											{...field}
											className="h-40"
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								className="flex-[4]"
								type="submit"
								disabled={
									!(
										form.formState.isValid &&
										form.formState.isDirty
									)
								}
							>
								Review
							</Button>

							{initialRating && (
								<AlertDialog>
									<AlertDialogTrigger
										className={buttonVariants({
											variant: "destructive",
										})}
									>
										Delete
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you absolutely sure?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone.
												This will permanently delete
												your review for this resource.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>
												Cancel
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => {
													deleteMutate(resource);
													setOpen(false);
												}}
											>
												Continue
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							)}
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
