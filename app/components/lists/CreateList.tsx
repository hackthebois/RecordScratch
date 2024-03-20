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
import { Category, InsertList, insertListSchema } from "@/types/list";
import { PlusSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { api } from "@/trpc/react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/Select";
import { SelectValue } from "@radix-ui/react-select";

export const CreateList = ({
	category,
	size,
}: {
	category?: Category;
	size?: number;
}) => {
	const utils = api.useUtils();
	const [open, setOpen] = useState(false);

	const form = useForm<InsertList>({
		resolver: zodResolver(insertListSchema),
	});

	const { data: profile } = api.profiles.me.useQuery();

	const { mutate: createList } = api.lists.create.useMutation({
		onSuccess: () => {
			utils.lists.getUser.invalidate({ userId: profile!.userId });
			setOpen(false);
		},
	});

	useEffect(() => {
		form.reset({
			name: undefined,
			category: category,
			description: "",
		});
	}, [form]);

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
					className="h-10 gap-1 rounded pb-5 pt-5"
					variant="outline"
					style={{
						width: size,
						height: size,
						maxWidth: size,
						maxHeight: size,
					}}
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
									<Select
										onValueChange={field.onChange}
										value={field.value}
									>
										<FormControl className="rounded-md py-2 pl-2">
											<SelectTrigger>
												<SelectValue
													placeholder={
														"Select a Category..."
													}
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="ALBUM">
												ALBUMS
											</SelectItem>
											<SelectItem value="SONG">
												SONGS
											</SelectItem>
											<SelectItem value="ARTIST">
												ARTISTS
											</SelectItem>
										</SelectContent>
									</Select>
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
							<Button type="submit">Create List</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
