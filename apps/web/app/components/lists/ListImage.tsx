import { Category, ListItem, UserListItem } from "@recordscratch/types";
import { Deezer, getQueryOptions } from "@recordscratch/lib";
import { useSuspenseQuery } from "@tanstack/react-query";
import { List } from "lucide-react";
import { Suspense } from "react";

const ListSquare = ({
	image,
	imageSize,
	section,
}: {
	image?: string;
	imageSize: number;
	section: number;
}) => {
	let roundedClass;
	switch (section) {
		case (section = 0): {
			roundedClass = "rounded-tl-xl";
			break;
		}
		case (section = 1): {
			roundedClass = "rounded-tr-xl";
			break;
		}
		case (section = 2): {
			roundedClass = "rounded-bl-xl";
			break;
		}
		case (section = 3): {
			roundedClass = "rounded-br-xl";
			break;
		}
		default: {
			roundedClass = "rounded-xl";
			break;
		}
	}
	return (
		<img
			src={
				image ??
				"https://e-cdns-images.dzcdn.net/images/artist//500x500-000000-80-0-0.jpg"
			}
			alt={`${image} cover`}
			className={`${roundedClass}`}
			style={{
				width: imageSize,
				height: imageSize,
				maxWidth: imageSize,
				maxHeight: imageSize,
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
				return undefined;
		}
	};

	return (
		<ListSquare
			image={getImageUrl(category, data)}
			imageSize={imageSize}
			section={section}
		/>
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
		<div
			className={`flex items-center justify-center rounded-md bg-muted`}
			style={{
				width: size,
				height: size,
				maxWidth: size,
				maxHeight: size,
			}}
		>
			<List size={size / 3} />
		</div>
	);

	if (!listItems || !listItems.length) return noImage;
	else if (listItems.length < 4)
		return (
			<Suspense fallback={noImage}>
				<GetItemImage
					resourceId={listItems[0].resourceId}
					category={category}
					section={4}
					imageSize={size}
				/>
			</Suspense>
		);
	return (
		<Suspense fallback={noImage}>
			<div
				className={`flex w-full flex-wrap`}
				style={{
					width: size,
					height: size,
					maxWidth: size,
					maxHeight: size,
				}}
			>
				<GetItemImage
					resourceId={listItems[0].resourceId}
					category={category}
					section={0}
					imageSize={size / 2}
				/>

				<GetItemImage
					resourceId={listItems[1].resourceId}
					category={category}
					section={1}
					imageSize={size / 2}
				/>

				<GetItemImage
					resourceId={listItems[2].resourceId}
					category={category}
					section={2}
					imageSize={size / 2}
				/>

				<GetItemImage
					resourceId={listItems[3].resourceId}
					category={category}
					section={3}
					imageSize={size / 2}
				/>
			</div>
		</Suspense>
	);
};

export default ListImage;
