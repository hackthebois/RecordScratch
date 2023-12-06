import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { AtSign } from "lucide-react";
import { useForm } from "react-hook-form";

type Props = {};

const HandleForm = ({}: Props) => {
	const form = useForm();

	return (
		<div className="relative flex items-center">
			<AtSign
				className="absolute left-2 text-muted-foreground"
				size={16}
			/>
			<FormField
				control={form.control}
				name="username"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Username</FormLabel>
						<FormControl>
							<Input placeholder="shadcn" {...field} />
						</FormControl>
						<FormDescription>
							This is your public display name.
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

			<Input placeholder="handle" className="pl-7 lowercase" />
		</div>
	);
};

export default HandleForm;
