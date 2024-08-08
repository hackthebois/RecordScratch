import { useDebounce } from "@recordscratch/lib";
import { useState } from "react";
import MusicSearch from "./MusicSearch";
import { Search } from "~/lib/icons/Search";
import { Text } from "~/components/ui/text";
import Dialog from "~/components/CoreComponents/Dialog";
import { TextInput, View } from "react-native";
import { api } from "~/lib/api";

export const SearchAddToList = ({
	category,
	listId,
	button,
	onPress,
	openMenu,
}: {
	category: "ALBUM" | "SONG" | "ARTIST";
	listId: string;
	button?: React.ReactNode;
	onPress?: () => void;
	openMenu?: boolean;
}) => {
	const [open, setOpen] = useState<boolean>(openMenu ?? false);
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 500);

	const list = api.useUtils().lists.resources.get;
	const { mutate } = api.lists.resources.create.useMutation({
		onSettled: async (_data, _error, variables) => {
			if (variables) {
				await list.invalidate({
					listId: variables.listId,
				});
				if (onPress) onPress();
			}
		},
	});

	const AddToList = ({
		resourceId,
		parentId,
	}: {
		resourceId: string;
		parentId: string | null | undefined;
	}) => {
		console.log(resourceId, parentId, listId);
		mutate({
			resourceId,
			parentId,
			listId,
		});
	};

	return (
		<Dialog
			open={open}
			setOpen={setOpen}
			onOpen={() => {
				if (!open) setQuery("");
			}}
			triggerOutline={button}
			contentClassName="mt-10"
			className="h-40"
		>
			<View className="flex flex-row items-center border-b">
				<Search size={20} className="text-muted-foreground" />
				<TextInput
					id="name"
					autoComplete="off"
					placeholder="Search"
					value={query}
					className="bg-transparent p-2 text-lg outline-none w-full"
					onChangeText={(text) => setQuery(text)}
				/>
			</View>
			<MusicSearch
				query={debouncedQuery}
				onNavigate={() => {
					setQuery("");
					setOpen(false);
				}}
				onPress={AddToList}
				hide={{
					albums: !(category === "ALBUM"),
					songs: !(category === "SONG"),
					artists: !(category === "ARTIST"),
				}}
				showLink={false}
			/>
		</Dialog>
	);
};

export default SearchAddToList;
