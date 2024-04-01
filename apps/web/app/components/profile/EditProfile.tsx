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

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
	Profile,
	UpdateProfileForm,
	UpdateProfileFormSchema,
} from "@recordscratch/types";
import { useDebounce } from "@recordscratch/utils";
import { AtSign } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { api } from "@/trpc/react";
import { getImageUrl } from "@recordscratch/utils";
import { useNavigate } from "@tanstack/react-router";
import { UserAvatar } from "../user/UserAvatar";

export const EditProfile = ({ profile }: { profile: Profile }) => {
	const { bio, handle: defaultHandle, name } = profile;
	const utils = api.useUtils();
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const [imageUrl, setImageUrl] = useState<string | undefined>(
		getImageUrl(profile)
	);

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
		onSuccess: (_, { handle }) => {
			utils.profiles.me.invalidate();
			utils.profiles.get.invalidate(handle);
			setOpen(false);
			if (handle !== defaultHandle) {
				navigate({
					to: "/$handle",
					params: {
						handle,
					},
				});
			} else {
				window.location.reload();
			}
		},
	});
	const { mutateAsync: getSignedURL } =
		api.profiles.getSignedURL.useMutation();

	useEffect(() => {
		form.reset({
			bio: bio ?? undefined,
			image: undefined,
			name,
			handle: defaultHandle,
		});
	}, [bio, defaultHandle, form, name, profile]);

	const { image, handle } = form.watch();

	useEffect(() => {
		if (image && !form.formState.errors.image && image instanceof File) {
			setImageUrl(URL.createObjectURL(image));
		}
	}, [image, form]);

	const debouncedHandle = useDebounce(handle, 500);
	const { data: handleExists } = api.profiles.handleExists.useQuery(
		debouncedHandle,
		{
			enabled:
				debouncedHandle.length > 0 && debouncedHandle !== defaultHandle,
		}
	);

	useEffect(() => {
		if (handleExists) {
			form.setError("handle", {
				type: "validate",
				message: "Handle already exists",
			});
		} else {
			if (
				form.formState.errors.handle?.message ===
				"Handle already exists"
			) {
				form.clearErrors("handle");
			}
		}
	}, [form, handleExists]);

	const onSubmit = async ({
		bio,
		name,
		handle,
		image,
	}: UpdateProfileForm) => {
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
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Edit Profile</Button>
			</DialogTrigger>
			<DialogContent className="w-full sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-2xl">Edit Profile</DialogTitle>
					<DialogDescription>
						Update your profile information
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<div className="flex items-center gap-4">
							<UserAvatar
								className="h-20 w-20"
								imageUrl={imageUrl}
							/>
							<FormField
								control={form.control}
								name="image"
								render={({ field: { onChange } }) => (
									<FormItem>
										<FormLabel>Profile Image</FormLabel>
										<FormControl>
											<Input
												type="file"
												accept="image/*"
												onChange={(event) =>
													onChange(
														event.target.files &&
															event.target
																.files[0]
													)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormMessage>
							{form.formState.errors.image?.message}
						</FormMessage>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="handle"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Handle</FormLabel>
									<FormControl>
										<div className="relative mt-4 flex w-80 items-center">
											<AtSign
												className="absolute left-3 text-muted-foreground"
												size={15}
											/>
											<Input
												{...field}
												placeholder="Handle"
												className="pl-[30px]"
												autoComplete="off"
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bio</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Bio"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="submit" className="w-full">
								Update
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
