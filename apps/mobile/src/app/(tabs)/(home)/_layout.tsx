import { defaultScreenOptions } from "@/lib/navigation";
import { Stack } from "expo-router";

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
