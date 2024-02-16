import { Profile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";

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
		<Avatar
			className={className}
			style={{
				width: size,
				height: size,
			}}
		>
			<AvatarImage asChild src={imageUrl ?? undefined}>
				{imageUrl && (
					<img
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
				{"U"}
			</AvatarFallback>
		</Avatar>
	);
};
