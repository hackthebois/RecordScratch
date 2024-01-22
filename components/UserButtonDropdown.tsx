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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogOut, Moon, Sun, UserCog } from "lucide-react";
import { useTheme } from "next-themes";

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
import {
	Profile,
	ProfileBioSchema,
	UpdateProfile,
	UpdateProfileSchema,
} from "@/types/profile";
import { useDebounce } from "@/utils/hooks";
import { AtSign } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { handleExistsAction } from "@/app/_api/actions";
import { useClerk, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";

export const ThemeItem = () => {
	const { theme, setTheme, systemTheme } = useTheme();

	const currentTheme = theme === "system" ? systemTheme : theme;

	return (
		<DropdownMenuItem
			onClick={(e) => {
				e.preventDefault();
				setTheme(theme === "light" ? "dark" : "light");
			}}
		>
			<Sun
				size={15}
				className="mr-1.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				size={15}
				className="absolute mr-1.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			{currentTheme === "dark" ? "Dark" : "Light"}
		</DropdownMenuItem>
	);
};

export const SignOutItem = ({
	revalidateUser,
}: {
	revalidateUser: (id: string) => void;
}) => {
	const { signOut } = useClerk();
	const { user } = useUser();
	const posthog = usePostHog();

	return (
		<DropdownMenuItem
			onClick={() => {
				signOut();
				if (user) revalidateUser(user.id);
				user?.reload();
				posthog.reset();
			}}
		>
			<LogOut size={15} className="mr-1.5" />
			Sign out
		</DropdownMenuItem>
	);
};

const UpdateProfileFormSchema = UpdateProfileSchema.omit({
	imageUrl: true,
}).extend({
	bio: ProfileBioSchema.optional(),
	image: z.custom<File>((v) => v instanceof File).optional(),
});
export type UpdateProfileForm = z.infer<typeof UpdateProfileFormSchema>;

export const UserButtonDropdown = ({
	profile,
	updateProfile,
	revalidateUser,
}: {
	profile: Profile;
	updateProfile: (input: UpdateProfile) => void;
	revalidateUser: (id: string) => void;
}) => {
	const {
		bio,
		name,
		imageUrl: defaultImageUrl,
		handle: defaultHandle,
	} = profile;
	const [open, setOpen] = useState(false);
	const { user } = useUser();
	const imageRef = useRef<HTMLInputElement>(null);
	const [imageUrl, setImageUrl] = useState<string | undefined>(
		defaultImageUrl ?? undefined
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

	const { image, handle } = form.watch();

	useEffect(() => {
		if (image && image instanceof File) {
			setImageUrl(URL.createObjectURL(image));
		}
	}, [image]);

	const debouncedHandle = useDebounce(handle, 500);
	const { data: handleExists } = useQuery({
		queryKey: [debouncedHandle],
		queryFn: async () => {
			const { data, serverError } = await handleExistsAction(
				debouncedHandle
			);
			if (serverError) throw new Error(serverError);
			return data;
		},
		enabled:
			debouncedHandle.length > 0 && debouncedHandle !== defaultHandle,
	});

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

	const onSubmit = async ({
		bio,
		name,
		handle,
		image,
	}: UpdateProfileForm) => {
		let imageUrl: string | null = null;
		if (image) {
			const profileImage = await user?.setProfileImage({
				file: image,
			});
			imageUrl = profileImage?.publicUrl ?? null;
		}
		updateProfile({
			bio: bio ?? null,
			imageUrl: imageUrl ?? defaultImageUrl,
			name,
			handle,
			oldHandle: defaultHandle,
		});
		setOpen(false);
		user?.reload();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="relative h-[36px] w-[36px] rounded-full"
					>
						<UserAvatar {...profile} size={36} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					side="bottom"
					sideOffset={18}
					className="absolute -right-5 w-40"
				>
					<DropdownMenuItem asChild>
						<Link
							href={`/${profile.handle}`}
							className="flex flex-col gap-1"
						>
							<span className="w-full">{profile.name}</span>
							<span className="w-full text-xs text-muted-foreground">
								Go to profile
							</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<DialogTrigger className="flex w-full flex-row">
							<UserCog size={15} className="mr-1.5" />
							Edit Profile
						</DialogTrigger>
					</DropdownMenuItem>
					<ThemeItem />
					<SignOutItem revalidateUser={revalidateUser} />
				</DropdownMenuContent>
			</DropdownMenu>
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
