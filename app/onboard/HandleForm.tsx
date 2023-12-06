"use client";

import { Button } from "@/components/ui/Button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { HandleSchema } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const HandleFormSchema = z.object({
	handle: HandleSchema,
});
type HandleForm = z.infer<typeof HandleFormSchema>;

const HandleForm = () => {
	const form = useForm<HandleForm>({
		resolver: zodResolver(HandleFormSchema),
		mode: "onChange",
	});

	const onSubmit = async (values: HandleForm) => {
		console.log(values);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3">
				<FormField
					control={form.control}
					name="handle"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="relative flex items-center">
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
				<Button type="submit">Create</Button>
			</form>
		</Form>
	);
};

export default HandleForm;
