import { ArtistItem } from "@/components/Item/ArtistItem";
import { ResourceItem } from "@/components/Item/ResourceItem";
import { Category, ListItem } from "@recordscratch/types";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
	SharedValue,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { useRef, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { api } from "@/lib/api";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AlignJustify } from "@/lib/icons/IconsLoader";

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
	const top = useSharedValue<number>((item.position - 1) * 60);
	const gestureHandler = Gesture.Pan()
		.runOnJS(true)
		.onStart(() => {
			setMoving(true);
		})
		.onUpdate((event) => {
			const positionY = event.absoluteY + scrollY.value;

			top.value = withTiming(positionY - 150, { duration: 16 });
		})
		.onEnd(() => {
			setMoving(false);
		});
	const animatedStyle = useAnimatedStyle(() => ({
		left: 5,
		position: "absolute",
		top: top.value,
		shadowColor: "black",
		zIndex: moving ? 1 : 0,
		shadowOpacity: withSpring(moving ? 1 : 0),
		shadowRadius: withSpring(moving ? 10 : 0),
		flexDirection: "row",
		backgroundColor: moving ? "white" : "transparent",
		borderRadius: 10,
	}));

	return (
		<GestureDetector gesture={gestureHandler}>
			<Animated.View style={animatedStyle}>
				<Animated.Text
					style={{ fontSize: 12, marginLeft: 15, marginTop: 20 }}
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
				<AlignJustify />
			</Animated.View>
		</GestureDetector>
	);
};
const ListRearrangeModal = () => {
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
				<Stack.Screen
					options={{
						title: `${list?.name}`,
					}}
				/>
				<GestureHandlerRootView>
					<Animated.ScrollView
						onScroll={handleScroll}
						scrollEventThrottle={16}
						nestedScrollEnabled={true}
						contentContainerStyle={{ flexGrow: 1 }}
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
				</GestureHandlerRootView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};
export default ListRearrangeModal;
