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
import { zodResolver } from "@hookform/resolvers/zod";

import { reviewAction } from "@/app/actions";
import { RatingInput } from "@/components/RatingInput";
import { Rating, Resource, Review, ReviewSchema } from "@/types/ratings";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/Form";
import { Textarea } from "./ui/Textarea";

export const ReviewDialog = ({
	resource,
	initialRating,
	children,
	name,
}: {
	resource: Resource;
	name?: string;
	initialRating?: Rating;
	children: React.ReactNode;
}) => {
	const [open, setOpen] = useState(false);

	const form = useForm<Review>({
		resolver: zodResolver(ReviewSchema),
		defaultValues: initialRating,
	});

	const onSubmit = async (review: Review) => {
		reviewAction(review);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="w-full sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl">
						{name ?? "Review"}
					</DialogTitle>
					<DialogDescription className="text-center">
						{resource.category === "ALBUM"
							? "Review this album"
							: resource.category === "ARTIST"
							? "Review this artist"
							: "Review this song"}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<FormField
							control={form.control}
							name="rating"
							render={({ field: { onChange, value } }) => (
								<FormItem>
									<FormControl>
										<div className="flex justify-center">
											<span className="w-[375px] max-w-[375px]">
												<RatingInput
													value={value}
													onChange={onChange}
												/>
											</span>
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="content"
							render={({ field: { value, ...rest } }) => (
								<FormItem>
									<FormControl>
										<Textarea
											{...rest}
											placeholder="Write your thoughts!"
											value={value ?? undefined}
											className="min-h-[300px]"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								className="flex-[4]"
								type="submit"
								disabled={!form.formState.isValid}
							>
								Review
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
