import { api } from "@/utils/api";
import { RouterInputs } from "@/utils/shared";
import { Disc3 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { View } from "react-native";
import { Review } from "./Review";

export const RecentFeedReviews = ({
	input,
}: {
	input?: RouterInputs["ratings"]["feed"]["recent"];
}) => {
	const { ref, inView } = useInView();

	const { data, fetchNextPage, hasNextPage } = api.ratings.feed.recent.useInfiniteQuery(
		{
			...input,
		},
		{
			getNextPageParam: (lastPage: { nextCursor: any }) => lastPage.nextCursor,
		}
	);

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView, fetchNextPage]);

	return (
		<>
			<View className="flex flex-col gap-3">
				{data?.pages.map((page, index) => (
					<div key={index} className="flex flex-col gap-3">
						{page.items.map((review, index) => (
							<Review key={index} {...review} />
						))}
					</div>
				))}
			</View>
			{!data && <View className="h-screen" />}
			{hasNextPage && (
				<View className="flex h-40 flex-1 flex-col items-center justify-center">
					<Disc3 size={35} className="animate-spin" />
				</View>
			)}
		</>
	);
};
