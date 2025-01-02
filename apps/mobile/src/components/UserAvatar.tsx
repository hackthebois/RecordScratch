import { User } from "@/lib/icons/IconsLoader";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Text } from "./ui/text";

export const UserAvatar = ({ imageUrl, size = 40 }: { imageUrl?: string; size?: number }) => {
	return (
		<Avatar
			alt="Avatar"
			style={{
				width: size,
				height: size,
			}}
		>
			<AvatarImage source={{ uri: imageUrl }} />
			<AvatarFallback>
				<User size={size * 0.6} />
			</AvatarFallback>
		</Avatar>
	);
};
