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
    <View className={cn(className, "w-[150px]")}>
      <ResourceItem
        direction="vertical"
        resource={{
          resourceId: resourceId,
          category: "ALBUM",
          parentId: "",
        }}
        titleCss="w-[150px]"
        artistNameCss="w-[150px] line-clamp-1"
      />
    </View>
  );
};

export default AlbumItem;
