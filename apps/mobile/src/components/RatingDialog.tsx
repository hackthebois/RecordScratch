import { RateForm, RateFormSchema, Rating, Resource } from "@recordscratch/types";
import { Alert, GestureResponderEvent, Pressable, TouchableOpacity, View } from "react-native";
import { Dialog, Modal, PanningProvider } from "react-native-ui-lib";
import { Text } from "./Text";
import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import { AntDesign } from "@expo/vector-icons";
import { api } from "@/utils/api";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Skeleton from "./Skeleton";
import { RatingInput } from "./RatingInput";
import AlertDialog from "./AlertDialog";

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
		return <Skeleton style={{ height: 48, width: 80 }} />;
	}
	return (
		<View className="">
			<Dialog
				visible={open}
				panDirection={PanningProvider.Directions.RIGHT}
				onDismiss={() => setOpen(!open)}
			>
				<View className=" flex flex-col bg-white rounded-lg justify-center">
					<Button
						className="w-full flex justify-end bg-white mt-3 -mb-2"
						onPress={() => setOpen(!open)}
					>
						<View>
							<AntDesign name="closecircleo" size={24} color="black" />
						</View>
					</Button>
					<View>
						<Text variant="h2" className=" text-center">
							{name}
						</Text>
						<Text className=" text-center my-2">
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
							<View
								style={{
									flexDirection: "column",
									alignItems: "center",
									marginTop: 16,
								}}
							>
								<Button
									label="Rate"
									variant="secondary"
									onPress={handleSubmit(onSubmit)}
									disabled={!formState.isValid}
									className="mb-4 w-5/6"
								/>
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
					</View>
				</View>
			</Dialog>
			<Button
				variant="secondary"
				size="default"
				className=" w-auto ml-2 h-auto py-3"
				onPress={() => setOpen(true)}
			>
				{!userRating ? (
					<View className="flex flex-row items-center justify-center">
						<AntDesign name="staro" size={25} color="#fb8500" className="mr-2" />
						<Text className="font-semibold w-full text-lg">Rate</Text>
					</View>
				) : (
					<View className="flex flex-row items-center h-full">
						<AntDesign name="star" size={25} color="#fb8500" className="mr-1" />
						<Text className="font-semibold w-full text-lg">{userRating.rating}</Text>
					</View>
				)}
			</Button>
		</View>
	);
};

export default RatingDialog;
