import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Bell } from "@/lib/icons/IconsLoader";
import { Home } from "@/lib/icons/IconsLoader";
import { Rows3 } from "@/lib/icons/IconsLoader";
import { Search } from "@/lib/icons/IconsLoader";
import { User } from "@/lib/icons/IconsLoader";
import { useNotificationObserver } from "@/lib/notifications/useNotificationObserver";
import { cn } from "@recordscratch/lib";
import { Tabs, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";
import { Platform, View } from "react-native";
import { Image } from "expo-image";
import { UserAvatar } from "@/components/UserAvatar";
import { getImageUrl } from "@/lib/image";
import { Link } from "expo-router";

const WebHeader = () => {
  if (Platform.OS !== "web") return null;
  const profile = useAuth((s) => s.profile);
  if (!profile) return null;

  return (
    <View className="h-16 w-full border-b border-border bg-background justify-center items-center">
      <View className="flex-row gap-2 justify-between items-center max-w-screen-lg w-full px-4">
        <Link href="/" asChild>
          <Image
            source={require("../../../assets/icon.png")}
            style={{
              width: 50,
              height: 50,
              borderRadius: 9999,
            }}
          />
        </Link>
        <View className="flex-row gap-2 items-center">
          <Link href="/search" className="p-2">
            <Text>Search</Text>
          </Link>
          <Link href="/feed" className="p-2">
            <Text>Feed</Text>
          </Link>
          <Link href="/notifications" className="p-2">
            <Text>Notifications</Text>
          </Link>
          <Link href="/profile" className="p-2">
            <UserAvatar imageUrl={getImageUrl(profile)} size={40} />
          </Link>
        </View>
      </View>
    </View>
  );
};

export default function TabLayout() {
  const router = useRouter();
  const sessionId = useAuth((s) => s.sessionId);
  const { data: notifications } = api.notifications.getUnseen.useQuery(
    undefined,
    {
      enabled: !!sessionId,
    },
  );

  useNotificationObserver();

  return (
    <>
      <WebHeader />
      <Tabs
        backBehavior="history"
        screenOptions={{
          headerTitleAlign: "center",
          tabBarShowLabel: false,
          sceneStyle: {
            paddingBottom: Platform.OS === "web" ? 0 : 80,
          },
          headerTitle: (props: any) => (
            <Text variant="h4">{props.children}</Text>
          ),
          tabBarStyle: {
            height: 80,
            position: "absolute",
            display: Platform.OS === "web" ? "none" : "flex",
          },
          tabBarButton: ({ style, ...props }) => (
            <Pressable
              {...props}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          ),
          // TODO: Add blur background when bug is fixed: Unimplemented component <ViewManagerAdapter...
          // tabBarBackground: () => (
          // 	<BlurView
          // 		tint={colorScheme === "dark" ? "dark" : "light"}
          // 		intensity={20}
          // 		style={{
          // 			position: "absolute",
          // 			top: 0,
          // 			left: 0,
          // 			right: 0,
          // 			bottom: 0,
          // 		}}
          // 	/>
          // ),
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <ArrowLeft size={28} className="text-primary" />
            </Pressable>
          ),
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: "",
            tabBarIcon: ({ focused }) => (
              <Home
                size={26}
                className={cn(
                  focused ? "text-primary" : "text-muted-foreground",
                )}
              />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(search)"
          options={{
            title: "",
            tabBarIcon: ({ focused }) => (
              <Search
                size={26}
                className={cn(
                  focused ? "text-primary" : "text-muted-foreground",
                )}
              />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(feed)"
          options={{
            title: "",
            tabBarIcon: ({ focused }) => (
              <Rows3
                size={26}
                className={cn(
                  focused ? "text-primary" : "text-muted-foreground",
                )}
              />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(notifications)"
          options={{
            title: "",
            tabBarBadge: notifications
              ? notifications > 9
                ? "9+"
                : notifications
              : undefined,
            tabBarIcon: ({ focused }) => (
              <Bell
                size={26}
                className={cn(
                  focused ? "text-primary" : "text-muted-foreground",
                )}
              />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            title: "",
            tabBarIcon: ({ focused }) => (
              <User
                size={26}
                className={cn(
                  focused ? "text-primary" : "text-muted-foreground",
                )}
              />
            ),
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
}
