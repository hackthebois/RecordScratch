import NotFoundScreen from "#/app/+not-found";
import { timeAgo } from "@recordscratch/lib";
import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
import ListImage from "~/components/List/ListImage";
import ListResources from "~/components/List/ListResources";
import Metadata from "~/components/Metadata";
import { UserAvatar } from "~/components/UserAvatar";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { Settings } from "~/lib/icons/Settings";
import { getImageUrl } from "~/lib/image";
import { useColorScheme } from "~/lib/useColorScheme";

const ListPage = () => {
	const { utilsColor } = useColorScheme();
	const { id } = useLocalSearchParams<{ id: string }>();
	const listId = id!;

	const [list] = api.lists.get.useSuspenseQuery({ id: listId });
	const [profile] = api.profiles.me.useSuspenseQuery();

	if (!list) return <NotFoundScreen />;

	const userProfile = profile!;
	const isProfile = userProfile.userId === list?.userId;

	const [listItems] = api.lists.resources.get.useSuspenseQuery({
		listId,
		userId: list!.userId,
	});

	return (
		<ScrollView className="flex flex-col gap-6">
			<Stack.Screen
				options={{
					headerTitle: "",
					headerRight: () =>
						isProfile ? (
							<TouchableOpacity
								onPress={() => router.navigate(`lists/${listId}/settings`)}
							>
								<Settings size={30} className="mr-6 text-foreground" />
							</TouchableOpacity>
						) : null,
				}}
			/>
			<Metadata
				title={list.name}
				type={`${list.category} list`}
				cover={<ListImage listItems={listItems} category={list.category} size={250} />}
				size="sm"
			>
				<View className="flex flex-row items-center gap-2">
					<Link
						href={{
							pathname: "/[id]",
							params: {
								id: String(userProfile.handle),
							},
						}}
					>
						<View className="flex flex-row items-center gap-2 w-full">
							<UserAvatar imageUrl={getImageUrl(userProfile)} size={40} />
							<Text className="flex text-lg">{userProfile.name}</Text>
						</View>
					</Link>
					<Text className="text-muted-foreground">• {timeAgo(list.updatedAt)}</Text>
				</View>
			</Metadata>
			<ListResources items={listItems} category={list.category} />
		</ScrollView>
	);
};

export default ListPage;
