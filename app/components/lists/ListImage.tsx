import { Category, ListItem } from "@/types/list";
import { Deezer, getQueryOptions } from "@/utils/deezer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { List } from "lucide-react";

const ListSquare = ({
	image,
	imageSize,
	section,
}: {
	image?: string;
	imageSize: number;
	section: number;
}) => {
	const imageSizeClass = `w-${imageSize}`;
	const roundedClass =
		section === 0
			? "rounded-tl"
			: section === 1
				? "rounded-tr"
				: section === 2
					? "rounded-bl"
					: section === 3
						? "rounded-br"
						: section === 4
							? "rounded-md"
							: "";
	return (
		<img
			src={
				image ??
				"https://e-cdns-images.dzcdn.net/images/artist//500x500-000000-80-0-0.jpg"
			}
			alt={`${image} cover`}
			className={`${imageSizeClass} ${roundedClass}`}
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
				return data.album?.cover;
			case "ALBUM":
				return data.cover;
			case "ARTIST":
				return data.picture;
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
}: {
	listItems?: ListItem[];
	category: Category;
}) => {
	if (!listItems || !listItems.length)
		return (
			<div className="flex h-48 w-48 items-center justify-center rounded-md bg-muted">
				<List size={48} />
			</div>
		);
	else if (listItems.length < 4)
		return (
			<GetItemImage
				resourceId={listItems[0].resourceId}
				category={category}
				imageSize={48}
				section={4}
			/>
		);
	return (
		<div className="flex w-48 flex-wrap rounded-b rounded-l rounded-r rounded-t">
			<GetItemImage
				resourceId={listItems[0].resourceId}
				category={category}
				imageSize={24}
				section={0}
			/>

			<GetItemImage
				resourceId={listItems[1].resourceId}
				category={category}
				imageSize={24}
				section={1}
			/>

			<GetItemImage
				resourceId={listItems[2].resourceId}
				category={category}
				imageSize={24}
				section={2}
			/>

			<GetItemImage
				resourceId={listItems[3].resourceId}
				category={category}
				imageSize={24}
				section={3}
			/>
		</div>
	);
};

export default ListImage;
