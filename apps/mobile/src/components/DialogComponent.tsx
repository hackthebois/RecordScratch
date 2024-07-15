import { View } from "react-native";
import { Dialog, PanningProvider } from "react-native-ui-lib";
import { Button } from "./Button";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { cn } from "@recordscratch/lib";

const DialogComponent = ({
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
	return (
		<Dialog
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
						<AntDesign name="closecircleo" size={24} color="black" />
					</View>
				</Button>
				<View className={cn(className)}>{children}</View>
			</View>
		</Dialog>
	);
};

export default DialogComponent;
