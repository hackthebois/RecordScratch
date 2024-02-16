"use client";

import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/Dialog";
import { zodResolver } from "@hookform/resolvers/zod";

import { RatingInput } from "@/components/RatingInput";
import { Rating, Resource, ReviewForm, ReviewFormSchema } from "@/types/rating";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/Form";
import { Textarea } from "./ui/Textarea";

export const ReviewDialog = ({
	resource,
	initialRating,
	children,
	reviewAction,
}: {
	resource: Resource;
	initialRating?: Rating;
	children: React.ReactNode;
	reviewAction: (rating: ReviewForm) => void;
}) => {
	const [open, setOpen] = useState(false);

	const form = useForm<ReviewForm>({
		resolver: zodResolver(ReviewFormSchema),
		defaultValues: { ...resource, ...initialRating },
	});

	const onSubmit = async (review: ReviewForm) => {
		reviewAction(review);
		setOpen(false);
	};

	useEffect(() => {
		form.reset({ ...resource, ...initialRating });
	}, [initialRating]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="w-full sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl">Review</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
						<FormField
							control={form.control}
							name="rating"
							render={({ field: { onChange, value } }) => (
								<FormItem>
									<FormControl>
										<div className="flex justify-center">
											<span className="w-full max-w-[375px]">
												<RatingInput value={value} onChange={onChange} />
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
							<div className="flex w-full flex-col">
								<Button
									className="flex-[4]"
									type="submit"
									disabled={!form.formState.isValid}
								>
									Review
								</Button>
								{initialRating?.content && (
									<Button
										variant="ghost"
										className="mt-2"
										size="sm"
										onClick={(e) => {
											e.preventDefault();
											onSubmit({
												...resource,
												...initialRating,
												content: null,
											});
											setOpen(false);
										}}
									>
										Remove review
									</Button>
								)}
							</div>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
