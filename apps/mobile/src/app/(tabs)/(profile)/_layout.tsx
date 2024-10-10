import { Stack } from "expo-router";
import { Text } from "~/components/ui/text";

const Layout = () => {
	return (
		<Stack
			screenOptions={{
				headerBackTitleVisible: false,
				headerTitle: (props: any) => <Text variant="h4">{props.children}</Text>,
				headerShadowVisible: false,
				animation: "fade",
				title: "",
			}}
		>
			<Stack.Screen
				name="(modals)/rating"
				options={{
					title: "",
					presentation: "modal",
					animation: "slide_from_bottom",
				}}
			/>
			<Stack.Screen
				name="(modals)/reply/rating"
				options={{
					title: "",
					presentation: "modal",
					animation: "slide_from_bottom",
				}}
			/>
			<Stack.Screen
				name="(modals)/reply/comment"
				options={{
					title: "",
					presentation: "modal",
					animation: "slide_from_bottom",
				}}
			/>
		</Stack>
	);
};

export default Layout;
