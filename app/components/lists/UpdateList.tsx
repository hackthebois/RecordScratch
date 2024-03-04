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
import { UpdateList, updateFormSchema } from "@/types/list";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { api } from "@/trpc/react";

export const ModifyList = ({
	id,
	name,
	description,
}: {
	id: string;
	name: string;
	description: string | null;
}) => {
	const utils = api.useUtils();
	const [open, setOpen] = useState(false);

	const form = useForm<UpdateList>({
		resolver: zodResolver(updateFormSchema),
	});

	const { data: profile } = api.profiles.me.useQuery();

	const { mutate: updateList } = api.lists.updateList.useMutation({
		onSuccess: () => {
			utils.lists.getUserLists.invalidate({ userId: profile!.userId });
			utils.lists.getList.invalidate({ id });
			setOpen(false);
		},
	});

	useEffect(() => {
		form.reset({
			name: name,
			description: description ?? "",
		});
	}, [name, description, form]);

	const onSubmit = async ({ name, description }: UpdateList) => {
		updateList({
			id,
			name,
			description,
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="ml-3 items-center gap-1 rounded pl-2 pr-2">
					Edit List
				</Button>
			</DialogTrigger>
			<DialogContent className="w-full sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-2xl">Update List</DialogTitle>
					<DialogDescription>Update your list</DialogDescription>
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
										<Input type="text" {...field} />
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
								Update List
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
