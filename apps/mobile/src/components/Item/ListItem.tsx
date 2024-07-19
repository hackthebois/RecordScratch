import { getImageUrl } from "#/utils/image";
import { ListsType } from "@recordscratch/types";
import { Link } from "expo-router";
import { UserAvatar } from "#/components/UserAvatar";
import { View } from "react-native";
import { Text } from "#/components/CoreComponents/Text";
import ListImage from "#/components/List/ListImage";

const ListsItem = ({
	listsItem,
	size = 175,
	showProfile = false,
	onClick,
}: {
	listsItem: ListsType;
	showProfile?: boolean;
	size?: number;
	onClick?: (_listId: string) => void;
}) => {
	if (!listsItem.id || !listsItem.profile) return null;
	const profile = listsItem.profile;
	const listResources = listsItem.resources;

	const ListItemContent = (
		<View className="flex flex-col justify-center" style={{ width: size }}>
			<View className="flex items-center justify-center">
				<ListImage listItems={listResources} category={listsItem.category} size={size} />
			</View>
			<Text className="truncate pl-1 pt-1 text-center line-clamp-2" variant="h3">
				{listsItem.name}
			</Text>
		</View>
	);

	const link = `/lists/${String(listsItem.id)}`;

	return (
		<View
			className="flex flex-col gap-96"
			style={{
				width: size,
			}}
		>
			<Link href={link} className="flex w-full cursor-pointer flex-col">
				{ListItemContent}
			</Link>

			{showProfile && (
				<Link href={`/${String(profile.handle)}`}>
					<View className="flex flex-row space-x-1 py-1 text-sm text-muted-foreground hover:underline">
						<UserAvatar imageUrl={getImageUrl(profile)} className="h-8 w-8" />
						<Text className="flex">{profile.name}</Text>
					</View>
				</Link>
			)}
		</View>
	);
};

export default ListsItem;
