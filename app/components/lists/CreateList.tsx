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
import { InsertList, insertListSchema } from "@/types/list";
import { PlusSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { api } from "@/trpc/react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/Select";
import {
	SelectPortal,
	SelectValue,
	SelectViewport,
} from "@radix-ui/react-select";

export const CreateList = () => {
	const utils = api.useUtils();
	const [open, setOpen] = useState(false);

	const form = useForm<InsertList>({
		resolver: zodResolver(insertListSchema),
	});

	const { data: profile } = api.profiles.me.useQuery();

	const { mutate: createList } = api.lists.createList.useMutation({
		onSuccess: () => {
			utils.lists.getUserLists.invalidate({ userId: profile!.userId });
			setOpen(false);
		},
	});

	useEffect(() => {
		form.reset({
			name: "",
			category: undefined,
			description: "",
		});
	}, []);

	const onSubmit = async ({ name, category, description }: InsertList) => {
		createList({
			name,
			category,
			description,
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					className=" mb-2 ml-3 w-full items-center gap-1 rounded p-6"
					variant="outline"
				>
					<PlusSquare className="h-6 w-6" />
					Create List
				</Button>
			</DialogTrigger>
			<DialogContent className="w-full sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-2xl">Create List</DialogTitle>
					<DialogDescription>Create a new list</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
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
							name="category"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<FormControl className="w-full rounded-md py-2 pl-2 pr-10 text-muted">
										<Select
											{...field}
											onValueChange={field.onChange}
											value={field.value}
										>
											<SelectTrigger>
												<SelectValue
													placeholder={
														"Select a Category..."
													}
												/>
											</SelectTrigger>
											<SelectPortal>
												<SelectContent>
													<SelectViewport>
														<SelectItem value="ALBUM">
															ALBUMS
														</SelectItem>
														<SelectItem value="SONG">
															SONGS
														</SelectItem>
														<SelectItem value="ARTIST">
															ARTISTS
														</SelectItem>
													</SelectViewport>
												</SelectContent>
											</SelectPortal>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Description..."
											{...field}
											value={field.value ?? ""}
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
								Create List
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
