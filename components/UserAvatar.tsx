import { Profile } from "@/types/profile";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";

const UserAvatar = ({
	imageUrl,
	name,
	handle,
	size = 36,
	className,
}: {
	imageUrl: Profile["imageUrl"];
	name: Profile["name"];
	handle: Profile["handle"];
	size?: number;
	className?: string;
}) => {
	return (
		<Link href={`/${handle}`}>
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
		</Link>
	);
};

export default UserAvatar;
