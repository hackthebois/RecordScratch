import { Input } from "@/components/ui/Input";
import { AtSign } from "lucide-react";

const Page = () => {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-4">
			<h1>Create Handle</h1>
			<p className="text-muted-foreground">
				To complete the sign up you must create a handle
			</p>
			<div className="relative flex items-center">
				<AtSign
					className="absolute left-2 text-muted-foreground"
					size={16}
				/>
				<Input placeholder="handle" className="pl-7 lowercase" />
			</div>
		</div>
	);
};

export default Page;
