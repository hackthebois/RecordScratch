import NotFoundScreen from "@/app/+not-found";
import ListOfLists from "@/components/List/ListOfLists";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { SquarePlus } from "@/lib/icons/IconsLoader";
import { useAuth } from "@/lib/auth";

const CreateListButton = ({ isProfile }: { isProfile: boolean }) => {
	return (
		isProfile && (
			<Link asChild href="/(modals)/createList">
				<Button variant="outline" className=" flex items-center flex-row my-2 gap-3">
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

	if (!profile) return <NotFoundScreen />;

	const [lists] = api.lists.getUser.useSuspenseQuery({
		userId: profile.userId,
	});

	return (
		<View>
			<Stack.Screen options={{ title: `${profile.handle}'s Lists` }} />

			<ListOfLists
				HeaderComponent={<CreateListButton isProfile={isProfile} />}
				lists={lists}
				orientation="vertical"
			/>
		</View>
	);
};

export default AllListsPage;
