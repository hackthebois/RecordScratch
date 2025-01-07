import { KeyboardAvoidingScrollView } from "@/components/KeyboardAvoidingView";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { AtSign } from "@/lib/icons/IconsLoader";
import { getImageUrl } from "@/lib/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@recordscratch/lib";
import { UpdateProfileForm, UpdateProfileFormSchema } from "@recordscratch/types";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TextInput, View } from "react-native";

const EditProfile = () => {
	const profile = useAuth((s) => s.profile!);
	const setProfile = useAuth((s) => s.setProfile);
	const utils = api.useUtils();
	const [loading, setLoading] = useState(false);

	const form = useForm<UpdateProfileForm>({
		resolver: zodResolver(UpdateProfileFormSchema),
		defaultValues: {
			bio: profile.bio ?? undefined,
			image: {
				uri: getImageUrl(profile),
				type: "image/jpeg",
				size: 0,
			},
			name: profile.name,
			handle: profile.handle,
		},
	});

	const { mutate: updateProfile } = api.profiles.update.useMutation({
		onSuccess: async (profile, { handle }) => {
			await utils.profiles.me.invalidate();
			await utils.profiles.get.invalidate(handle);
			await setProfile(profile);
			await form.reset({
				bio: profile.bio ?? undefined,
				image: {
					uri: getImageUrl(profile),
					type: "image/jpeg",
					size: 0,
				},
				name: profile.name,
				handle: handle,
			});
		},
	});
	const { mutateAsync: getSignedURL } = api.profiles.getSignedURL.useMutation();

	const image = form.watch("image");
	const handle = form.watch("handle");
	const name = form.watch("name");

	const debouncedHandle = useDebounce(handle, 500);
	const { data: handleExists } = api.profiles.handleExists.useQuery(debouncedHandle, {
		enabled: debouncedHandle.length > 0 && debouncedHandle !== profile.handle,
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

	const onSubmit = async (data: UpdateProfileForm) => {
		console.log(data);
		await setLoading(true);
		if (data.image) {
			const url = await getSignedURL({
				type: data.image.type,
				size: data.image.size,
			});

			const response = await fetch(data.image.uri);
			const blob = await response.blob();

			await fetch(url, {
				method: "PUT",
				body: blob,
				headers: {
					"Content-Type": data.image.type,
				},
			});
		}

		await updateProfile({
			bio: data.bio ?? null,
			name: data.name,
			handle: data.handle,
			imageUrl: null,
		});
		await setLoading(false);
	};

	const pageValid = () => {
		return (
			!form.getFieldState("name").invalid &&
			name?.length > 0 &&
			!form.getFieldState("handle").invalid &&
			handle?.length > 0 &&
			!form.getFieldState("bio").invalid &&
			!form.getFieldState("image").invalid &&
			!loading
		);
	};

	return (
		<KeyboardAvoidingScrollView contentContainerClassName="p-4 gap-6">
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
							multiline
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
				<UserAvatar imageUrl={image?.uri} size={100} />
				<Controller
					control={form.control}
					name="image"
					render={({ field: { onChange } }) => (
						<View>
							<Button
								variant="secondary"
								onPress={async () => {
									let result = await ImagePicker.launchImageLibraryAsync({
										mediaTypes: ["images"],
										allowsEditing: true,
										aspect: [1, 1],
										quality: 1,
									});

									if (
										!result.canceled &&
										result.assets &&
										result.assets.length > 0
									) {
										const asset = result.assets[0]!;
										onChange({
											uri: asset.uri,
											type: asset.type ?? "image/jpeg",
											size: asset.fileSize,
										});
									}
								}}
							>
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
		</KeyboardAvoidingScrollView>
	);
};

export default EditProfile;
