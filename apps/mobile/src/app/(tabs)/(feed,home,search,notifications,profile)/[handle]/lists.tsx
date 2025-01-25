import NotFoundScreen from "@/app/+not-found";
import ListOfLists from "@/components/List/ListOfLists";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Link, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { SquarePlus } from "@/lib/icons/IconsLoader";

const AllListsPage = () => {
	const { handle } = useLocalSearchParams<{ handle: string }>();

	const [profile] = api.profiles.get.useSuspenseQuery(handle);

	if (!profile) return <NotFoundScreen />;

	const [lists] = api.lists.getUser.useSuspenseQuery({
		userId: profile.userId,
	});

	return (
		<View>
			<Link asChild href="/(modals)/createList">
				<Button variant="outline" className=" flex items-center flex-row my-5 gap-3">
					<SquarePlus />
					<Text>Create List</Text>
				</Button>
			</Link>
			<ListOfLists lists={lists} orientation="vertical" size={100} />
		</View>
	);
};

export default AllListsPage;
