import { FontAwesome6 } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, useDebounce } from "@recordscratch/lib";
import type { Onboard } from "@recordscratch/types";
import { OnboardSchema, handleRegex } from "@recordscratch/types";
import * as ImagePicker from "expo-image-picker";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TextInput, View } from "react-native";
import { UserAvatar } from "~/components/UserAvatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";

const SlideWrapper = ({
	page,
	pageIndex,
	children,
}: {
	page: number;
	pageIndex: number;
	children: React.ReactNode;
}) => {
	return (
		<View
			className={cn(
				"flex-col items-center p-4",
				page === pageIndex
					? "duration-1000 animate-in fade-in"
					: "duration-1000 animate-out fade-out",
				page === pageIndex ? "flex" : "hidden"
			)}
		>
			{children}
		</View>
	);
};

const onInvalid = (errors: unknown) => console.error(errors);

function Onboard() {
	const utils = api.useUtils();
	const [page, setPage] = useState(0);
	const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
	const form = useForm<Onboard>({
		resolver: zodResolver(OnboardSchema),
		mode: "onChange",
		defaultValues: {
			handle: "",
			name: "",
			bio: "",
			image: undefined,
		},
	});
	const { name, image, handle, bio } = form.watch();
	const { data: needsOnboarding } = api.profiles.needsOnboarding.useQuery();

	useEffect(() => {
		if (!needsOnboarding) {
			router.replace("/");
		}
	}, [needsOnboarding, router]);

	const { mutate: createProfile, isPending } = api.profiles.create.useMutation({
		onSuccess: () => {
			utils.profiles.me.invalidate();
			utils.profiles.needsOnboarding.invalidate();
		},
	});
	const { mutateAsync: getSignedURL } = api.profiles.getSignedURL.useMutation();

	const debouncedHandle = useDebounce(handle, 500);
	const { data: handleExists } = api.profiles.handleExists.useQuery(debouncedHandle, {
		enabled: debouncedHandle?.length > 0,
	});

	const handleImagePick = async (onChange: {
		(...event: any[]): void;
		(arg0: string | undefined): void;
	}) => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			// ImagePicker saves the taken photo to disk and returns a local URI to it
			let localUri = result.assets[0]!.uri ?? "";
			setImageUrl(result.assets[0]!.uri);

			let filename = localUri.split("/").pop() ?? "";

			// Infer the type of the image
			let match = /\.(\w+)$/.exec(filename);
			let type = match ? `image/${match[1]}` : `image`;

			// Fetch the image data to create a Blob object
			const response = await fetch(localUri);
			const blob = await response.blob();

			// Create a File object from Blob
			const file = new File([blob], filename || "image.jpg", { type });

			onChange(file);
		}
	};

	useEffect(() => {
		if (handleExists) {
			form.setError("handle", {
				type: "validate",
				message: "Handle already exists",
			});
		} else {
			if (form.formState.errors.handle?.message === "Handle already exists") {
				form.clearErrors("handle");
			}
		}
	}, [form, handleExists]);

	const onSubmit = async ({ name, handle, image, bio }: Onboard) => {
		if (image) {
			const url = await getSignedURL({
				type: image.type,
				size: image.size,
			});

			await fetch(url, {
				method: "PUT",
				body: image,
				headers: {
					"Content-Type": image?.type,
				},
			});
			createProfile({
				name,
				handle,
				imageUrl: url,
				bio: bio ?? null,
			});
		}

		createProfile({
			name,
			handle,
			imageUrl: null,
			bio: bio ?? null,
		});
	};

	useEffect(() => {
		if (!form.getFieldState("handle").isTouched) {
			form.setValue(
				"handle",
				name?.replace(new RegExp(`[^${handleRegex.source}]+`, "g"), "").replace(" ", "")
			);
		}
	}, [form, name]);

	useEffect(() => {
		if (page === 1) {
			form.setFocus("name");
		}
	}, [form, page]);

	const pageValid = (pageIndex: number) => {
		if (pageIndex === 0) {
			return true;
		}
		if (pageIndex === 1) {
			return (
				!form.getFieldState("name").invalid &&
				name?.length > 0 &&
				!form.getFieldState("handle").invalid &&
				handle?.length > 0
			);
		} else if (pageIndex === 2) {
			return true;
		} else if (pageIndex === 3) {
			return true;
		} else {
			return true;
		}
	};

	if (isPending) {
		return (
			<View className="mx-auto flex min-h-[100svh] w-full max-w-screen-lg flex-1 flex-col items-center justify-center p-4 sm:p-6">
				<Stack.Screen
					options={{
						title: ``,
					}}
				/>
				<FontAwesome6 name="compact-disc" size={24} color="black" />
			</View>
		);
	}

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
			<Stack.Screen
				options={{
					title: ``,
				}}
			/>
			<SlideWrapper page={page} pageIndex={0}>
				<FontAwesome6 name="compact-disc" size={200} />
				<Text className="mt-12 text-center w-full" variant="h1">
					Welcome to RecordScratch!
				</Text>
				<Text className="mt-4 text-center text-gray-700">
					Before you get started we have to set up your profile.
				</Text>
				<Text className="mt-1 text-center text-gray-700">
					Press next below to get started.
				</Text>
			</SlideWrapper>
			<SlideWrapper page={page} pageIndex={1}>
				<Text className="border border-gray-300 p-2 rounded-lg">STEP 1/3</Text>
				<Text className="mt-8" variant="h1">
					Pick a name
				</Text>
				<Controller
					control={form.control}
					name="name"
					render={({ field }) => (
						<View className="mt-8 w-full">
							<View className="flex flex-row items-center border border-gray-300 rounded-md w-full">
								<TextInput
									{...field}
									style={{
										flexDirection: "row",
										alignItems: "center",
										marginLeft: 5,
										padding: 5,
									}}
									placeholder="Name"
									className=" w-96 text-foreground"
									autoComplete="off"
									onChangeText={field.onChange}
								/>
							</View>
							{form.formState.errors.name && (
								<Text style={{ color: "red", marginTop: 2 }}>
									{form.formState.errors.name.message}
								</Text>
							)}
						</View>
					)}
				/>
				<Controller
					control={form.control}
					name="handle"
					render={({ field }) => (
						<View className="mt-2 w-full">
							<View className="flex flex-row items-center border border-gray-300 rounded-md w-full">
								<FontAwesome6 name="at" size={15} color="gray" className="ml-2" />
								<TextInput
									{...field}
									style={{
										flexDirection: "row",
										alignItems: "center",
										padding: 5,
									}}
									placeholder=" Handle"
									className="w-[22.75rem] text-foreground"
									autoComplete="off"
									onChangeText={field.onChange}
								/>
							</View>
							{form.formState.errors.handle && (
								<Text style={{ color: "red", marginTop: 2 }}>
									{form.formState.errors.handle.message}
								</Text>
							)}
						</View>
					)}
				/>
			</SlideWrapper>
			<SlideWrapper page={page} pageIndex={2}>
				<Text className="border border-gray-300 p-2 rounded-lg">STEP 2/3</Text>
				<Text className="mt-8" variant="h1">
					Describe yourself
				</Text>
				<Controller
					control={form.control}
					name="bio"
					render={({ field }) => (
						<View className="mt-2 w-full">
							<View className="flex flex-row items-center border border-gray-300 rounded-md w-full mt-4">
								<TextInput
									{...field}
									style={{
										height: 150,
										textAlignVertical: "top",
										marginLeft: 10,
										marginTop: 10,
									}}
									placeholder="Bio"
									className="w-[23rem] text-start text-foreground"
									multiline={true}
									autoComplete="off"
									onChangeText={field.onChange}
								/>
							</View>
							{form.formState.errors.bio && (
								<Text style={{ color: "red", marginTop: 2 }}>
									{form.formState.errors.bio.message}
								</Text>
							)}
						</View>
					)}
				/>
			</SlideWrapper>
			<SlideWrapper page={page} pageIndex={3}>
				<Text className="border border-gray-300 p-2 rounded-lg">STEP 3/3</Text>
				<Text className="my-8" variant="h1">
					Image
				</Text>
				<UserAvatar imageUrl={imageUrl} size={200} />
				<Controller
					control={form.control}
					name="image"
					render={({ field: { onChange } }) => (
						<View>
							<Button
								variant="secondary"
								onPress={() => handleImagePick(onChange)}
								className="mt-8"
							>
								<Text>Pick an image</Text>
							</Button>
							{form.formState.errors.image && (
								<Text style={{ color: "red", marginTop: 5, textAlign: "center" }}>
									{`${form.formState.errors.image.message}`}
								</Text>
							)}
						</View>
					)}
				/>
			</SlideWrapper>
			<View className="mt-8 flex flex-row gap-4">
				{page !== 0 && (
					<Button variant="secondary" onPress={() => setPage((page) => page - 1)}>
						<Text>Back</Text>
					</Button>
				)}
				<Button
					variant="secondary"
					onPress={() => {
						if (page === 3) {
							form.handleSubmit(onSubmit, onInvalid)();
						} else {
							setPage((page) => page + 1);
						}
					}}
					disabled={!pageValid(page)}
				>
					{page === 2 && !bio
						? "Skip"
						: page === 3 && !image
							? `Skip`
							: page === 3
								? "Finish"
								: "Next"}
				</Button>
			</View>
		</View>
	);
}

export default Onboard;
