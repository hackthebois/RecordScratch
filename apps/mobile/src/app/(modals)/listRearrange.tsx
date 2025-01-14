import { ArtistItem } from "@/components/Item/ArtistItem";
import { ResourceItem } from "@/components/Item/ResourceItem";
import { Category, ListItem, ListWithResources, UserListItem } from "@recordscratch/types";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
	runOnJS,
	SharedValue,
	useAnimatedReaction,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { useMemo, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { api } from "@/lib/api";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AlignJustify } from "@/lib/icons/IconsLoader";

function clamp(value: number, lowerBound: number, upperBound: number) {
	"worklet";
	return Math.max(lowerBound, Math.min(value, upperBound));
}
function objectMove(resources: Record<string, ListItem>, from: number, to: number) {
	"worklet";
	const newResources: Record<string, ListItem> = Object.assign({}, resources);
	for (const id in resources) {
		if (resources[id].position === from) {
			newResources[id].position = to;
		} else if (resources[id].position === to) {
			newResources[id].position = from;
		}
	}
	return newResources;
}

const AnimatedResource = ({
	item,
	category,
	scrollY,
	resources,
	resourcesCount,
}: {
	item: ListItem;
	category: Category;
	scrollY: SharedValue<number>;
	resources: SharedValue<Record<string, ListItem>>;
	resourcesCount: number;
}) => {
	const SONG_HEIGHT = 70;
	const [moving, setMoving] = useState(false);
	const [position, setPosition] = useState(resources.value[item.resourceId].position);
	const top = useSharedValue<number>(
		(resources.value[item.resourceId].position - 1) * SONG_HEIGHT
	);

	useAnimatedReaction(
		() => resources.value[item.resourceId].position,
		(currentPosition, previousPosition) => {
			if (currentPosition !== previousPosition)
				if (!moving) {
					top.value = withSpring((currentPosition - 1) * SONG_HEIGHT);
					runOnJS(setPosition)(currentPosition);
				}
		},
		[moving]
	);

	const gestureHandler = Gesture.Pan()
		.runOnJS(true)
		.onStart(() => {
			setMoving(true);
		})
		.onUpdate((event) => {
			const positionY = event.absoluteY + scrollY.value;

			top.value = withTiming(positionY - SONG_HEIGHT * 2.5, { duration: 32 });

			const newPosition = clamp(Math.floor(positionY / SONG_HEIGHT), 0, resourcesCount);

			if (newPosition !== resources.value[item.resourceId].position) {
				resources.set(
					objectMove(
						resources.value,
						resources.value[item.resourceId].position,
						newPosition
					)
				);
				setPosition(newPosition);
			}
		})
		.onEnd(() => {
			top.value = withSpring((resources.value[item.resourceId].position - 1) * SONG_HEIGHT);
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
					{position}
				</Animated.Text>
				{category === "ARTIST" ? (
					<ArtistItem
						artistId={item.resourceId}
						imageWidthAndHeight={SONG_HEIGHT - 10}
						showLink={false}
					/>
				) : (
					<ResourceItem
						resource={{
							parentId: item.parentId!,
							resourceId: item.resourceId,
							category: category,
						}}
						imageWidthAndHeight={SONG_HEIGHT - 10}
						titleCss="font-medium"
						showArtist={false}
						showLink={false}
						className="min-w-96"
					/>
				)}
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
	const map = listItems.reduce<Record<string, ListItem>>((map, obj) => {
		map[obj.resourceId] = obj;
		return map;
	}, {});
	const resources = useSharedValue(map);

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
						style={{ flex: 1, position: "relative" }}
						contentContainerStyle={{ flexGrow: 1 }}
					>
						{listItems.map((item, index) => (
							<AnimatedResource
								key={index}
								item={item}
								category={list!.category}
								scrollY={scrollY}
								resources={resources}
								resourcesCount={listItems.length}
							/>
						))}
					</Animated.ScrollView>
				</GestureHandlerRootView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};
export default ListRearrangeModal;
