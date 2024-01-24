"use client";

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
} from "@/components/ui/AlertDialog";
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
import { zodResolver } from "@hookform/resolvers/zod";

import { RateForm, RateFormSchema, Rating, Resource } from "@/types/rating";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RatingInput } from "./RatingInput";
import { Form, FormControl, FormField, FormItem } from "./ui/Form";

export const RatingDialog = ({
	resource,
	initialRating,
	children,
	name,
	onRate,
}: {
	resource: Resource;
	name?: string;
	initialRating?: Rating;
	children: React.ReactNode;
	onRate: (rate: RateForm) => void;
}) => {
	const [open, setOpen] = useState(false);

	const form = useForm<RateForm>({
		resolver: zodResolver(RateFormSchema),
		defaultValues: { ...resource, ...initialRating },
	});

	const onSubmit = async (rate: RateForm) => {
		if (onRate) onRate(rate);
		setOpen(false);
	};

	const clearRating = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		if (!initialRating) return;
		onRate({
			...resource,
			rating: null,
		});
		setOpen(false);
	};

	useEffect(() => {
		form.reset({ ...resource, ...initialRating });
	}, [initialRating]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="w-full sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl">
						{name ?? "Rate"}
					</DialogTitle>
					<DialogDescription className="text-center">
						{resource.category === "ALBUM"
							? "Rate this album"
							: resource.category === "ARTIST"
							? "Rate this artist"
							: "Rate this song"}
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
						<DialogFooter>
							<div className="flex w-full flex-col">
								<Button
									className="flex-[4]"
									type="submit"
									disabled={!form.formState.isValid}
								>
									Rate
								</Button>
								{initialRating &&
									(initialRating.content ? (
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													variant="ghost"
													className="mt-2"
													size="sm"
												>
													Remove rating
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Remove your review?
													</AlertDialogTitle>
													<AlertDialogDescription>
														This action will remove
														your current review
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>
														Cancel
													</AlertDialogCancel>
													<AlertDialogAction
														onClick={clearRating}
													>
														Continue
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									) : (
										<Button
											variant="ghost"
											className="mt-2"
											size="sm"
											onClick={clearRating}
										>
											Remove rating
										</Button>
									))}
							</div>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
