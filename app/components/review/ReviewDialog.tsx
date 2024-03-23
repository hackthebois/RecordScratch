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

import { api } from "@/trpc/react";
import { Resource, ReviewForm, ReviewFormSchema } from "@/types/rating";
import { Text } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RatingInput } from "../rating/RatingInput";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../ui/Form";
import { Textarea } from "../ui/Textarea";

export const ReviewDialog = ({
	resource,
	name,
	userId,
}: {
	resource: Resource;
	name: string;
	userId: string;
}) => {
	const utils = api.useUtils();
	const [open, setOpen] = useState(false);
	const [userRating] = api.ratings.user.get.useSuspenseQuery({
		resourceId: resource.resourceId,
		userId,
	});
	const { mutate: reviewMutation } = api.ratings.review.useMutation({
		onSettled: () => {
			utils.ratings.feed.community.invalidate({ resource });
			utils.ratings.user.get.invalidate({
				resourceId: resource.resourceId,
				userId,
			});
			utils.ratings.get.invalidate(resource);
		},
	});

	const form = useForm<ReviewForm>({
		resolver: zodResolver(ReviewFormSchema),
		defaultValues: { ...resource, ...userRating },
	});

	const onSubmit = async (review: ReviewForm) => {
		reviewMutation(review);
		setOpen(false);
	};

	useEffect(() => {
		form.reset({ ...resource, ...userRating });
	}, [userRating]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="gap-2 self-end">
					<Text size={18} color="#fb8500" />
					Review
				</Button>
			</DialogTrigger>
			<DialogContent className="w-full sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl">
						{name}
					</DialogTitle>
					<DialogDescription className="text-center">
						{resource.category === "ALBUM"
							? "Review this album"
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
											<span className="w-full max-w-[375px]">
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
							<div className="flex w-full flex-col">
								<Button
									className="flex-[4]"
									type="submit"
									disabled={!form.formState.isValid}
								>
									Review
								</Button>
								{userRating?.content && (
									<Button
										variant="ghost"
										className="mt-2"
										size="sm"
										onClick={(e) => {
											e.preventDefault();
											onSubmit({
												...resource,
												...userRating,
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
