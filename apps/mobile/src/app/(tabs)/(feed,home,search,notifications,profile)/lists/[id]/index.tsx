import NotFoundScreen from "@/app/+not-found";
import { ArtistItem } from "@/components/Item/ArtistItem";
import { ResourceItem } from "@/components/Item/ResourceItem";
import ListImage from "@/components/List/ListImage";
import Metadata from "@/components/Metadata";
import { RatingInfo } from "@/components/Rating/RatingInfo";
import { UserAvatar } from "@/components/UserAvatar";
import { WebWrapper } from "@/components/WebWrapper";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ListPlus, Pencil, Settings, Star } from "@/lib/icons/IconsLoader";
import { getImageUrl } from "@/lib/image";
import { cn, timeAgo } from "@recordscratch/lib";
import { Category, ListItem } from "@recordscratch/types";
import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingScrollView } from "@/components/KeyboardAvoidingView";

const ListResources = ({
	items,
	category,
}: {
	items: ListItem[] | undefined;
	category: Category;
}) => {
	return (
		<>
			{items?.map((item, index) => (
				<View key={item.resourceId} className="border-b border-muted rounded-xl w-full">
					<View className={cn("flex flex-row items-center gap-3 my-2")}>
						<Text className="text-muted-foreground font-bold w-6 text-base ml-5">
							{index + 1}
						</Text>
						{category === "ARTIST" ? (
							<ArtistItem
								artistId={item.resourceId}
								imageWidthAndHeight={60}
								className={cn(!!item.rating ? "w-72" : "w-96")}
							/>
						) : (
							<ResourceItem
								resource={{
									parentId: item.parentId!,
									resourceId: item.resourceId,
									category: category,
								}}
								imageWidthAndHeight={60}
								titleCss="font-medium"
								showArtist={false}
								className={cn(!!item.rating ? "w-72" : "w-96")}
							/>
						)}
						<RatingInfo
							initialRating={{
								resourceId: item.resourceId,
								average: item.rating ? String(item.rating) : null,
								total: 1,
							}}
							resource={{
								parentId: item.parentId!,
								resourceId: item.resourceId,
								category: category,
							}}
							size="sm"
						/>
					</View>
				</View>
			))}
		</>
	);
};

const ListPage = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const listId = id!;

	const [list] = api.lists.get.useSuspenseQuery({ id: listId });

	if (!list) return <NotFoundScreen />;

	const profile = useAuth((s) => s.profile!);
	const isProfile = profile.userId === list?.userId;

	const [listItems] = api.lists.resources.get.useSuspenseQuery({
		listId,
		userId: list!.userId,
	});
	const dimensions = useWindowDimensions();

	const options =
		Platform.OS !== "web"
			? {
					title: `${list.name}`,
					headerRight: () =>
						isProfile ? (
							<Link
								href={{
									pathname: "/lists/[id]/settings",
									params: { id: listId },
								}}
								className="p-2"
							>
								<Settings size={22} className="text-foreground" />
							</Link>
						) : null,
			  }
			: {};

	return (
		<SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
			<WebWrapper>
				<KeyboardAvoidingScrollView className="flex flex-col gap-6 h-full">
					<Stack.Screen options={options} />
					<Metadata
						cover={
							<ListImage listItems={listItems} category={list!.category} size={200} />
						}
						size="sm"
					>
						<View className="flex flex-col items-center -mt-6">
							<Text>{list?.category} LIST</Text>
							<View className="flex flex-row items-center gap-2">
								<Link
									href={{
										pathname: "/[handle]",
										params: {
											handle: String(list?.profile.handle),
										},
									}}
								>
									<View className="flex flex-row items-center gap-2">
										<UserAvatar imageUrl={getImageUrl(list!.profile)} />
										<Text className="flex text-lg">{list!.profile.name}</Text>
									</View>
								</Link>
								<Text className="text-muted-foreground">
									• {timeAgo(list!.updatedAt)}
								</Text>
							</View>
						</View>
					</Metadata>
					{isProfile && (
						<View className="flex flex-row my-4 justify-around">
							<Link
								href={{
									pathname: "/(modals)/list/searchResource",
									params: {
										listId,
										category: list.category,
										isTopList: list.onProfile.toString(),
									},
								}}
								asChild
							>
								<Button
									variant="outline"
									style={{
										width: dimensions.width / 2 - 5,
										flexDirection: "row",
										gap: 15,
									}}
								>
									<Text variant="h4">Add</Text>
									<ListPlus size={22} />
								</Button>
							</Link>
							<Link
								href={{
									pathname: "/(modals)/list/rearrangeList",
									params: {
										listId,
									},
								}}
								asChild
							>
								<Button
									variant="outline"
									style={{
										width: dimensions.width / 2 - 5,
										flexDirection: "row",
										gap: 15,
									}}
								>
									<Text variant="h4">Edit</Text>
									<Pencil size={18} />
								</Button>
							</Link>
						</View>
					)}
					<ListResources items={listItems} category={list!.category} />
					{listItems?.length == 0 && isProfile && (
						<View className="flex flex-col gap-2 items-center justify-center h-56">
							<ListPlus size={30} />
							<Text variant="h4" className=" text-muted-foreground">
								Make Sure to Add to Your List
							</Text>
						</View>
					)}
				</KeyboardAvoidingScrollView>
			</WebWrapper>
		</SafeAreaView>
	);
};

export default ListPage;
