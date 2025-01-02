import { Text } from "@/components/ui/text";
import { ScreenProps } from "expo-router";

export const defaultScreenOptions: ScreenProps["options"] = {
	headerBackTitle: "Back",
	headerBackTitleStyle: {
		fontFamily: "Montserrat-Medium",
	},
	headerTitle: (props: any) => (
		<Text variant="h4" numberOfLines={1}>
			{props.children}
		</Text>
	),
	headerShadowVisible: false,
	animation: "fade",
	title: "",
	headerTitleAlign: "center",
};
