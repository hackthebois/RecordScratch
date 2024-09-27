import { Stack } from "expo-router";
import { Text } from "~/components/ui/text";

const options: any = {
	headerBackTitleVisible: false,
	headerTitle: (props: any) => <Text variant="h4">{props.children}</Text>,
	headerShadowVisible: false,
	animation: "fade",
};

const Layout = ({ segment }: { segment: string }) => {
	if (segment === "(home)") {
		return <Stack screenOptions={options} />;
	} else if (segment === "(feed)") {
		return <Stack screenOptions={options} />;
	} else if (segment === "(search)") {
		return <Stack screenOptions={options} />;
	} else if (segment === "(profile)") {
		return <Stack screenOptions={options} />;
	}
};

export default Layout;
