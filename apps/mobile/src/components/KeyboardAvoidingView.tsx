import { useHeaderHeight } from "@react-navigation/elements";
import React, { MutableRefObject, ReactNode } from "react";
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableWithoutFeedback,
	ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
	children: ReactNode;
	contentContainerClassName?: string;
	scrollContentContainerStyle?: ViewStyle;
	scrollViewRef?: MutableRefObject<ScrollView | null>;
	modal?: boolean;
};

export const KeyboardAvoidingScrollView: React.FC<Props> = ({
	children,
	contentContainerClassName,
	scrollContentContainerStyle = {},
	scrollViewRef,
	modal = false,
}) => {
	const insets = useSafeAreaInsets();
	const headerHeight = useHeaderHeight();

	const renderScrollView = (
		<ScrollView
			contentContainerClassName={contentContainerClassName}
			contentContainerStyle={{ flexGrow: 1, ...scrollContentContainerStyle }}
			contentInsetAdjustmentBehavior="never"
			keyboardShouldPersistTaps="handled"
			ref={scrollViewRef}
		>
			{children}
		</ScrollView>
	);

	if (Platform.OS === "android") return renderScrollView;

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior="padding"
			keyboardVerticalOffset={headerHeight + (modal ? insets.top + 16 : 0)}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				{renderScrollView}
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};
