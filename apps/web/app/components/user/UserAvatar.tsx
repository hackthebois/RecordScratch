import { cn } from "@recordscratch/lib";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";

export const UserAvatar = ({
	imageUrl,
	className,
}: {
	imageUrl?: string;
	className?: string;
}) => {
	return (
		<Avatar className={cn(className ? className : "h-auto sm:w-16")}>
			<AvatarImage src={imageUrl ?? ""} />
			<AvatarFallback>
				<User className="h-[60%] w-[60%] text-muted-foreground" />
			</AvatarFallback>
		</Avatar>
	);
};
