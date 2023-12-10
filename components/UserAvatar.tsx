import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";

const UserAvatar = ({
	imageUrl,
	name,
	size = 36,
}: {
	imageUrl?: string;
	name?: string;
	size?: number;
}) => {
	return (
		<Avatar
			style={{
				width: size,
				height: size,
			}}
		>
			<AvatarImage asChild src={imageUrl}>
				{imageUrl && (
					<Image
						src={imageUrl}
						alt="Profile photo"
						width={size}
						height={size}
						className="object-cover"
					/>
				)}
			</AvatarImage>
			<AvatarFallback
				style={{
					fontSize: size / 2,
				}}
			>
				{name && name[0] && name[0].toUpperCase()}
			</AvatarFallback>
		</Avatar>
	);
};

export default UserAvatar;
