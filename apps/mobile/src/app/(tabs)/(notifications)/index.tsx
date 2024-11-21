import { Text } from "@/components/ui/text";
import { UserAvatar } from "@/components/UserAvatar";
import { api, RouterOutputs } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { BellOff } from "@/lib/icons/BellOff";
import { Heart } from "@/lib/icons/Heart";
import { MessageCircle } from "@/lib/icons/MessageCircle";
import { User } from "@/lib/icons/User";
import { getImageUrl } from "@/lib/image";
import { useRefreshByUser } from "@/lib/refresh";
import {
	Notification,
	parseCommentNotification,
	parseFollowNotification,
	parseLikeNotification,
} from "@recordscratch/lib";
import { FlashList } from "@shopify/flash-list";
import { Link, LinkProps, Stack } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, View } from "react-native";

const NotificationBlock = ({
	icon,
	data,
	action,
	content,
	profile,
}: Notification & { icon: React.ReactNode }) => {
	return (
		<Link href={data.url as LinkProps["href"]} asChild>
			<Pressable
				className="flex flex-row gap-3 px-4 flex-1 items-center"
				style={{
					height: 75,
				}}
			>
				<View>{icon}</View>
				<View className="flex flex-col gap-2 flex-1">
					<View className="flex flex-row gap-3 flex-1 items-center">
						<Link href={`/${profile.handle}`}>
							<UserAvatar imageUrl={getImageUrl(profile)} size={50} />
						</Link>
						<View className="flex flex-row items-center flex-1 flex-wrap">
							<Text numberOfLines={2}>
								<Text className="text-lg font-bold">{profile.name}</Text>
								<Text className="text-left text-lg">
									{" " + action + (content ? ": " : "")}
								</Text>
								{content ? (
									<Text className="text-muted-foreground text-lg">{content}</Text>
								) : null}
							</Text>
						</View>
					</View>
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
	const profile = useAuth((s) => s.profile);
	switch (notification.notifType) {
		case "follow":
			return (
				<NotificationBlock
					icon={<User size={28} className="text-sky-500" />}
					{...parseFollowNotification({ profile: notification.profile })}
				/>
			);
		case "like":
			return (
				<NotificationBlock
					icon={<Heart size={26} color="#ff4d4f" />}
					{...parseLikeNotification({
						profile: notification.profile,
						rating: notification.rating,
						handle: profile!.handle,
					})}
				/>
			);
		case "comment":
			return (
				<NotificationBlock
					icon={<MessageCircle size={26} className="text-emerald-500" />}
					{...parseCommentNotification({
						profile: notification.profile,
						comment: notification.comment,
						handle: profile!.handle,
					})}
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
					estimatedItemSize={75}
					scrollEnabled={true}
					refreshing={isRefetchingByUser}
					onRefresh={refetchByUser}
				/>
			)}
		</>
	);
}
