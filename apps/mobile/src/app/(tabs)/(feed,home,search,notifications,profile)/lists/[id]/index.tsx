import NotFoundScreen from "@/app/+not-found";
import ListImage from "@/components/List/ListImage";
import ListResources from "@/components/List/ListResources";
import Metadata from "@/components/Metadata";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ListPlus, Pencil, Settings } from "@/lib/icons/IconsLoader";
import { getImageUrl } from "@/lib/image";
import { timeAgo } from "@recordscratch/lib";
import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import { ScrollView, TouchableOpacity, useWindowDimensions, View } from "react-native";

const ListPage = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const listId = id!;

	const [list] = api.lists.get.useSuspenseQuery({ id: listId });

	if (!list) return <NotFoundScreen />;

	const profile = useAuth((s) => s.profile);
	const userProfile = profile!;
	const isProfile = userProfile.userId === list?.userId;

	const [listItems] = api.lists.resources.get.useSuspenseQuery({
		listId,
		userId: list!.userId,
	});
	const dimensions = useWindowDimensions();

	return (
		<ScrollView className="flex flex-col gap-6">
			<Stack.Screen
				options={{
					title: "",
					headerRight: () =>
						isProfile ? (
							<Link
								href={{ pathname: "/lists/[id]/settings", params: { id: listId } }}
								asChild
							>
								<TouchableOpacity>
									<Settings size={22} className="mr-6 text-foreground" />
								</TouchableOpacity>
							</Link>
						) : null,
				}}
			/>
			<Metadata
				title={list.name}
				type={`${list.category} list`}
				cover={<ListImage listItems={listItems} category={list.category} size={200} />}
				size="sm"
			>
				<View className="flex flex-row items-center gap-2">
					<Link
						href={{
							pathname: "/[handle]",
							params: {
								handle: String(userProfile.handle),
							},
						}}
					>
						<View className="flex flex-row items-center gap-2">
							<UserAvatar imageUrl={getImageUrl(userProfile)} />
							<Text className="flex text-lg">{userProfile.name}</Text>
						</View>
					</Link>
					<Text className="text-muted-foreground">• {timeAgo(list.updatedAt)}</Text>
				</View>
			</Metadata>
			<View className="flex flex-row my-4 justify-around">
				<Link
					href={{
						pathname: "/(modals)/searchResource",
						params: {
							listId,
							category: list.category,
							isTopList: list.onProfile.toString(),
						},
					}}
					asChild
				>
					<Button variant="outline" style={{ width: dimensions.width / 2 - 10 }}>
						<ListPlus />
					</Button>
				</Link>
				<Link
					href={{
						pathname: "/(modals)/listRearrange",
						params: {
							listId,
						},
					}}
					asChild
				>
					<Button variant="outline" style={{ width: dimensions.width / 2 - 10 }}>
						<Pencil />
					</Button>
				</Link>
			</View>
			<ListResources items={listItems} category={list.category} />
		</ScrollView>
	);
};

export default ListPage;
