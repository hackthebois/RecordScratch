import { ArtistItem } from "@/components/Item/ArtistItem";
import { ResourceItem } from "@/components/Item/ResourceItem";
import { Category, ListItem, ListWithResources, UserListItem } from "@recordscratch/types";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
	cancelAnimation,
	scrollTo,
	runOnJS,
	SharedValue,
	useAnimatedReaction,
	useAnimatedRef,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
	useAnimatedProps,
} from "react-native-reanimated";
import { useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { api } from "@/lib/api";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AlignJustify } from "@/lib/icons/IconsLoader";
import { useWindowDimensions, View } from "react-native";
import AnimateableText from "react-native-animateable-text";
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
	const moving = useSharedValue<boolean>(false);
	const position = useSharedValue<string>(resources.value[item.resourceId].position.toString());
	const top = useSharedValue<number>(
		(resources.value[item.resourceId].position - 1) * SONG_HEIGHT
	);
	const dimensions = useWindowDimensions();
	const insets = useSafeAreaInsets();

	useAnimatedReaction(
		() => resources.value[item.resourceId].position,
		(currentPosition, previousPosition) => {
			if (currentPosition !== previousPosition)
				if (!moving.value) {
					top.value = withSpring((currentPosition - 1) * SONG_HEIGHT);
					position.set(currentPosition.toString());
				}
		},
		[moving.value, position.value]
	);

	const panHandler = Gesture.Pan()
		.runOnJS(true)
		.onStart(() => {
			moving.set(true);
		})
		.onUpdate((event) => {
			const positionY = event.absoluteY + scrollY.value;

			if (positionY <= scrollY.value + SONG_HEIGHT) {
				// scroll up
				scrollY.value = withTiming(0, { duration: 1500 });
			} else if (positionY >= scrollY.value + dimensions.height - SONG_HEIGHT) {
				// scroll down
				const contentHeight = resourcesCount * SONG_HEIGHT;
				const containerHeight = dimensions.height - insets.top - insets.bottom;
				const maxScroll = contentHeight - containerHeight;
				scrollY.value = withTiming(maxScroll, { duration: 1500 });
			} else {
				cancelAnimation(scrollY);
			}

			top.value = withTiming(positionY - SONG_HEIGHT * 2.5, { duration: 16 });

			const newPosition = clamp(Math.floor(positionY / SONG_HEIGHT), 0, resourcesCount);

			if (newPosition !== resources.value[item.resourceId].position) {
				resources.set(
					objectMove(
						resources.value,
						resources.value[item.resourceId].position,
						newPosition
					)
				);
				position.set(newPosition.toString());
			}
		})
		.onEnd(() => {
			top.value = withSpring((resources.value[item.resourceId].position - 1) * SONG_HEIGHT);
			moving.set(false);
		})
		.hitSlop({ right: 0, width: 60 });

	const animatedStyle = useAnimatedStyle(() => ({
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
	}));

	return (
		<GestureDetector gesture={panHandler}>
			<Animated.View style={animatedStyle}>
				<ReText text={position} style={{ fontSize: 14, marginRight: -15, marginLeft: 0 }} />
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
						className=" min-w-80"
					/>
				)}

				<AlignJustify className="text-foreground" style={{ marginRight: 20 }} />
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
	const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

	useAnimatedReaction(
		() => scrollY.value,
		(scrolling) => {
			scrollTo(scrollViewRef, 0, scrolling, false);
		}
	);

	const handleScroll = useAnimatedScrollHandler((event) => {
		scrollY.value = event.contentOffset.y;
	});

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<SafeAreaView style={{ flex: 1 }}>
					<Stack.Screen
						options={{
							title: `${list?.name}`,
						}}
					/>
					<Animated.ScrollView
						ref={scrollViewRef}
						onScroll={handleScroll}
						scrollEventThrottle={16}
						nestedScrollEnabled={true}
						style={{ flex: 1, position: "relative" }}
						contentContainerStyle={{ height: (listItems.length + 1) * SONG_HEIGHT }}
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
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
};
export default ListRearrangeModal;
