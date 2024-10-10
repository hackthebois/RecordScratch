import { timeAgo } from "@recordscratch/lib";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import { UserAvatar } from "~/components/UserAvatar";
import { Text } from "~/components/ui/text";
import { RouterOutputs, api } from "~/lib/api";
import { useAuth } from "~/lib/auth";
import { Reply } from "~/lib/icons/Reply";
import { Trash } from "~/lib/icons/Trash";
import { getImageUrl } from "~/lib/image";
import { Button } from "./ui/button";

export const Comment = ({
	comment: { id, rootId, content, profile, updatedAt, resourceId },
}: {
	comment: RouterOutputs["comments"]["list"][0];
}) => {
	const myProfile = useAuth((s) => s.profile);
	const utils = api.useUtils();

	const { mutate: deleteComment } = api.comments.delete.useMutation({
		onSettled: async () => {
			await utils.comments.list.invalidate({ resourceId });
		},
	});

	return (
		<View className="p-4 gap-4">
			<Link href={`/${String(profile.handle)}`} asChild>
				<Pressable className="flex flex-row flex-wrap items-center gap-2">
					<UserAvatar size={40} imageUrl={getImageUrl(profile)} />
					<Text className="text-lg">{profile.name}</Text>
					<Text className="text-left text-muted-foreground text-lg">
						@{profile.handle} • {timeAgo(updatedAt)}
					</Text>
				</Pressable>
			</Link>
			<Text className="text-lg">{content}</Text>
			<View className="flex flex-row items-center">
				<Link
					href={{
						pathname: "(modals)/reply/rating",
						params: { resourceId, handle: profile.handle },
					}}
					asChild
				>
					<Button variant="ghost" size={"sm"}>
						<Reply size={25} className="text-muted-foreground" />
					</Button>
				</Link>
				{myProfile?.userId === profile.userId ? (
					<Button
						variant="ghost"
						size={"sm"}
						onPress={() => deleteComment({ id, rootId })}
					>
						<Trash size={20} className="text-muted-foreground" />
					</Button>
				) : null}
			</View>
		</View>
	);
};
