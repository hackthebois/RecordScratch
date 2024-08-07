import { zodResolver } from "@hookform/resolvers/zod";
import { RateForm, RateFormSchema, Rating, Resource } from "@recordscratch/types";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { GestureResponderEvent, TouchableOpacity, View } from "react-native";
import AlertDialog from "~/components/CoreComponents/AlertDialog";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { Star } from "~/lib/icons/Star";
import { Button } from "../ui/button";
import { RatingInput } from "./RatingInput";

const RatingDialog = ({
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
		{ resourceId: resource.resourceId, userId },
		{
			staleTime: Infinity,
			initialData: initialUserRating,
		}
	);
	const { mutate: rateMutation } = api.ratings.rate.useMutation({
		onSettled: () => {
			utils.ratings.user.get.invalidate({
				resourceId: resource.resourceId,
				userId,
			});
			utils.ratings.get.invalidate(resource);
		},
	});

	const [open, setOpen] = useState(false);

	const { control, handleSubmit, formState, reset } = useForm<RateForm>({
		resolver: zodResolver(RateFormSchema),
		defaultValues: { ...resource, ...userRating },
	});

	const onSubmit = async (rate: RateForm) => {
		rateMutation(rate);
		setOpen(false);
	};

	const clearRating = (e: GestureResponderEvent) => {
		e.preventDefault();
		if (!userRating) return;
		rateMutation({
			...resource,
			rating: null,
		});
		setOpen(false);
	};

	useEffect(() => {
		reset({ ...resource, ...userRating });
	}, [userRating, reset, resource]);

	if (isLoading) {
		return <Skeleton className="w-[80px] h-[48px]" />;
	}
	return (
		<View className="">
			<Dialog onOpenChange={setOpen} open={open}>
				<DialogTrigger asChild>
					<Button
						variant="secondary"
						onPress={() => setOpen(true)}
						className="flex-row gap-2"
					>
						{!userRating ? (
							<>
								<Star size={25} className="mr-2" color="#fb8500" />
								<Text>Rate</Text>
							</>
						) : (
							<>
								<Star size={25} className="mr-2" color="#fb8500" />
								<Text>{userRating.rating}</Text>
							</>
						)}
					</Button>
				</DialogTrigger>
				<DialogContent className="min-w-[90%]">
					<Text variant="h1" className="text-center">
						{name}
					</Text>
					<Text className="text-center">
						{resource.category === "ALBUM"
							? "Rate this album"
							: resource.category === "ARTIST"
								? "Rate this artist"
								: "Rate this song"}
					</Text>
					<View>
						<Controller
							control={control}
							name="rating"
							render={({ field: { onChange, value } }) => (
								<RatingInput value={value ?? 0} onChange={onChange} />
							)}
						/>
						<View className="mt-4">
							<Button
								variant="secondary"
								onPress={handleSubmit(onSubmit)}
								disabled={!formState.isValid}
								className="mb-4"
							>
								<Text>Rate</Text>
							</Button>
							{userRating &&
								(userRating.content ? (
									<AlertDialog
										trigger={
											<TouchableOpacity className="mb-6 w-5/6 flex items-center">
												<Text className=" text-gray-800 font-semibold">
													Remove rating
												</Text>
											</TouchableOpacity>
										}
										title="Remove your review?"
										description="This action will remove your current review"
										onConfirm={clearRating}
									/>
								) : (
									<TouchableOpacity
										onPress={clearRating}
										className="mb-6 w-5/6 flex items-center"
									>
										<Text className=" text-gray-800 font-semibold">
											Remove rating
										</Text>
									</TouchableOpacity>
								))}
						</View>
					</View>
				</DialogContent>
			</Dialog>
		</View>
	);
};

export default RatingDialog;
