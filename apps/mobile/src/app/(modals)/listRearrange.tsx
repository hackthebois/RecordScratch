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
	useDerivedValue,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { Stack, useLocalSearchParams } from "expo-router";
import { api } from "@/lib/api";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AlignJustify, Trash2 } from "@/lib/icons/IconsLoader";
import { useWindowDimensions } from "react-native";
import ReText from "@/components/ui/retext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@recordscratch/lib";

const SONG_HEIGHT = 70;

function clamp(value: number, lowerBound: number, upperBound: number) {
	"worklet";
	return Math.max(lowerBound, Math.min(value, upperBound));
}
function objectMove(resources: Record<string, number>, from: number, to: number) {
	"worklet";
	const newResources: Record<string, number> = { ...resources };
	for (const id in resources) {
		if (resources[id] === from) {
			newResources[id] = to;
		} else if (resources[id] === to) {
			newResources[id] = from;
		}
	}
	return newResources;
}
// function objectDelete(resources: Record<string, number>, resourceId: string) {
// 	"worklet";
// 	const newResources: Record<string, number> = {};
// 	const positionToDelete = resources[resourceId];
// 	for (const id in resources) {
// 		if (id !== resourceId) {
// 			const currentItem = resources[id];
// 			newResources[id] = currentItem > positionToDelete ? currentItem - 1 : currentItem;
// 		}
// 	}

// 	return newResources;
// }

function setMap(resources: ListItem[]) {
	"worklet";
	return resources.reduce<Record<string, number>>(
		(map: { [resourceId: string]: number }, obj: ListItem) => {
			map[obj.resourceId] = obj.position;
			return map;
		},
		{}
	);
}

export const DeleteButton = ({
	onPress,
	className,
}: {
	className?: string;
	onPress: () => void;
}) => {
	return (
		<Button
			className={cn("size-9", className)}
			onPress={onPress}
			variant="destructive"
			size="icon"
		>
			<Trash2 size={18} />
		</Button>
	);
};

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
	scrollY,
	resourcesSharedMap,
	resourcesCount,
	deleteResource,
	contentHeight,
	containerHeight,
	screenHeight,
}: {
	item: ListItem;
	category: Category;
	scrollY: SharedValue<number>;
	resourcesSharedMap: SharedValue<Record<string, number>>;
	resourcesCount: number;
	deleteResource: (resourceId: string) => void;
	containerHeight: number;
	contentHeight: number;
	screenHeight: number;
}) => {
	const moving = useSharedValue<boolean>(false);
	const position = useSharedValue<string>(resourcesSharedMap.value[item.resourceId].toString());
	const top = useSharedValue<number>(
		(resourcesSharedMap.value[item.resourceId] - 1) * SONG_HEIGHT
	);

	useAnimatedReaction(
		() => resourcesSharedMap.value[item.resourceId],
		(currentPosition, previousPosition) => {
			if (currentPosition && currentPosition !== previousPosition)
				if (!moving.value) {
					top.value = withSpring((currentPosition - 1) * SONG_HEIGHT);
					position.value = currentPosition.toString();
				}
		},
		[moving]
	);

	const panHandler = Gesture.Pan()
		.runOnJS(true)
		.onStart(() => {
			moving.value = true;
		})
		.onUpdate((event) => {
			const positionY = event.absoluteY + scrollY.value;

			top.value = withTiming(
				clamp(positionY - SONG_HEIGHT * 2, 0, contentHeight - SONG_HEIGHT),
				{
					duration: 32,
				}
			);

			const newPosition = clamp(Math.floor(positionY / SONG_HEIGHT), 1, resourcesCount);

			if (newPosition !== resourcesSharedMap.value[item.resourceId]) {
				resourcesSharedMap.value = objectMove(
					resourcesSharedMap.value,
					resourcesSharedMap.value[item.resourceId],
					newPosition
				);

				position.value = newPosition.toString();
			}
		})
		.onEnd(() => {
			top.value = withSpring((resourcesSharedMap.value[item.resourceId] - 1) * SONG_HEIGHT);
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
			visibility: "false",
		}),
		[moving]
	);

	return (
		<GestureDetector gesture={panHandler}>
			<Animated.View style={animatedStyle}>
				<ReText text={position} style={{ fontSize: 14, marginRight: 0, marginLeft: 0 }} />
				<Resource
					resourceId={item.resourceId}
					parentId={item.parentId}
					category={category}
				/>
				<DeleteButton
					onPress={() => {
						deleteResource(item.resourceId);
					}}
				/>
				<AlignJustify className="text-foreground" style={{ marginRight: 20 }} />
			</Animated.View>
		</GestureDetector>
	);
};

const SortableList = ({ resources, category }: { resources: ListItem[]; category: Category }) => {
	const [resourcesState, setResourcesState] = useState<ListItem[]>(resources);
	const scrollY = useSharedValue(0);
	const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
	const dimensions = useWindowDimensions();
	const insets = useSafeAreaInsets();

	const handleScroll = useAnimatedScrollHandler((event) => {
		scrollY.value = event.contentOffset.y;
	});

	const containerHeight = dimensions.height - insets.top - insets.bottom;
	const contentHeight = resourcesState.length * SONG_HEIGHT;

	const resourcesSharedMap = useDerivedValue(() => {
		const derived = setMap(resourcesState);
		console.log("derived: ", derived);
		return derived;
	}, [resourcesState]);

	const deleteResource = (resourceId: string) => {
		setResourcesState((prevResources) => {
			const removedResourcePosition = resourcesSharedMap.value[resourceId];

			// Filter out the resource to be removed and adjust positions
			const updatedResources = prevResources.filter((item) => item.resourceId != resourceId);

			return updatedResources.map((resource) => ({
				...resource,
				position:
					resourcesSharedMap.value[resource.resourceId] >= removedResourcePosition
						? resourcesSharedMap.value[resource.resourceId] - 1 // Shift positions lower for resources after the removed one
						: resourcesSharedMap.value[resource.resourceId],
			}));
		});
	};

	return (
		<Animated.ScrollView
			ref={scrollViewRef}
			onScroll={handleScroll}
			scrollEventThrottle={16}
			nestedScrollEnabled={true}
			style={{ flex: 1, position: "relative" }}
			contentContainerStyle={{ height: contentHeight }}
		>
			{resourcesState.map((item) => (
				<AnimatedResource
					key={item.resourceId}
					item={item}
					category={category}
					deleteResource={deleteResource}
					resourcesSharedMap={resourcesSharedMap}
					resourcesCount={resourcesState.length}
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

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<SafeAreaView style={{ flex: 1 }}>
					<Stack.Screen
						options={{
							title: `${list?.name}`,
						}}
					/>
					<SortableList resources={listItems} category={list!.category} />
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
};
export default ListRearrangeModal;
