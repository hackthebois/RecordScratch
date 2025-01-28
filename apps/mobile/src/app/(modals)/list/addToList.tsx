import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { View, useWindowDimensions } from "react-native";
import ListOfList from "@/components/List/ListOfLists";
import { Link, useLocalSearchParams } from "expo-router";
import { Category } from "@recordscratch/types";
import { Button } from "@/components/ui/button";
import { SquarePlus } from "@/lib/icons/IconsLoader";
import { Text } from "@/components/ui/text";

const AddToListModal = () => {
	const { resourceId, parentId, category } = useLocalSearchParams<{
		resourceId: string;
		parentId?: string;
		category: string;
	}>();
	if (!resourceId || !(category as Category)) return null;
	const profile = useAuth((s) => s.profile);
	const [lists] = api.lists.getUser.useSuspenseQuery({
		userId: profile!.userId,
		category: category as Category,
	});

	const utils = api.useUtils();
	const { mutate } = api.lists.resources.create.useMutation({
		onSettled: (_data, _error, variables) => {
			if (variables) {
				utils.lists.resources.get.invalidate({
					listId: variables.listId,
				});
			}
			utils.lists.getUser.invalidate({
				userId: profile!.userId,
				category: category as Category,
			});
		},
	});

	const dimensions = useWindowDimensions();

	return (
		<View>
			<ListOfList
				lists={lists}
				orientation="vertical"
				onPress={(listId: string) => {
					mutate({
						resourceId,
						parentId,
						listId,
					});
				}}
				showLink={false}
				size={160}
				LastItemComponent={
					<>
						<Link
							asChild
							href={{
								pathname: "/(modals)/list/createList",
								params: { categoryProp: category },
							}}
						>
							<Button
								variant="outline"
								className=" flex items-center justify-center flex-col gap-1 rounded-2xl"
								style={{
									width: dimensions.width / 3.25,
									height: dimensions.width / 3.25,
									maxHeight: dimensions.width / 3.25,
									maxWidth: dimensions.width / 3.25,
								}}
							>
								<SquarePlus className="mt-6" />
								<Text className=" text-center">Create a List</Text>
							</Button>
						</Link>
						{!lists?.length && (
							<View className="items-center justify-center mt-40 w-full">
								<Text variant="h3" className="text-muted-foreground capitalize">
									Make sure to create a list first
								</Text>
							</View>
						)}
					</>
				}
			/>
		</View>
	);
};

export default AddToListModal;
