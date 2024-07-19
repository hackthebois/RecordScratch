import React from "react";
import { View, StyleSheet } from "react-native";
import { cn } from "@recordscratch/lib"; // Replace with your actual utility function or omit if not needed

type SkeletonProps = {
	className?: string;
	style?: object;
};

const Skeleton: React.FC<SkeletonProps> = ({ className, style, ...props }) => {
	return <View className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
};

export default Skeleton;