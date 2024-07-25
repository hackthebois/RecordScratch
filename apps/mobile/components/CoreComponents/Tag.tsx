import * as React from "react";

import { Text, View } from "react-native";

export const Tag = ({ children }: { children: React.ReactNode }) => {
	return (
		<View className="px-2.5 py-1 bg-background border border-border rounded-full">
			<Text className="text-sm text-foreground">{children}</Text>
		</View>
	);
};
