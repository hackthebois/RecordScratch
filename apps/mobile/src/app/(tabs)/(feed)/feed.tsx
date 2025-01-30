import { ReviewsList } from "@/components/ReviewsList";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { Stack } from "expo-router";
import React from "react";
import { useState } from "react";
import { View } from "react-native";

const FeedPage = () => {
	const [tab, setTab] = useState("for-you");

	return (
		<>
			<Stack.Screen
				options={{
					title: "Feed",
				}}
			/>
			<Tabs value={tab} onValueChange={setTab}>
				<View className="px-4">
					<TabsList className="flex-row w-full">
						<TabsTrigger value="for-you" className="flex-1">
							<Text>For You</Text>
						</TabsTrigger>
						<TabsTrigger value="friends" className="flex-1">
							<Text>Following</Text>
						</TabsTrigger>
					</TabsList>
				</View>
			</Tabs>
			<ReviewsList
				limit={20}
				filters={{
					following: tab === "friends",
					ratingType: "REVIEW",
				}}
				emptyText={
					tab === "friends"
						? "No following reviews found. Follow some friends to see their reviews."
						: "No for you reviews found. Check back later."
				}
			/>
		</>
	);
};

export default FeedPage;
