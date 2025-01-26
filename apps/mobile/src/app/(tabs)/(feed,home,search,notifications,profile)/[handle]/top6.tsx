import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { TopList } from "@/components/List/TopList";
import { Button } from "@/components/ui/button";
import { Eraser } from "@/lib/icons/IconsLoader";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useLocalSearchParams } from "expo-router";
import NotFoundScreen from "@/app/+not-found";

export const EditButton = ({ editMode, onPress }: { editMode: boolean; onPress: () => void }) => {
	return (
		<View className="flex items-center px-4">
			<Button
				className="w-full"
				variant={editMode ? "destructive" : "outline"}
				onPress={() => {
					onPress();
				}}
			>
				<Eraser size={20} className="text-foreground" />
			</Button>
		</View>
	);
};

const Top6Page = () => {
	const { tab, handle } = useLocalSearchParams<{ tab: string; handle: string }>();
	const profile = useAuth((s) => s.profile);
	const [topLists] = api.lists.topLists.useSuspenseQuery({
		userId: profile!.userId,
	});
	const [value, setValue] = useState(tab);
	const [editMode, setEditMode] = useState(false);

	if (profile!.handle != handle) return <NotFoundScreen />;

	return (
		<View>
			<Tabs value={value} onValueChange={setValue} className="mt-2">
				<View className="px-4">
					<TabsList className="flex-row w-full">
						<TabsTrigger value="ALBUM" className="flex-1">
							<Text>Albums</Text>
						</TabsTrigger>
						<TabsTrigger value="SONG" className="flex-1">
							<Text>Songs</Text>
						</TabsTrigger>
						<TabsTrigger value="ARTIST" className="flex-1">
							<Text>Artists</Text>
						</TabsTrigger>
					</TabsList>
				</View>
				<TabsContent value="ALBUM" className="flex-row flex-wrap justify-between gap-2 p-4">
					<TopList
						category="ALBUM"
						setEditMode={setEditMode}
						editMode={editMode}
						list={topLists.album}
						isUser={true}
					/>
				</TabsContent>
				<TabsContent value="SONG" className="flex-row flex-wrap justify-between gap-2 p-4">
					<TopList
						category="SONG"
						setEditMode={setEditMode}
						editMode={editMode}
						list={topLists.song}
						isUser={true}
					/>
				</TabsContent>
				<TabsContent
					value="ARTIST"
					className="flex-row flex-wrap justify-between gap-2 p-4"
				>
					<TopList
						category="ARTIST"
						setEditMode={setEditMode}
						editMode={editMode}
						list={topLists.artist}
						isUser={true}
					/>
				</TabsContent>
			</Tabs>
			<EditButton editMode={editMode} onPress={() => setEditMode(!editMode)} />
		</View>
	);
};

export default Top6Page;
