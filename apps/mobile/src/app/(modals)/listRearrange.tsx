import { ArtistItem } from "@/components/Item/ArtistItem";
import { ResourceItem } from "@/components/Item/ResourceItem";
import { Category, ListItem } from "@recordscratch/types";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
	cancelAnimation,
	scrollTo,
	SharedValue,
	useAnimatedReaction,
	useAnimatedRef,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { Stack, useLocalSearchParams } from "expo-router";
import { api } from "@/lib/api";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AlignJustify } from "@/lib/icons/IconsLoader";
import { useWindowDimensions } from "react-native";
import ReText from "@/components/ui/retext";

const SONG_HEIGHT = 70;

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

const Resource = ({
	resourceId,
	parentId,
	category,
}: {
	resourceId: string;
	parentId?: string | null;
	category: Category;
}) => {
	if (category === "ARTIST")
		return (
			<ArtistItem
				artistId={resourceId}
				imageWidthAndHeight={SONG_HEIGHT - 5}
				showLink={false}
			/>
		);
	return (
		<ResourceItem
			resource={{
				parentId: parentId!,
				resourceId,
				category,
			}}
			imageWidthAndHeight={SONG_HEIGHT - 5}
			titleCss="font-medium"
			showArtist={false}
			showLink={false}
			className=" min-w-80"
		/>
	);
};

const AnimatedResource = ({
	item,
	category,
	resourcesSharedMap,
	resourcesCount,
	scrollY,
	containerHeight,
	contentHeight,
	screenHeight,
}: {
	item: ListItem;
	category: Category;
	scrollY: SharedValue<number>;
	resourcesSharedMap: SharedValue<Record<string, ListItem>>;
	resourcesCount: number;
	containerHeight: number;
	contentHeight: number;
	screenHeight: number;
}) => {
	const moving = useSharedValue<boolean>(false);
	const position = useSharedValue<string>(
		resourcesSharedMap.value[item.resourceId].position.toString()
	);
	const top = useSharedValue<number>(
		(resourcesSharedMap.value[item.resourceId].position - 1) * SONG_HEIGHT
	);
	resourcesSharedMap.value;

	useAnimatedReaction(
		() => resourcesSharedMap.value[item.resourceId].position,
		(currentPosition, previousPosition) => {
			if (currentPosition !== previousPosition)
				if (!moving.value) {
					top.value = withSpring((currentPosition - 1) * SONG_HEIGHT);
					position.value = currentPosition.toString();
				}
		},
		[moving, position]
	);

	const panHandler = Gesture.Pan()
		.runOnJS(true)
		.onStart(() => {
			moving.value = true;
		})
		.onUpdate((event) => {
			const positionY = event.absoluteY + scrollY.value;

			// if (positionY <= scrollY.value + SONG_HEIGHT) {
			// 	// scroll up
			// 	scrollY.set(withTiming(0, { duration: 200 }));
			// } else if (positionY >= scrollY.value + screenHeight - SONG_HEIGHT) {
			// 	// scroll down
			// 	const maxScroll = contentHeight - containerHeight;
			// 	scrollY.set(withTiming(maxScroll, { duration: 200 }));
			// } else {
			// 	cancelAnimation(scrollY);
			// }

			top.value = withTiming(
				clamp(positionY - SONG_HEIGHT * 2, 0, contentHeight - SONG_HEIGHT),
				{
					duration: 32,
				}
			);

			const newPosition = clamp(Math.floor(positionY / SONG_HEIGHT), 1, resourcesCount);

			if (newPosition !== resourcesSharedMap.value[item.resourceId].position) {
				resourcesSharedMap.value = objectMove(
					resourcesSharedMap.value,
					resourcesSharedMap.value[item.resourceId].position,
					newPosition
				);

				position.value = newPosition.toString();
			}
		})
		.onEnd(() => {
			top.value = withSpring(
				(resourcesSharedMap.value[item.resourceId].position - 1) * SONG_HEIGHT
			);
			moving.value = false;
		})
		.hitSlop({ right: 0, width: 60 });

	const animatedStyle = useAnimatedStyle(
		() => ({
			position: "absolute",
			top: top.value,
			shadowColor: "black",
			zIndex: moving.value ? 1 : 0,
			backgroundColor: moving.value ? "white" : "transparent",
			borderRadius: 10,
			shadowOffset: {
				height: 0,
				width: 0,
			},
			shadowOpacity: withSpring(moving ? 0.2 : 0),
			shadowRadius: 10,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-around",
			width: "100%",
		}),
		[moving]
	);

	return (
		<GestureDetector gesture={panHandler}>
			<Animated.View style={animatedStyle}>
				<ReText text={position} style={{ fontSize: 14, marginRight: -15, marginLeft: 0 }} />
				<Resource
					resourceId={item.resourceId}
					parentId={item.parentId}
					category={category}
				/>
				<AlignJustify className="text-foreground" style={{ marginRight: 20 }} />
			</Animated.View>
		</GestureDetector>
	);
};

const SortableList = ({
	resources,
	resourcesMap,
	category,
}: {
	resources: ListItem[];
	resourcesMap: Record<string, ListItem>;
	category: Category;
}) => {
	const resourcesSharedMap = useSharedValue(resourcesMap);
	const scrollY = useSharedValue(0);
	const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
	const dimensions = useWindowDimensions();
	const insets = useSafeAreaInsets();

	// useAnimatedReaction(
	// 	() => scrollY.value,
	// 	(scrolling) => {
	// 		scrollTo(scrollViewRef, 0, scrolling, false);
	// 	}
	// );

	const handleScroll = useAnimatedScrollHandler((event) => {
		scrollY.value = event.contentOffset.y;
	});

	const containerHeight = dimensions.height - insets.top - insets.bottom;
	const contentHeight = resources.length * SONG_HEIGHT;

	return (
		<Animated.ScrollView
			ref={scrollViewRef}
			onScroll={handleScroll}
			scrollEventThrottle={16}
			nestedScrollEnabled={true}
			style={{ flex: 1, position: "relative" }}
			contentContainerStyle={{ height: contentHeight }}
		>
			{resources.map((item, index) => (
				<AnimatedResource
					key={index}
					item={item}
					category={category}
					resourcesSharedMap={resourcesSharedMap}
					resourcesCount={resources.length}
					scrollY={scrollY}
					contentHeight={contentHeight}
					containerHeight={containerHeight}
					screenHeight={dimensions.height}
				/>
			))}
		</Animated.ScrollView>
	);
};

const ListRearrangeModal = () => {
	const { listId } = useLocalSearchParams<{ listId: string }>();
	const [list] = api.lists.get.useSuspenseQuery({ id: listId });
	const [listItems] = api.lists.resources.get.useSuspenseQuery({
		listId,
		userId: list!.userId,
	});
	const ListItemsMap = listItems.reduce<Record<string, ListItem>>((map, obj) => {
		map[obj.resourceId] = obj;
		return map;
	}, {});

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<SafeAreaView style={{ flex: 1 }}>
					<Stack.Screen
						options={{
							title: `${list?.name}`,
						}}
					/>
					<SortableList
						resources={listItems}
						resourcesMap={ListItemsMap}
						category={list!.category}
					/>
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
};
export default ListRearrangeModal;
