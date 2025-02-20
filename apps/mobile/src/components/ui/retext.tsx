import React from "react";
import type { TextProps as RNTextProps } from "react-native";
import { StyleSheet, TextInput } from "react-native";
import Animated, { useAnimatedProps } from "react-native-reanimated";

Animated.addWhitelistedNativeProps({ text: true });

interface TextProps {
	text: Animated.SharedValue<string>;
	style?: Animated.AnimateProps<RNTextProps>["style"];
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const ReText = (props: TextProps) => {
	const { text, style } = { style: {}, ...props };
	const animatedProps = useAnimatedProps(() => {
		return {
			text: text.value,
			// Here we use any because the text prop is not available in the type
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any;
	});
	return (
		<AnimatedTextInput
			underlineColorAndroid="transparent"
			editable={false}
			value={text.value}
			style={[style]}
			{...{ animatedProps }}
		/>
	);
};

export default ReText;
