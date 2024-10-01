import { User } from "~/lib/icons/User";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const UserAvatar = ({ imageUrl, size }: { imageUrl?: string; size?: number }) => {
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
				<User />
			</AvatarFallback>
		</Avatar>
	);
};
