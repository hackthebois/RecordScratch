import { cn } from "@recordscratch/lib";
import * as React from "react";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";

const duration = 1000;

function Skeleton({
	className,
	...props
}: Omit<React.ComponentPropsWithoutRef<typeof Animated.View>, "style">) {
	const sv = useSharedValue(1);

	React.useEffect(() => {
		sv.value = withRepeat(
			withSequence(
				withTiming(0.4, { duration }),
				withTiming(1, { duration }),
			),
			-1,
		);
	}, []);

	const style = useAnimatedStyle(() => ({
		opacity: sv.value,
	}));

	return (
		<Animated.View
			style={style}
			className={cn("bg-secondary dark:bg-muted rounded-md", className)}
			{...props}
		/>
	);
}

export { Skeleton };
