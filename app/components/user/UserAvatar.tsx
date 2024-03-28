import { Profile } from "@/types/profile";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { cn } from "@/utils/utils";

export const UserAvatar = ({
	imageUrl,
	size = 36,
	className,
}: {
	imageUrl: Profile["imageUrl"];
	size?: number;
	className?: string;
}) => {
	return (
		<Avatar className={cn(className ? className : "h-auto sm:w-16")}>
			<AvatarImage src={imageUrl ?? undefined} />
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
