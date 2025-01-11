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
import { Stack, useLocalSearchParams } from "expo-router";
import { api } from "@/lib/api";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

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
	const top = useSharedValue((item.position - 1) * 60);
	const gestureHandler = Gesture.Pan()
		.onStart(() => {
			setMoving(true); // Mark the current item as active
		})
		.onUpdate((event) => {
			const positionY = event.x + scrollY.value;

			top.value = withTiming(positionY, { duration: 16 });
			console.log(
				"absoluteY:",
				event.absoluteY.toFixed(0),
				"scrollY:",
				scrollY.value.toFixed(0),
				"positionY:",
				positionY.toFixed(0)
			);
		})
		.onEnd(() => {
			setMoving(false); // Reset active state on gesture end
		})
		.runOnJS(true);
	const animatedStyle = useAnimatedStyle(() => ({
		position: "absolute",
		left: 5,
		top: top.value,
		shadowColor: "black",
		zIndex: moving ? 1 : 0,
		shadowOffset: { height: 0, width: 0 },
		shadowOpacity: withSpring(moving ? 1 : 0),
		shadowRadius: moving ? 10 : 0,
		flexDirection: "row",
		backgroundColor: moving ? "white" : "",
		borderRadius: 10,
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
							className="min-w-72"
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
			<Stack.Screen
				options={{
					title: `${list?.name}`,
				}}
			/>
			<SafeAreaView style={{ flex: 1 }}>
				<Animated.ScrollView
					onScroll={handleScroll}
					scrollEventThrottle={16}
					style={{ flex: 1, position: "relative" }}
				>
					{listItems.map((item, index) => (
						<AnimatedResource
							key={index}
							index={index}
							item={item}
							category={list!.category}
							scrollY={scrollY}
						/>
					))}
				</Animated.ScrollView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};
export default ListRearrangeModal;

// 10.0.0.141:8081
