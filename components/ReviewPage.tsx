"use client";

import { reviewAction } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/Form";
import { Textarea } from "@/components/ui/Textarea";
import { Rating, Review, ReviewSchema } from "@/types/ratings";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type Props = {
	initialRating?: Rating;
};

const ReviewInput = ({ initialRating }: Props) => {
	const { user } = useUser();
	const form = useForm<Review>({
		resolver: zodResolver(ReviewSchema),
		defaultValues: initialRating,
	});

	const onSubmit = async (review: Review) => {
		reviewAction(review);
	};

	return (
		<div className="flex gap-4 border-b pb-4">
			<Avatar className="h-10 w-10">
				<AvatarImage src={user?.imageUrl} />
				<AvatarFallback />
			</Avatar>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-1 flex-col gap-4"
				>
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
										className="border-0 focus-visible:ring-0"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* <DialogFooter>
						<Button
							className="flex-[4]"
							type="submit"
							disabled={!form.formState.isValid}
						>
							Review
						</Button>
					</DialogFooter> */}
				</form>
			</Form>
		</div>
	);
};

export default ReviewInput;
