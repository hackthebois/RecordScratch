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

import { api } from "@/trpc/react";
import { RateForm, RateFormSchema, Rating, Resource } from "@/types/rating";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/Form";
import { Skeleton } from "../ui/Skeleton";
import { RatingInput } from "./RatingInput";

export const RatingDialog = ({
	initialUserRating,
	resource,
	name,
	userId,
}: {
	initialUserRating?: Rating | null;
	resource: Resource;
	name?: string;
	userId: string;
}) => {
	const utils = api.useUtils();
	const { data: userRating, isLoading } = api.ratings.user.get.useQuery(
		{ resource, userId },
		{
			staleTime: Infinity,
			initialData: initialUserRating,
		}
	);
	const { mutate: rateMutation } = api.ratings.rate.useMutation({
		onSettled: () => {
			utils.ratings.user.get.invalidate({ resource, userId });
			utils.ratings.get.invalidate(resource);
		},
	});

	const [open, setOpen] = useState(false);

	const form = useForm<RateForm>({
		resolver: zodResolver(RateFormSchema),
		defaultValues: { ...resource, ...userRating },
	});

	const onSubmit = async (rate: RateForm) => {
		rateMutation(rate);
		setOpen(false);
	};

	const clearRating = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		if (!userRating) return;
		rateMutation({
			...resource,
			rating: null,
		});
		setOpen(false);
	};

	useEffect(() => {
		form.reset({ ...resource, ...userRating });
	}, [userRating, form, resource]);

	if (isLoading) {
		return <Skeleton className="h-12 w-20" />;
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<Star
						color="#fb8500"
						fill={userRating ? "#fb8500" : "none"}
						size={18}
						className="mr-2"
					/>
					{userRating ? userRating.rating : "Rate"}
				</Button>
			</DialogTrigger>
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
								{userRating &&
									(userRating.content ? (
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
