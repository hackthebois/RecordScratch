import { api } from "@/utils/api";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, ScrollView } from "react-native";
import NotFound from "../../+not-found";
import { getImageUrl } from "@/utils/image";
import { Avatar, View } from "react-native-ui-lib";

const HandlePage = () => {
	const { handle } = useLocalSearchParams();

	// Check if id is undefined or not a string
	if (typeof handle === "undefined") {
		return <div>Error: ID parameter is missing. Please provide a valid album ID.</div>;
	}

	const handleId = Array.isArray(handle) ? handle[0] : handle;

	// Check if albumId is a string
	if (typeof handleId !== "string") {
		return <div>Error: Invalid ID format. Please provide a valid album ID.</div>;
	}

	const [profile] = api.profiles.get.useSuspenseQuery(handleId);

	if (!profile) return <NotFound />;

	return (
		<SafeAreaView
			style={{
				flex: 1,
			}}
		>
			<ScrollView
				contentContainerClassName="flex flex-col gap-6 flex-1 mt-10"
				nestedScrollEnabled
			>
				<View className="flex flex-col items-center gap-3 sm:flex-row">
					{/* <UserAvatar
						imageUrl={getImageUrl(profile)}
						className={"h-36 w-36 overflow-hidden rounded-full"}
					/> */}
					<Avatar size={100} source={getImageUrl(profile)} label="🤦" />

					<View className="flex flex-col items-center sm:items-start">
						<p className="pb-3 text-center text-muted-foreground text-xl">
							@{profile.handle}
						</p>
						<p className="pb-3 text-center text-sm sm:text-left sm:text-base">
							{profile.bio || "No bio yet"}
						</p>
						{/* <FollowerMenu profileId={profile.userId} /> */}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default HandlePage;
