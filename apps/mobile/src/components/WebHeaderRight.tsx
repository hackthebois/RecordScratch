import { Text } from "@/components/ui/text";
import { getImageUrl } from "@/lib/image";
import { Link } from "expo-router";
import { Platform, View, useWindowDimensions } from "react-native";
import { useAuth } from "@/lib/auth";
import { UserAvatar } from "@/components/UserAvatar";

export const WebHeaderRight = () => {
  if (Platform.OS !== "web") return null;
  const profile = useAuth((s) => s.profile);
  if (!profile) return null;
  const { width } = useWindowDimensions();

  return (
    <View
      className="flex-row items-center h-full"
      style={{
        marginRight: width > 1024 ? (width - 1024) / 2 : 0,
      }}
    >
      <Link href="/" className="px-2 h-full flex items-center justify-center">
        <Text>Home</Text>
      </Link>
      <Link
        href="/search"
        className="px-2 h-full flex items-center justify-center"
      >
        <Text>Search</Text>
      </Link>
      <Link
        href="/feed"
        className="px-2 h-full flex items-center justify-center"
      >
        <Text>Feed</Text>
      </Link>
      <Link
        href="/notifications"
        className="px-2 h-full items-center justify-center flex"
      >
        <Text>Notifications</Text>
      </Link>
      <Link
        href="/profile"
        className="px-4 h-full items-center flex justify-center"
      >
        <UserAvatar imageUrl={getImageUrl(profile)} size={40} />
      </Link>
    </View>
  );
};
