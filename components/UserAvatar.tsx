import { Profile } from "@/types/profile";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";

export const UserAvatar = ({
	imageUrl,
	name,
	size = 36,
	className,
}: {
	imageUrl: Profile["imageUrl"];
	name: Profile["name"];
	size?: number;
	className?: string;
}) => {
	return (
		<Avatar
			className={className}
			style={{
				width: size,
				height: size,
			}}
		>
			<AvatarImage asChild src={imageUrl ?? undefined}>
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
				{name && name[0] ? name[0].toUpperCase() : "U"}
			</AvatarFallback>
		</Avatar>
	);
};
