import { Ratings } from "@/recordscratch/components/Ratings";
import { PathnameTabs } from "@/recordscratch/components/ui/LinkTabs";
import { Skeleton } from "@/recordscratch/components/ui/skeleton";
import { Suspense } from "react";
import SongMetadata from "./SongMetadata";

const Layout = ({
	params: { songId },
	children,
}: {
	params: {
		songId: string;
	};
	children: React.ReactNode;
}) => {
	return (
		<div className="flex flex-col gap-6">
			<SongMetadata songId={songId}>
				<Suspense fallback={<Skeleton className="h-10 w-40" />}>
					<Ratings
						resource={{
							resourceId: songId,
							category: "SONG",
						}}
					/>
				</Suspense>
			</SongMetadata>
			<PathnameTabs
				tabs={[
					{
						label: "Reviews",
						href: `/songs/${songId}`,
					},
				]}
			/>
			{children}
		</div>
	);
};

export default Layout;
