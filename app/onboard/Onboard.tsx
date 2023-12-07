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
import { CreateProfile, CreateProfileSchema } from "@/types/profile";
import { cn } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarImage } from "@radix-ui/react-avatar";
import { AtSign, Disc3 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const Onboard = () => {
	const [page, setPage] = useState(0);
	const form = useForm<CreateProfile>({
		resolver: zodResolver(CreateProfileSchema),
		mode: "onChange",
		defaultValues: {
			handle: "",
			name: "",
			imageUrl: null,
		},
	});

	const onSubmit = async (values: CreateProfile) => {
		console.log(values);
	};

	const next = () => {
		setPage((page) => page + 1);
	};

	const name = form.watch("name");

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div
						className={cn(
							"flex-col items-center",
							page === 0
								? "duration-1000 animate-in fade-in"
								: "duration-1000 animate-out fade-out",
							page === 0 ? "flex" : "hidden"
						)}
					>
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
					</div>
					<div
						className={cn(
							"flex-col items-center",
							page === 1
								? "duration-1000 animate-in fade-in"
								: "duration-1000 animate-out fade-out",
							page === 1 ? "flex" : "hidden"
						)}
					>
						<p className="text-sm tracking-widest text-muted-foreground">
							STEP 1/3
						</p>
						<h1 className="mt-4">Handle</h1>
						<p className="mt-6 text-muted-foreground">
							Create a unique handle that will be used to identify
							you (e.g. @johndoe)
						</p>
						<FormField
							control={form.control}
							name="handle"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className="relative mt-8 flex items-center">
											<AtSign
												className="absolute left-3 text-muted-foreground"
												size={16}
											/>
											<Input
												{...field}
												placeholder="handle"
												className="pl-9 lowercase"
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
									form.getFieldState("handle").invalid ||
									!form.getFieldState("handle").isDirty
								}
								variant="secondary"
							>
								Next
							</Button>
						</div>
					</div>
					<div
						className={cn(
							"flex-col items-center",
							page === 2
								? "duration-1000 animate-in fade-in"
								: "duration-1000 animate-out fade-out",
							page === 2 ? "flex" : "hidden"
						)}
					>
						<p className="text-sm tracking-widest text-muted-foreground">
							STEP 2/3
						</p>
						<h1 className="mt-4">Name</h1>
						<p className="mt-6 text-muted-foreground">
							Create a name for your profile (e.g. John Doe)
						</p>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											{...field}
											placeholder="Name"
											className="mt-8 w-96"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
								Next
							</Button>
						</div>
					</div>
					<div
						className={cn(
							"flex-col items-center",
							page === 3
								? "duration-1000 animate-in fade-in"
								: "duration-1000 animate-out fade-out",
							page === 3 ? "flex" : "hidden"
						)}
					>
						<p className="text-sm tracking-widest text-muted-foreground">
							STEP 3/3
						</p>
						<h1 className="mt-4">Image</h1>
						<p className="mt-6 text-muted-foreground">
							Upload an image for your profile (optional)
						</p>
						<Avatar className="mt-8 h-40 w-40">
							<AvatarImage src="" />
							<AvatarFallback className="text-7xl">
								{name[0] && name[0].toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<p className="mt-4">Upload image</p>
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
								Next
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</>
	);
};
