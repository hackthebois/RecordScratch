import { cn } from "@recordscratch/lib";
import { View } from "react-native";
import { ResourceItem } from "./ResourceItem";

const AlbumItem = ({
  resourceId,
  className,
}: {
  resourceId: string;
  className?: string;
}) => {
  return (
    <View className={cn(className)}>
      <ResourceItem
        direction="vertical"
        resource={{
          resourceId: resourceId,
          category: "ALBUM",
          parentId: "",
        }}
        titleCss="w-40"
        artistNameCss="w-40 line-clamp-1"
      />
    </View>
  );
};

export default AlbumItem;
