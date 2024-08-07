import * as React from "react";

import { View } from "react-native";
import { Text } from "./text";

export const Pill = ({ children }: { children: React.ReactNode }) => {
	return (
		<View className="px-2.5 py-1 bg-background border border-border rounded-full">
			<Text className="text-sm font-medium">{children}</Text>
		</View>
	);
};
