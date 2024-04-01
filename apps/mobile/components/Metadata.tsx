import { cn } from "@recordscratch/utils";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
// import { Tag } from "./ui/Tag";

const Metadata = ({
	title,
	cover,
	type,
	tags,
	children,
	size = "base",
}: {
	title: string;
	cover?: string | React.ReactNode;
	type: string;
	tags?: (string | undefined)[];
	children: React.ReactNode;
	size?: "base" | "sm";
}) => {
	return (
		<View className="flex flex-col gap-4">
			{typeof cover === "string" ? (
				<Image
					alt={`${title} cover`}
					source={cover}
					style={[
						{
							alignSelf: "center",
							borderRadius: 12,
						},
						size === "sm"
							? { width: 150, height: 150 }
							: {
									width: 200,
									height: 200,
								},
					]}
				/>
			) : (
				<View className={"h-[150px] w-[150px] self-center"}>{cover}</View>
			)}
			<View className="flex flex-col items-center gap-4 sm:items-start">
				<Text className="-mb-2 text-sm tracking-widest text-muted-foreground">
					{type.toUpperCase()}
				</Text>
				<Text
					className={cn(
						"text-center sm:text-left",
						size === "sm" && "text-3xl sm:text-4xl"
					)}
				>
					{title}
				</Text>
				{/* {tags && (
						<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
							{tags
								.filter((tag) => Boolean(tag))
								.map((tag, index) => (
									<Tag variant="outline" key={index}>
										{tag}
									</Tag>
								))}
						</div>
					)} */}
				{children}
			</View>
		</View>
	);
};

export default Metadata;
