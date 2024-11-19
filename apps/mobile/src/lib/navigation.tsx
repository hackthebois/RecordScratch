import { Text } from "~/components/ui/text";

export const defaultScreenOptions = {
	headerBackTitle: "Back",
	headerBackTitleStyle: {
		fontFamily: "Montserrat-Medium",
	},
	headerTitle: (props: any) => <Text variant="h4">{props.children}</Text>,
	headerShadowVisible: false,
	animation: "fade",
	title: "",
};
