import { cn } from "@/utils/utils";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";

export const UserAvatar = ({
	imageUrl,
	size = 36,
	className,
}: {
	imageUrl?: string;
	size?: number;
	className?: string;
}) => {
	return (
		<Avatar className={cn(className ? className : "h-auto sm:w-16")}>
			<AvatarImage src={imageUrl} />
			<AvatarFallback
				style={{
					fontSize: size / 2,
				}}
			>
				<User size={size / 1.8} className="text-muted-foreground" />
			</AvatarFallback>
		</Avatar>
	);
};
