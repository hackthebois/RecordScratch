import { Pill } from "@/components/ui/pill";
import { Text } from "@/components/ui/text";
import { Image } from "expo-image";
import React from "react";
import { Platform, View } from "react-native";

const Metadata = ({
  title,
  cover,
  type,
  tags,
  children,
  size = "base",
}: {
  title?: string;
  cover?: string | React.ReactNode;
  type?: string;
  tags?: (string | undefined)[];
  children: React.ReactNode;
  size?: "base" | "sm";
}) => {
  return (
    <View className="flex flex-col sm:flex-row sm:px-4 gap-4 mt-4">
      {typeof cover === "string" ? (
        <Image
          alt={`${title} cover`}
          source={cover}
          style={[
            {
              alignSelf: Platform.OS !== "web" ? "center" : "flex-start",
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
        <View className={"self-center"}>{cover}</View>
      )}
      <View className="flex flex-col justify-center items-center sm:items-start gap-4 sm:justify-center">
        <View className="flex flex-col justify-center items-center gap-4 px-4 sm:items-start">
          {!!type && (
            <Text className="text-muted-foreground">{type.toUpperCase()}</Text>
          )}
          {title && (
            <Text variant={"h1"} className="text-center">
              {title}
            </Text>
          )}
          {tags && (
            <View className="flex flex-row flex-wrap justify-center gap-3 sm:justify-start">
              {tags
                .filter((tag) => Boolean(tag))
                .map((tag, index) => (
                  <Pill key={index}>{tag}</Pill>
                ))}
            </View>
          )}
        </View>
        <View className="px-4 items-center sm:items-start">{children}</View>
      </View>
    </View>
  );
};

export default Metadata;
