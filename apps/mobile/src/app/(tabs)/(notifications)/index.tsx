import { Text } from "@/components/ui/text";
import { Stack } from "expo-router";
const NotificationsPage = () => {
	return (
		<>
			<Stack.Screen
				options={{
					title: "Notifications",
				}}
			/>
			<Text>Notifications</Text>
		</>
	);
};

export default NotificationsPage;
