import { Avatar } from "react-native-ui-lib";
export const UserAvatar = ({ imageUrl, className }: { imageUrl?: string; className?: string }) => {
	return <Avatar source={imageUrl} size={100} />;
};

// <Avatar className={cn(className ? className : "h-auto sm:w-16")}>
// 	<AvatarImage src={imageUrl ?? ""} />
// 	<AvatarFallback>
// 		<User className="h-[60%] w-[60%] text-muted-foreground" />
// 	</AvatarFallback>
// </Avatar>
