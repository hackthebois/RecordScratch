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

import { rateAction } from "@/app/actions";
import { Rating, Resource } from "@/types/ratings";
import { Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/Form";

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
});
type RatingForm = z.infer<typeof RatingFormSchema>;

export const RatingDialog = ({
	resource,
	initialRating,
	children,
}: {
	resource: Resource;
	initialRating?: Rating;
	children: React.ReactNode;
}) => {
	const [open, setOpen] = useState(false);

	const form = useForm<RatingForm>({
		resolver: zodResolver(RatingFormSchema),
		defaultValues: initialRating,
	});

	const onSubmit = async ({ rating }: RatingForm) => {
		rateAction({
			...resource,
			rating,
			description: "",
			title: "",
		});
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="w-full sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Rate</DialogTitle>
					<DialogDescription>Select a rating</DialogDescription>
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
							<Button
								className="flex-[4]"
								type="submit"
								disabled={!form.formState.isValid}
							>
								Rate
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
