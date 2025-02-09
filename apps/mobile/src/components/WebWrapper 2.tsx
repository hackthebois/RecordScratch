import { View, Platform } from "react-native";

export const WebWrapper = ({ children }: { children: React.ReactNode }) => {
  if (Platform.OS === "web") {
    return (
      <View className="w-full items-center">
        <View className="max-w-screen-lg w-full">{children}</View>
      </View>
    );
  } else {
    return children;
  }
};
