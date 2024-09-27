import { Stack } from "expo-router";
import { Text } from "~/components/ui/text";

const Layout = () => {
	return (
		<Stack
			screenOptions={{
				headerBackTitleVisible: false,
				headerTitle: (props) => <Text variant="h4">{props.children}</Text>,
				headerShadowVisible: false,
				animation: "fade",
			}}
		/>
	);
};

export default Layout;
