import { ArrowLeft } from "@/lib/icons/IconsLoader";
import { Link } from "expo-router";
import { useWindowDimensions } from "react-native";

export const BackButton = () => {
  const { width } = useWindowDimensions();
  console.log(width);

  return (
    <Link
      href={".."}
      style={{ marginLeft: width > 1024 ? (width - 1024) / 2 : 0 }}
      className="p-4"
    >
      <ArrowLeft size={28} className="text-primary" />
    </Link>
  );
};
