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
				headerTitleAlign: "center",
			}}
		/>
	);
};

export default Layout;
