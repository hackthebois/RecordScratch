"use client";

import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { CreateProfileSchema, handleRegex } from "@/types/profile";
import { cn } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarImage } from "@radix-ui/react-avatar";
import { AtSign, Disc3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
		<div
			className={cn(
				"flex-col items-center",
				page === pageIndex
					? "duration-1000 animate-in fade-in"
					: "duration-1000 animate-out fade-out",
				page === pageIndex ? "flex" : "hidden"
			)}
		>
			{children}
		</div>
	);
};

const CreateProfileFormSchema = CreateProfileSchema.omit({
	imageUrl: true,
}).extend({
	image: z.custom<File>((v) => v instanceof File),
});
type CreateProfileForm = z.infer<typeof CreateProfileFormSchema>;

export const Onboard = () => {
	const [page, setPage] = useState(0);
	const form = useForm<CreateProfileForm>({
		resolver: zodResolver(CreateProfileFormSchema),
		mode: "onChange",
		defaultValues: {
			handle: "",
			name: "",
		},
	});

	const onSubmit = async (values: CreateProfileForm) => {
		console.log(values);
	};

	const next = () => {
		setPage((page) => page + 1);
	};

	const name = form.watch("name");

	useEffect(() => {
		if (name && !form.getFieldState("handle").isDirty) {
			form.setValue(
				"handle",
				name
					.replace(new RegExp(`[^${handleRegex.source}]+`, "g"), "")
					.replace(" ", "")
			);
		}
	}, [name]);

	useEffect(() => {
		if (page === 1) {
			form.setFocus("name");
		}
	}, [page]);

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<SlideWrapper page={page} pageIndex={0}>
						<Disc3 size={200} />
						<h1 className="mt-12">Welcome to RecordScratch!</h1>
						<p className="mt-6 text-muted-foreground">
							Before you get started we have to set up your
							profile.
						</p>
						<p className="mt-3 text-muted-foreground">
							Press next below to get started.
						</p>
						<Button
							onClick={(e) => {
								e.preventDefault();
								next();
							}}
							className="mt-10"
							variant="secondary"
						>
							Next
						</Button>
					</SlideWrapper>
					<SlideWrapper page={page} pageIndex={1}>
						<Tag>STEP 1/2</Tag>
						<h1 className="mt-6">Pick a name</h1>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											{...field}
											placeholder="Name"
											className="mt-8 w-80"
											autoComplete="off"
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
									<FormControl>
										<div className="relative mt-4 flex w-80 items-center">
											<AtSign
												className="absolute left-3 text-muted-foreground"
												size={16}
											/>
											<Input
												{...field}
												placeholder="handle"
												className="pl-9 lowercase"
												autoComplete="off"
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="mt-8 flex gap-4">
							<Button
								variant="outline"
								onClick={() => setPage((page) => page - 1)}
							>
								Back
							</Button>
							<Button
								onClick={next}
								disabled={
									(form.getFieldState("handle").invalid ||
										!form.getFieldState("handle")
											.isDirty) &&
									(form.getFieldState("name").invalid ||
										!form.getFieldState("name").isDirty)
								}
								variant="secondary"
							>
								Next
							</Button>
						</div>
					</SlideWrapper>
					<SlideWrapper page={page} pageIndex={2}>
						<p className="text-sm tracking-widest text-muted-foreground">
							STEP 2/2
						</p>
						<h1 className="mt-4">Image</h1>
						<Avatar className="mt-8 h-40 w-40">
							<AvatarImage src="" />
							<AvatarFallback className="text-7xl">
								{name[0] && name[0].toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="mt-8 flex gap-3">
							<Button
								variant="outline"
								onClick={() => setPage((page) => page - 1)}
							>
								Back
							</Button>
							<Button
								onClick={next}
								disabled={
									form.getFieldState("name").invalid ||
									!form.getFieldState("name").isDirty
								}
								variant="secondary"
							>
								{form.getFieldState("image").invalid
									? "Skip"
									: "Next"}
							</Button>
						</div>
					</SlideWrapper>
				</form>
			</Form>
		</>
	);
};
