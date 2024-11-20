import { Text } from "@/components/ui/text";
import { UserAvatar } from "@/components/UserAvatar";
import { api, RouterOutputs } from "@/lib/api";
import { BellOff } from "@/lib/icons/BellOff";
import { Heart } from "@/lib/icons/Heart";
import { MessageCircle } from "@/lib/icons/MessageCircle";
import { User } from "@/lib/icons/User";
import { getImageUrl } from "@/lib/image";
import { useRefreshByUser } from "@/lib/refresh";
import { Profile } from "@recordscratch/types";
import { FlashList } from "@shopify/flash-list";
import { Link, LinkProps, Stack } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, View } from "react-native";

const NotificationBlock = ({
	icon,
	href,
	action,
	content,
	profile,
}: {
	icon: React.ReactNode;
	href: LinkProps["href"];
	action: string;
	content: string;
	profile: Profile;
}) => {
	return (
		<Link href={href} asChild>
			<Pressable className="flex flex-row gap-4 p-4">
				<View>{icon}</View>
				<View className="flex w-full flex-col gap-2">
					<View className="flex w-full flex-row gap-4">
						<Link href={`/${profile.handle}`}>
							<UserAvatar imageUrl={getImageUrl(profile)} />
						</Link>
						<View className="flex flex-row items-center">
							<Text className="text-lg font-medium">{profile.name.trim()}</Text>
							<Text className="text-left text-lg">{" " + action}</Text>
						</View>
					</View>
					{content ? (
						<Text className="text-left text-muted-foreground text-lg">{content}</Text>
					) : null}
				</View>
			</Pressable>
		</Link>
	);
};

const NotificationItem = ({
	notification,
}: {
	notification: RouterOutputs["notifications"]["get"][0];
}) => {
	switch (notification.notifType) {
		case "follow":
			return (
				<NotificationBlock
					icon={<User size={28} className="text-sky-500" />}
					href={`/${notification.profile.handle}`}
					action="followed you"
					content={""}
					profile={notification.profile}
				/>
			);
		case "like":
			return (
				<NotificationBlock
					icon={<Heart size={26} color="#ff4d4f" />}
					href={`/${notification.profile.handle}/ratings/${notification.rating.resourceId}`}
					action={`liked your ${notification.rating.content ? "review" : "rating"}`}
					content={notification.rating.content ?? ""}
					profile={notification.profile}
				/>
			);
		case "comment":
			return (
				<NotificationBlock
					icon={<MessageCircle size={28} />}
					href={`/${notification.profile.handle}/ratings/${notification.comment.resourceId}`}
					action={`${notification.type === "COMMENT" ? "commented on your rating" : "replied to your comment"}`}
					content={notification.comment.content}
					profile={notification.profile}
				/>
			);
	}
};

export default function Notifications() {
	const utils = api.useUtils();
	const [allNotifications, { refetch }] = api.notifications.get.useSuspenseQuery();

	const { mutate } = api.notifications.markAllSeen.useMutation({
		onSettled: () => {
			utils.notifications.getUnseen.invalidate();
		},
	});

	const { refetchByUser, isRefetchingByUser } = useRefreshByUser(refetch);

	useEffect(() => {
		mutate();
	}, [mutate]);

	const emptyNotifications = allNotifications.length === 0;

	return (
		<>
			<Stack.Screen options={{ title: "Notifications" }} />
			{emptyNotifications ? (
				<View className="my-[20vh] flex w-full flex-col items-center justify-center gap-6">
					<BellOff size={64} className="text-muted-foreground" />
					<Text className="text-muted-foreground">No notifications yet</Text>
				</View>
			) : (
				<FlashList
					data={allNotifications}
					keyExtractor={(item, index) => `notification-${item.userId}-${index}`}
					ItemSeparatorComponent={() => <View className="h-1 bg-muted" />}
					renderItem={({ item }) => <NotificationItem notification={item} />}
					estimatedItemSize={100}
					scrollEnabled={true}
					refreshing={isRefetchingByUser}
					onRefresh={refetchByUser}
				/>
			)}
		</>
	);
}
