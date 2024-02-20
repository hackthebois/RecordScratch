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

import { UserAvatar } from "@/components/UserAvatar";
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
import { Profile, ProfileBioSchema, UpdateProfileSchema } from "@/types/profile";
import { useDebounce } from "@/utils/hooks";
import { AtSign } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@/trpc/react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";

const UpdateProfileFormSchema = UpdateProfileSchema.omit({
	imageUrl: true,
}).extend({
	bio: ProfileBioSchema.optional(),
	image: z.custom<File>((v) => v instanceof File).optional(),
});
export type UpdateProfileForm = z.infer<typeof UpdateProfileFormSchema>;

export const EditProfile = ({ profile }: { profile: Profile }) => {
	const { bio, handle: defaultHandle, imageUrl: defaultImageUrl, name } = profile;
	const utils = api.useUtils();
	const [open, setOpen] = useState(false);
	const { user } = useUser();
	const navigate = useNavigate();
	const imageRef = useRef<HTMLInputElement>(null);
	const [imageUrl, setImageUrl] = useState<string | undefined>(defaultImageUrl ?? undefined);

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
			user?.reload();
			setOpen(false);
			if (handle !== defaultHandle) {
				navigate({
					to: "/$handle",
					params: {
						handle,
					},
				});
			}
		},
	});

	useEffect(() => {
		form.reset({
			bio: bio ?? undefined,
			image: undefined,
			name,
			handle: defaultHandle,
		});
	}, [profile]);

	const { image, handle } = form.watch();

	useEffect(() => {
		if (image && image instanceof File) {
			setImageUrl(URL.createObjectURL(image));
		}
	}, [image]);

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
	}, [handleExists]);

	const onSubmit = async ({ bio, name, handle, image }: UpdateProfileForm) => {
		let imageUrl: string | null = null;
		try {
			if (image) {
				const profileImage = await user?.setProfileImage({
					file: image,
				});
				imageUrl = profileImage?.publicUrl ?? null;
			}
		} catch (e) {
			form.setError("image", {
				type: "validate",
				message: "Error uploading image",
			});
		}
		updateProfile({
			bio: bio ?? null,
			imageUrl: imageUrl ?? defaultImageUrl,
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
					<DialogDescription>Update your profile information</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="flex items-center gap-4">
							<UserAvatar size={80} imageUrl={imageUrl ?? null} />
							<Input
								className="hidden"
								id="image"
								ref={imageRef}
								type="file"
								onChange={(e) => {
									if (e.target.files) {
										form.setValue("image", e.target.files[0], {
											shouldDirty: true,
										});
									}
								}}
							/>
							{image ? (
								<Button
									variant="outline"
									onClick={(e) => {
										e.preventDefault();
										form.setValue("image", undefined);
										setImageUrl(defaultImageUrl ?? undefined);
									}}
								>
									Clear Image
								</Button>
							) : (
								<Button
									variant="outline"
									onClick={(e) => {
										e.preventDefault();
										imageRef.current?.click();
									}}
								>
									Edit Profile Image
								</Button>
							)}
						</div>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input type="text" placeholder="Name" {...field} />
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
										<Textarea placeholder="Bio" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button type="submit" disabled={!form.formState.isDirty}>
								Update
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};