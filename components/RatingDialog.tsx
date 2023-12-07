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
import { Rate, RateSchema, Rating, Resource } from "@/types/rating";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RatingInput } from "./RatingInput";
import { Form, FormControl, FormField, FormItem } from "./ui/Form";

export const RatingDialog = ({
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

	const form = useForm<Rate>({
		resolver: zodResolver(RateSchema),
		defaultValues: initialRating,
	});

	const onSubmit = async (rate: Rate) => {
		rateAction(rate);
		setOpen(false);
	};

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
