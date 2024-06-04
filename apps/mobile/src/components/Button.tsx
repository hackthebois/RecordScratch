import { cva, type VariantProps } from "class-variance-authority";
import { Text, TouchableOpacity } from "react-native";

import { cn } from "@recordscratch/lib";

const buttonVariants = cva("flex flex-row items-center justify-center rounded-md", {
	variants: {
		variant: {
			default: "bg-primary",
			secondary: "bg-secondary",
			destructive: "bg-destructive",
			ghost: "bg-slate-700",
			link: "text-primary underline-offset-4",
		},
		size: {
			default: "h-10 px-4",
			sm: "h-8 px-2",
			lg: "h-12 px-8",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

const buttonTextVariants = cva("text-center font-medium", {
	variants: {
		variant: {
			default: "text-foreground",
			secondary: "text-foreground",
			destructive: "text-destructive-foreground",
			ghost: "text-foreground",
			link: "text-foreground underline",
		},
		size: {
			default: "text-base",
			sm: "text-sm",
			lg: "text-xl",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

interface ButtonProps
	extends React.ComponentPropsWithoutRef<typeof TouchableOpacity>,
		VariantProps<typeof buttonVariants> {
	label: string;
	labelClasses?: string;
}
function Button({
	label,
	labelClasses,
	className,
	variant,
	size,
	children,
	...props
}: ButtonProps) {
	return (
		<TouchableOpacity className={cn(buttonVariants({ variant, size, className }))} {...props}>
			<Text className={cn(buttonTextVariants({ variant, size, className: labelClasses }))}>
				{label}
				{children}
			</Text>
		</TouchableOpacity>
	);
}

export { Button, buttonTextVariants, buttonVariants };
