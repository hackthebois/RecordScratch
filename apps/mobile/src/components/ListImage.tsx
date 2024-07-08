import { Feather } from "@expo/vector-icons";
import { Deezer } from "@recordscratch/lib";
import { Category, ListItem, UserListItem } from "@recordscratch/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { getQueryOptions } from "@/utils/deezer";
import { Image } from "expo-image";
import { View } from "react-native";
import { Text } from "./Text";

const ListSquare = ({
	image,
	imageSize,
	section,
}: {
	image: string;
	imageSize: number;
	section: number;
}) => {
	let roundedClass;
	switch (section) {
		case 0: {
			roundedClass = { borderTopLeftRadius: 20 };
			break;
		}
		case 1: {
			roundedClass = { borderTopRightRadius: 20 };
			break;
		}
		case 2: {
			roundedClass = { borderBottomLeftRadius: 20 };
			break;
		}
		case 3: {
			roundedClass = { borderBottomRightRadius: 20 };
			break;
		}
		default: {
			roundedClass = { borderRadius: 20 };
			break;
		}
	}
	return (
		<Image
			source={image}
			alt={`${image} cover`}
			style={{
				width: imageSize,
				height: imageSize,
				maxWidth: imageSize,
				maxHeight: imageSize,
				...roundedClass,
			}}
		/>
	);
};

const GetItemImage = ({
	resourceId,
	category,
	imageSize,
	section,
}: {
	resourceId: string;
	category: Category;
	imageSize: number;
	section: number;
}) => {
	const routes: Record<Category, keyof Deezer> = {
		SONG: "/track/{id}",
		ALBUM: "/album/{id}",
		ARTIST: "/artist/{id}",
	};

	const route = routes[category];
	if (!route) {
		throw new Error(`Unsupported category: ${category}`);
	}

	const { data } = useSuspenseQuery(
		getQueryOptions({
			route,
			input: { id: resourceId },
		})
	);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const getImageUrl = (category: Category, data: any) => {
		switch (category) {
			case "SONG":
				return data.album?.cover_big;
			case "ALBUM":
				return data.cover_big;
			case "ARTIST":
				return data.picture_big;
			default:
				return "https://e-cdns-images.dzcdn.net/images/artist//500x500-000000-80-0-0.jpg";
		}
	};

	return (
		<ListSquare image={getImageUrl(category, data)} imageSize={imageSize} section={section} />
	);
};

const ListImage = ({
	listItems,
	category,
	size,
}: {
	listItems?: ListItem[] | UserListItem[] | null;
	category: Category;
	size: number;
}) => {
	const noImage = (
		<View
			className={`flex items-center justify-center rounded-md bg-muted`}
			style={{
				width: size,
				height: size,
				maxWidth: size,
				maxHeight: size,
			}}
		>
			<Feather name="list" size={24} color="black" />
		</View>
	);

	if (!listItems || !listItems.length) return noImage;
	else if (listItems.length < 4) {
		return (
			<Suspense fallback={noImage}>
				<GetItemImage
					resourceId={listItems[0]?.resourceId ?? ""}
					category={category}
					section={4}
					imageSize={size}
				/>
			</Suspense>
		);
	}
	return (
		<Suspense fallback={noImage}>
			<View style={{ flexWrap: "wrap", flexDirection: "row", width: size }}>
				<GetItemImage
					key="section-0"
					resourceId={listItems[0]?.resourceId ?? ""}
					category={category}
					section={0}
					imageSize={size / 2}
				/>

				<GetItemImage
					key="section-1"
					resourceId={listItems[1]?.resourceId ?? ""}
					category={category}
					section={1}
					imageSize={size / 2}
				/>

				<GetItemImage
					key="section-2"
					resourceId={listItems[2]?.resourceId ?? ""}
					category={category}
					section={2}
					imageSize={size / 2}
				/>

				<GetItemImage
					key="section-3"
					resourceId={listItems[3]?.resourceId ?? ""}
					category={category}
					section={3}
					imageSize={size / 2}
				/>
			</View>
		</Suspense>
	);
};

export default ListImage;
