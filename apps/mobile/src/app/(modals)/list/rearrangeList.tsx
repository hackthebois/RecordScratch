import { ArtistItem } from "@/components/Item/ArtistItem";
import { ResourceItem } from "@/components/Item/ResourceItem";
import { Category, ListItem } from "@recordscratch/types";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
	cancelAnimation,
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
import { Stack, router, useLocalSearchParams, useRouter } from "expo-router";
import { api } from "@/lib/api";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AlignJustify, ChevronLeft, Save, Trash2 } from "@/lib/icons/IconsLoader";
import { TouchableOpacity, View, Pressable } from "react-native";
import ReText from "@/components/ui/retext";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/lib/useColorScheme";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import color from "color";

const SONG_HEIGHT = 70;
const MARGIN_TOP_OFFSET = 20;

function clamp(value: number, lowerBound: number, upperBound: number) {
	"worklet";
	return Math.max(lowerBound, Math.min(value, upperBound));
}
function objectMove(positions: Record<string, number>, from: number, to: number) {
	"worklet";
	const newPositions: Record<string, number> = { ...positions };
	for (const id in positions) {
		if (positions[id] === from) {
			newPositions[id] = to;
		} else if (positions[id] === to) {
			newPositions[id] = from;
		}
	}
	return newPositions;
}

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

function getUpdatedResources(
	resources: ListItem[],
	resourceId: string,
	positions: Record<string, number>
) {
	const updatedResources: ListItem[] = [];
	let deletedResource: ListItem | null = null;

	for (const resource of resources) {
		if (resource.resourceId === resourceId) {
			deletedResource = resource;
		} else {
			updatedResources.push({
				...resource,
				position:
					positions[resource.resourceId] >= positions[resourceId]
						? positions[resource.resourceId] - 1 // Adjust positions
						: positions[resource.resourceId],
			});
		}
	}

	return { updatedResources, deletedResource };
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
				className="w-64"
				textCss="w-48"
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
			titleCss="font-medium w-48"
			showArtist={false}
			showLink={false}
			className="w-64"
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
	hasListChanged,
	contentHeight,
}: {
	item: ListItem;
	category: Category;
	scrollY: SharedValue<number>;
	resourcesSharedMap: SharedValue<Record<string, number>>;
	resourcesCount: number;
	hasListChanged: React.MutableRefObject<boolean>;
	deleteResource: (resourceId: string) => void;
	contentHeight: number;
}) => {
	const moving = useSharedValue<boolean>(false);
	const position = useSharedValue<string>(resourcesSharedMap.value[item.resourceId].toString());
	const top = useSharedValue<number>(
		(resourcesSharedMap.value[item.resourceId] - 1) * SONG_HEIGHT + MARGIN_TOP_OFFSET
	);
	const { colorScheme } = useColorScheme();
	const backgroundColor = color("hsl(240, 10%, 3.9%)").rgb().string();

	useAnimatedReaction(
		() => resourcesSharedMap.value[item.resourceId],
		(currentPosition, previousPosition) => {
			if (currentPosition && currentPosition !== previousPosition)
				if (!moving.value) {
					top.value = withSpring((currentPosition - 1) * SONG_HEIGHT + MARGIN_TOP_OFFSET);
					position.value = currentPosition.toString();
				}
		},
		[moving]
	);

	const panHandler = Gesture.Pan()
		.runOnJS(true)
		.onStart(() => {
			moving.value = true;
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		})
		.onUpdate((event) => {
			const positionY = event.absoluteY + scrollY.value;

			top.value = withTiming(
				clamp(positionY - SONG_HEIGHT * 2, 0, contentHeight - SONG_HEIGHT), // modal causes song_height offset
				{
					duration: 16,
				}
			);

			const newPosition = clamp(
				Math.floor((positionY - MARGIN_TOP_OFFSET) / SONG_HEIGHT),
				1,
				resourcesCount
			);

			if (newPosition !== resourcesSharedMap.value[item.resourceId]) {
				resourcesSharedMap.value = objectMove(
					resourcesSharedMap.value,
					resourcesSharedMap.value[item.resourceId],
					newPosition
				);
				position.value = newPosition.toString();
				hasListChanged.current = true;
			}
		})
		.onEnd(() => {
			top.value = withSpring(
				(resourcesSharedMap.value[item.resourceId] - 1) * SONG_HEIGHT + MARGIN_TOP_OFFSET
			);
			moving.value = false;
		})
		.hitSlop({ right: 0, width: 60 });

	const animatedStyle = useAnimatedStyle(
		() => ({
			position: "absolute",
			top: top.value,
			shadowColor: colorScheme === "light" ? "white" : "black",
			zIndex: moving.value ? 1 : 0,
			backgroundColor: moving.value
				? colorScheme === "light"
					? "white"
					: backgroundColor
				: "transparent",
			borderRadius: 10,
			shadowOffset: {
				height: 0,
				width: 0,
			},
			shadowOpacity: withSpring(moving ? 0.2 : 0),
			shadowRadius: 10,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			width: "100%",
			visibility: "false",
		}),
		[moving]
	);

	return (
		<GestureDetector gesture={panHandler}>
			<Animated.View style={animatedStyle}>
				<ReText
					text={position}
					style={{
						fontSize: 14,
						width: 20,
						paddingLeft: 15,
						color: colorScheme ? "#6b7280" : "white",
						fontWeight: "bold",
					}}
				/>
				<Resource
					resourceId={item.resourceId}
					parentId={item.parentId}
					category={category}
				/>
				<Button
					className="size-9"
					onPress={() => {
						cancelAnimation(top);
						deleteResource(item.resourceId);
					}}
					variant="destructive"
					size="icon"
				>
					<Trash2 size={18} />
				</Button>

				<AlignJustify className="text-foreground" style={{ marginRight: 20 }} />
			</Animated.View>
		</GestureDetector>
	);
};

