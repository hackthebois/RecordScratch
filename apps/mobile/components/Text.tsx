import React from "react";
import { Text as RNText } from "react-native";

import { cn } from "@recordscratch/lib";
import { cva, type VariantProps } from "class-variance-authority";

export const textVariants = cva("text-foreground", {
	variants: {
		variant: {
			text: "text-foreground font-regular",
			h1: "text-4xl font-bold",
		},
	},
	defaultVariants: {
		variant: "text",
	},
});

interface TextProps
	extends React.ComponentPropsWithoutRef<typeof RNText>,
		VariantProps<typeof textVariants> {}

export const Text = ({ children, className, variant, ...props }: TextProps) => {
	return (
		<RNText
			{...props}
			className={cn(
				textVariants({
					variant,
					className,
				})
			)}
		>
			{children}
		</RNText>
	);
};
