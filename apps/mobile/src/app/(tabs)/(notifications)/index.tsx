import { Stack } from "expo-router";
import { Text } from "~/components/ui/text";
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
