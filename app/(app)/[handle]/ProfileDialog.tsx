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

import { trpc } from "@/app/_trpc/react";
import { updateProfile } from "@/app/actions";
import UserAvatar from "@/components/UserAvatar";
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
	ProfileBioSchema,
	UpdateProfileSchema,
} from "@/types/profile";
import { useDebounce } from "@/utils/hooks";
import { useUser } from "@clerk/nextjs";
import { AtSign } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const UpdateProfileForm = UpdateProfileSchema.omit({
	imageUrl: true,
}).extend({
	bio: ProfileBioSchema.optional(),
	image: z.custom<File>((v) => v instanceof File).optional(),
});
type UpdateProfile = z.infer<typeof UpdateProfileForm>;

export const ProfileDialog = ({
	profile: { bio, name, imageUrl: defaultImageUrl, handle: defaultHandle },
}: {
	profile: Profile;
}) => {
	const [open, setOpen] = useState(false);
	const { user } = useUser();
	const imageRef = useRef<HTMLInputElement>(null);
	const [imageUrl, setImageUrl] = useState<string | undefined>(
		defaultImageUrl ?? undefined
	);

	const form = useForm<UpdateProfile>({
		resolver: zodResolver(UpdateProfileForm),
		defaultValues: {
			bio: bio ?? undefined,
			image: undefined,
			name,
			handle: defaultHandle,
		},
	});

	const { image, handle } = form.watch();

	useEffect(() => {
		if (image && image instanceof File) {
			setImageUrl(URL.createObjectURL(image));
		}
	}, [image]);

	const debouncedHandle = useDebounce(handle, 500);
	const { data: handleExists } = trpc.user.profile.handleExists.useQuery(
		debouncedHandle,
		{
			enabled: handle.length > 0,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		}
	);
	useEffect(() => {
		if (handleExists && handle !== defaultHandle) {
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
	}, [handleExists]);

	if (!user) {
		return null;
	}

	const onSubmit = async ({ bio, name, handle, image }: UpdateProfile) => {
		let imageUrl: string | null = null;
		if (image) {
			const profileImage = await user?.setProfileImage({
				file: image,
			});
			imageUrl = profileImage?.publicUrl ?? null;
		}
		updateProfile(
			{
				bio: bio ?? null,
				imageUrl: imageUrl ?? defaultImageUrl,
				name,
				handle,
			},
			user.id,
			defaultHandle
		);
		setOpen(false);
		user?.reload();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="mt-4">
					Edit Profile
				</Button>
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
								size={80}
								name={name}
								imageUrl={imageUrl ?? null}
							/>
							<Input
								className="hidden"
								id="image"
								ref={imageRef}
								type="file"
								onChange={(e) => {
									if (e.target.files) {
										form.setValue(
											"image",
											e.target.files[0],
											{ shouldDirty: true }
										);
									}
								}}
							/>
							{image ? (
								<Button
									variant="outline"
									onClick={(e) => {
										e.preventDefault();
										form.setValue("image", undefined);
										setImageUrl(
											defaultImageUrl ?? undefined
										);
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
							<Button
								type="submit"
								disabled={!form.formState.isDirty}
							>
								Update
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
