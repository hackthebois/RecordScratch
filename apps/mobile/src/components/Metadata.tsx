import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { Tag } from "./Tag";
import { Text } from "./Text";

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
	type?: string;
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
			<View className="flex flex-col justify-center items-center gap-4 sm:justify-center">
				{!!type && <Text className="text-muted-foreground">{type.toUpperCase()}</Text>}
				<Text variant={"h1"} className={"text-center sm:text-left"}>
					{title}
				</Text>
				{tags && (
					<View className="flex flex-row flex-wrap justify-center gap-3 sm:justify-start">
						{tags
							.filter((tag) => Boolean(tag))
							.map((tag, index) => (
								<Tag key={index}>{tag}</Tag>
							))}
					</View>
				)}
				{children}
			</View>
		</View>
	);
};

export default Metadata;
