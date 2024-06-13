import { api } from "@/utils/api";
import { ReviewType } from "@recordscratch/types";
import { View } from "react-native";
import { ResourceItem } from "./ResourceItem";
import { Star, MessageCircle } from "lucide-react-native";
import { getImageUrl } from "@/utils/image";
import { timeAgo } from "@recordscratch/lib";
import { Link } from "expo-router";
import { Avatar } from "react-native-ui-lib";

export const Review = ({
	userId,
	parentId,
	rating,
	profile,
	content,
	resourceId,
	category,
	updatedAt,
	onReply,
}: ReviewType & { onReply?: () => void }) => {
	const [profileExists] = api.profiles.me.useSuspenseQuery();
	return (
		<View className="flex flex-col gap-4 rounded-lg border p-3 py-4 text-card-foreground">
			<ResourceItem
				resource={{ parentId, resourceId, category }}
				showType
				imageCss="h-16 w-16"
			/>
			<View className="flex flex-1 flex-col items-start gap-3">
				<View className="flex flex-row items-center gap-1">
					{Array.from(Array(rating)).map((_, i) => (
						<Star key={i} size={18} color="#ffb703" fill="#ffb703" />
					))}
					{Array.from(Array(10 - rating)).map((_, i) => (
						<Star key={i} size={18} color="#ffb703" />
					))}
				</View>
				<Link
					href={`/profiles/${String(profile.handle)}`}
					className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
				>
					{/* <UserAvatar imageUrl={getImageUrl(profile)} className="h-4 w-4" /> */}
					<Avatar size={50} source={getImageUrl(profile)} label="🤦" />
					<p>{profile.name}</p>
					<p className="text-left text-sm text-muted-foreground">
						@{profile.handle} • {timeAgo(updatedAt)}
					</p>
				</Link>
				<p className="whitespace-pre-line text-sm">{content}</p>
				{/* <View className="flex items-center gap-3">
					<Suspense
						fallback={
							<Button
								variant="outline"
								size="sm"
								className="gap-2 text-muted-foreground"
							>
								<Heart size={20} />
								<Skeleton className="h-6 w-8" />
							</Button>
						}
					>
						{profileExists ? (
							<LikeButton
								resourceId={resourceId}
								authorId={userId}
							/>
						) : (
							<PublicLikeButton
								resourceId={resourceId}
								authorId={userId}
							/>
						)}
					</Suspense>
					<Suspense
						fallback={
							<Button
								variant="outline"
								size="sm"
								className="gap-2 text-muted-foreground"
							>
								<MessageCircle size={20} />
								<Skeleton className="h-6 w-8" />
							</Button>
						}
					>
						<CommentsButton
							handle={profile.handle}
							resourceId={resourceId}
							authorId={userId}
						/>
					</Suspense>
					<ReplyButton
						handle={profile.handle}
						resourceId={resourceId}
						onClick={() => {
							if (onReply) onReply();
						}}
					/>
				</View> */}
			</View>
		</View>
	);
};
