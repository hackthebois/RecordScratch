import * as React from "react";

import { View } from "react-native";
import { Text } from "./text";
import { cn } from "@recordscratch/lib";

export const Pill = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<View
			className={cn(
				"bg-background border-border rounded-full border px-2.5 py-1",
				className,
			)}
		>
			<Text className="text-sm font-medium">{children}</Text>
		</View>
	);
};
