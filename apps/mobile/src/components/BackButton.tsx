import { ArrowLeft } from "@/lib/icons/IconsLoader";
import { Link } from "expo-router";
import { useWindowDimensions } from "react-native";

export const BackButton = () => {
  const { width } = useWindowDimensions();

  return (
    <Link
      href={".."}
      style={{ marginLeft: width > 1024 ? (width - 1024 - 16) / 2 : -16 }}
      className="px-4 h-full flex flex-row items-center justify-center"
    >
      <ArrowLeft size={28} className="text-primary" />
    </Link>
  );
};