const SortableList = ({
	resourcesState,
	setResourcesState,
	deletedResourcesRef,
	resourcesSharedMap,
	hasListChanged,
	category,
}: {
	resourcesState: ListItem[];
	setResourcesState: (resources: ListItem[]) => void;
	deletedResourcesRef: React.MutableRefObject<ListItem[]>;
	resourcesSharedMap: SharedValue<Record<string, number>>;
	hasListChanged: React.MutableRefObject<boolean>;
	category: Category;
}) => {
	const scrollY = useSharedValue(0);
	const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
	const contentHeight = resourcesState.length * SONG_HEIGHT + MARGIN_TOP_OFFSET * 2;

	const handleScroll = useAnimatedScrollHandler((event) => {
		scrollY.value = event.contentOffset.y;
	});

	const deleteResource = (resourceId: string) => {
		hasListChanged.current = true;
		const { updatedResources, deletedResource } = getUpdatedResources(
			resourcesState,
			resourceId,
			resourcesSharedMap.value
		);
		setResourcesState(updatedResources);
		deletedResourcesRef.current = [...deletedResourcesRef.current, deletedResource!];
	};

	return (
		<Animated.ScrollView
			ref={scrollViewRef}
			onScroll={handleScroll}
			scrollEventThrottle={16}
			nestedScrollEnabled={true}
			style={{ flex: 1, position: "relative" }}
			contentContainerStyle={{ height: contentHeight }}
			showsVerticalScrollIndicator={false}
		>
			{resourcesState.map((item) => (
				<AnimatedResource
					key={item.resourceId}
					item={item}
					category={category}
					deleteResource={deleteResource}
					resourcesSharedMap={resourcesSharedMap}
					resourcesCount={resourcesState.length}
					hasListChanged={hasListChanged}
					scrollY={scrollY}
					contentHeight={contentHeight}
				/>
			))}
		</Animated.ScrollView>
	);
};

const RearrangeListModal = () => {
	const router = useRouter();
	const { listId } = useLocalSearchParams<{ listId: string }>();
	const [list] = api.lists.get.useSuspenseQuery({ id: listId });
	const [listItems] = api.lists.resources.get.useSuspenseQuery({
		listId,
		userId: list!.userId,
	});

	const [resourcesState, setResourcesState] = useState<ListItem[]>(listItems);
	const deletedResourcesRef = useRef<ListItem[]>([]);
	const hasListChanged = useRef<boolean>(false);
	const resourcesSharedMap = useDerivedValue(() => setMap(resourcesState), [resourcesState]);

	const invalidate = async () => {
		await utils.lists.resources.get.invalidate({
			listId,
		});
		await utils.lists.getUser.invalidate({
			userId: list?.profile.userId,
		});
		if (list?.onProfile) {
			await utils.lists.topLists.invalidate({
				userId: list?.userId,
			});
		}
	};

	const utils = api.useUtils();
	const { mutateAsync: updatePositions } = api.lists.resources.updatePositions.useMutation();
	const { mutateAsync: deletePositions } = api.lists.resources.multipleDelete.useMutation();

	const handleSave = async () => {
		if (hasListChanged.current) {
			await updatePositions({
				listId,
				resources: resourcesState.map((resource) => ({
					...resource,
					position: resourcesSharedMap.value[resource.resourceId],
				})),
			});
		}
		if (deletedResourcesRef.current.length) {
			await deletePositions({
				listId,
				resources: deletedResourcesRef.current,
			});
		}
		await invalidate();
		router.back();
	};

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<SafeAreaView style={{ flex: 1 }}>
					<Stack.Screen
						options={{
							headerTitle: () => (
								<View className="flex flex-row justify-between items-center w-full pr-10">
									<Button
										variant="link"
										className="flex flex-row items-center -m-5"
										onPress={router.back}
									>
										<ChevronLeft />
										<Text className=" text-xl">Back</Text>
									</Button>
									<Text variant="h4">Edit {list?.name}</Text>
									<Button variant="link" onPress={handleSave}>
										<Save />
									</Button>
								</View>
							),
						}}
					/>
					<SortableList
						resourcesState={resourcesState}
						setResourcesState={setResourcesState}
						deletedResourcesRef={deletedResourcesRef}
						resourcesSharedMap={resourcesSharedMap}
						hasListChanged={hasListChanged}
						category={list!.category}
					/>
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
};
export default RearrangeListModal;
