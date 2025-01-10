import { ArtistItem } from "@/components/Item/ArtistItem";
import { ResourceItem } from "@/components/Item/ResourceItem";
import { Category, ListItem } from "@recordscratch/types";
import { ScrollView, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	SharedValue,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/lib/api";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";

const AnimatedResource = ({
	index,
	item,
	category,
	scrollY,
}: {
	index: number;
	item: ListItem;
	category: Category;
	scrollY: SharedValue<number>;
}) => {
	const [moving, setMoving] = useState(false);
	const top = useSharedValue(item.position * 60);
	const gestureHandler = Gesture.Pan()
		.onStart(() => {
			setMoving(true); // Mark the current item as active
		})
		.onUpdate((event) => {
			const positionY = event.absoluteY + scrollY.value;

			top.value = withTiming(positionY - 300, { duration: 16 });
		})
		.onEnd(() => {
			setMoving(false); // Reset active state on gesture end
		})
		.runOnJS(true);
	const animatedStyle = useAnimatedStyle(() => ({
		left: 5,
		marginRight: 20,
		top: top.value,
		shadowColor: "black",
		zIndex: moving ? 1 : 0,
		shadowOffset: { height: 0, width: 0 },
		shadowOpacity: withSpring(moving ? 1 : 0),
		shadowRadius: moving ? 10 : 0,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: moving ? "white" : "",
		borderRadius: 10,
		width: "80%",
	}));
	return (
		<View style={{ flexDirection: "row", alignItems: "center" }}>
			<GestureDetector gesture={gestureHandler}>
				<Animated.View style={animatedStyle}>
					<Animated.Text
						style={{ fontSize: 12, marginLeft: 15 }}
						className="text-muted-foreground font-bold w-6"
					>
						{index + 1}
					</Animated.Text>
					{category === "ARTIST" ? (
						<ArtistItem
							artistId={item.resourceId}
							imageWidthAndHeight={75}
							showLink={false}
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
							showLink={false}
							className="min-w-72 min-h-24"
						/>
					)}
				</Animated.View>
			</GestureDetector>
		</View>
	);
};
const ListRearrangeModal = () => {
	// const router = useRouter();
	const { listId } = useLocalSearchParams<{ listId: string }>();
	const [list] = api.lists.get.useSuspenseQuery({ id: listId });
	const [listItems] = api.lists.resources.get.useSuspenseQuery({
		listId,
		userId: list!.userId,
	});

	const scrollY = useSharedValue(0);
	const handleScroll = useAnimatedScrollHandler((event) => {
		scrollY.value = event.contentOffset.y;
	});

	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1 }}>
				<Text variant={"h4"}>Scroll Value: {scrollY.value}</Text>
				<Animated.ScrollView className="flex flex-col" onScroll={handleScroll}>
					<View className="flex flex-col w-full h-full">
						{listItems.map((item, index) => (
							<AnimatedResource
								key={index}
								index={index}
								item={item}
								category={list!.category}
								scrollY={scrollY}
							/>
						))}
					</View>
				</Animated.ScrollView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};
export default ListRearrangeModal;
