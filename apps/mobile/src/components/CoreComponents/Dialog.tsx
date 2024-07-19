import { View } from "react-native";
import { Dialog as UILibDialog, PanningProvider } from "react-native-ui-lib";
import { Button } from "./Button";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { cn } from "@recordscratch/lib";
import { useColorScheme } from "#/utils/useColorScheme";

const Dialog = ({
	open,
	setOpen,
	children,
	className,
	ignoreBackgroundPress,
}: {
	open: boolean;
	setOpen: (_: boolean) => void;
	children: React.ReactNode;
	className?: string;
	ignoreBackgroundPress?: boolean;
}) => {
	const { utilsColor } = useColorScheme();

	return (
		<UILibDialog
			visible={open}
			panDirection={PanningProvider.Directions.RIGHT ?? null}
			onDismiss={() => setOpen(!open)}
			ignoreBackgroundPress={ignoreBackgroundPress}
		>
			<View className=" flex flex-col bg-white rounded-lg justify-center">
				<Button
					className="w-full flex justify-end bg-white mt-3 -mb-2"
					onPress={() => setOpen(!open)}
				>
					<View>
						<AntDesign name="closecircleo" size={24} color={utilsColor} />
					</View>
				</Button>
				<View className={cn(className)}>{children}</View>
			</View>
		</UILibDialog>
	);
};

export default Dialog;
