import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { AtSign } from "@/lib/icons/AtSign";
import { getImageUrl } from "@/lib/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@recordscratch/lib";
import { UpdateProfileForm, UpdateProfileFormSchema } from "@recordscratch/types";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, TextInput, View } from "react-native";

const EditProfile = () => {
	const profile = useAuth((s) => s.profile!);
	const [loading, setLoading] = useState(false);
	const { bio, handle: defaultHandle, name } = profile;
	const setProfile = useAuth((s) => s.setProfile);
	const utils = api.useUtils();

	const [imageUrl, setImageUrl] = useState<string | undefined>(getImageUrl(profile));

	const form = useForm<UpdateProfileForm>({
		resolver: zodResolver(UpdateProfileFormSchema),
		defaultValues: {
			bio: bio ?? undefined,
			image: undefined,
			name,
			handle: defaultHandle,
		},
	});

	const { mutate: updateProfile } = api.profiles.update.useMutation({
		onSuccess: async (profile, { handle }) => {
			setLoading(false);
			await utils.profiles.me.invalidate();
			await utils.profiles.get.invalidate(handle);
			setProfile(profile);
			setImageUrl(getImageUrl(profile));
		},
	});
	const { mutateAsync: getSignedURL } = api.profiles.getSignedURL.useMutation();

	useEffect(() => {
		form.reset({
			bio: bio ?? undefined,
			image: undefined,
			name,
			handle: defaultHandle,
		});
	}, [bio, defaultHandle, form, name, profile]);

	const image = form.watch("image");
	const handle = form.watch("handle");

	useEffect(() => {
		if (image && !form.formState.errors.image && image instanceof File) {
			setImageUrl(URL.createObjectURL(image));
		}
	}, [image, form]);

	const debouncedHandle = useDebounce(handle, 500);
	const { data: handleExists } = api.profiles.handleExists.useQuery(debouncedHandle, {
		enabled: debouncedHandle.length > 0 && debouncedHandle !== defaultHandle,
	});

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

	const onSubmit = async ({ bio, name, handle, image }: UpdateProfileForm) => {
		setLoading(true);
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
		}
		updateProfile({
			bio: bio ?? null,
			name,
			handle,
			imageUrl: null,
		});
	};

	const handleImagePick = async (onChange: {
		(...event: any[]): void;
		(arg0: string | undefined): void;
	}) => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			// ImagePicker saves the taken photo to disk and returns a local URI to it
			let localUri = result.assets[0]!.uri ?? "";
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

	const pageValid = () => {
		return (
			!form.getFieldState("name").invalid &&
			name?.length > 0 &&
			!form.getFieldState("handle").invalid &&
			handle?.length > 0 &&
			!form.getFieldState("bio").invalid &&
			!form.getFieldState("image").invalid
		);
	};

	return (
		<ScrollView contentContainerClassName="p-4 gap-6">
			<Stack.Screen
				options={{
					title: "Edit Profile",
				}}
			/>
			<Controller
				control={form.control}
				name="name"
				render={({ field }) => (
					<View className="gap-2">
						<Text>Name</Text>
						<TextInput
							{...field}
							placeholder="Name"
							className="self-stretch text-foreground border-border border rounded-md px-4 py-3"
							autoComplete="off"
							onChangeText={field.onChange}
						/>
						{form.formState.errors.name && (
							<Text className="mt-2 text-destructive">
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
					<View className="gap-2">
						<Text>Handle</Text>
						<View>
							<AtSign
								className="absolute left-3 top-[11px] text-muted-foreground text-lg"
								size={16}
							/>
							<TextInput
								{...field}
								placeholder="Handle"
								className="self-stretch text-foreground border-border border rounded-md pl-9 pr-4 py-3"
								autoComplete="off"
								onChangeText={field.onChange}
							/>
							{form.formState.errors.handle && (
								<Text className="mt-2 text-destructive">
									{form.formState.errors.handle.message}
								</Text>
							)}
						</View>
					</View>
				)}
			/>
			<Controller
				control={form.control}
				name="bio"
				render={({ field }) => (
					<View className="gap-2">
						<Text>Bio</Text>
						<TextInput
							{...field}
							placeholder="Bio"
							className="self-stretch text-foreground border-border border rounded-md p-4 h-40"
							multiline={true}
							autoComplete="off"
							onChangeText={field.onChange}
						/>
						{form.formState.errors.bio && (
							<Text className="mt-2 text-destructive">
								{form.formState.errors.bio.message}
							</Text>
						)}
					</View>
				)}
			/>
			<View className="flex flex-row items-center gap-4 ">
				<UserAvatar imageUrl={imageUrl} size={100} />
				<Controller
					control={form.control}
					name="image"
					render={({ field: { onChange } }) => (
						<View>
							<Button variant="secondary" onPress={() => handleImagePick(onChange)}>
								<Text>Pick an image</Text>
							</Button>
							{form.formState.errors.image && (
								<Text className="mt-2 text-destructive">
									{form.formState.errors.image.message}
								</Text>
							)}
						</View>
					)}
				/>
			</View>
			<Button
				onPress={form.handleSubmit(onSubmit)}
				disabled={!pageValid()}
				className="self-stretch"
				variant="secondary"
			>
				{loading ? <Text>Loading...</Text> : <Text>Save</Text>}
			</Button>
		</ScrollView>
	);
};

export default EditProfile;
