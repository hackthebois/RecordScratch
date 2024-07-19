import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { api } from "#/utils/api";
import NotFoundScreen from "../../+not-found";
import { AntDesign } from "@expo/vector-icons";
import { useColorScheme } from "#/utils/useColorScheme";
import Metadata from "#/components/Metadata";
import { timeAgo } from "@recordscratch/lib";
import { getImageUrl } from "#/utils/image";
import { Text } from "#/components/CoreComponents/Text";
import { UserAvatar } from "#/components/UserAvatar";
import ListImage from "#/components/List/ListImage";
import ListResources from "#/components/List/ListResources";

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
								onPress={() => router.push(`lists/${listId}/settings`)}
							>
								<AntDesign
									name="setting"
									size={30}
									color={utilsColor}
									className="mr-6"
								/>
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
