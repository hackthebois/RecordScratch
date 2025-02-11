import NotFoundScreen from "@/app/+not-found";
import ListOfLists from "@/components/List/ListOfLists";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import {
	KeyboardAvoidingView,
	Platform,
	View,
	useWindowDimensions,
} from "react-native";
import { Text } from "@/components/ui/text";
import { SquarePlus } from "@/lib/icons/IconsLoader";
import { useAuth } from "@/lib/auth";

const CreateListButton = ({ isProfile }: { isProfile: boolean }) => {
	return (
		isProfile && (
			<Link asChild href="/(modals)/list/createList">
				<Button
					variant="outline"
					className="my-2 flex flex-row items-center gap-3"
				>
					<SquarePlus />
					<Text>Create A List</Text>
				</Button>
			</Link>
		)
	);
};

const AllListsPage = () => {
	const { handle } = useLocalSearchParams<{ handle: string }>();

	const [profile] = api.profiles.get.useSuspenseQuery(handle);
	const userProfile = useAuth((s) => s.profile);
	const isProfile = profile?.userId == userProfile?.userId;
	const dimensions = useWindowDimensions();

	if (!profile) return <NotFoundScreen />;

	const [lists] = api.lists.getUser.useSuspenseQuery({
		userId: profile.userId,
	});

	return (
		<View className="flex flex-1 items-center">
			<Stack.Screen
				options={{
					title: `${isProfile ? "My" : `${profile.handle}'s`} Lists`,
				}}
			/>
			{Platform.OS === "web" && (
				<Text variant="h3">{`${isProfile ? "My" : `${profile.handle}'s`} Lists`}</Text>
			)}
			<ListOfLists
				HeaderComponent={
					Platform.OS != "web" && (
						<CreateListButton isProfile={isProfile} />
					)
				}
				lists={lists}
				orientation="vertical"
				size={Platform.OS != "web" ? dimensions.width / 3.25 : 200}
			/>
		</View>
	);
};

export default AllListsPage;
