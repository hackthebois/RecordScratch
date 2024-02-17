import { InfiniteCommunityReviews } from "@/components/InfiniteCommunityReviews";
import { Pending } from "@/components/Pending";
import { RatingDialog } from "@/components/RatingDialog";
import { ReviewDialog } from "@/components/ReviewDialog";
import { SignInRateButton } from "@/components/SignInRateButton";
import { SignInReviewButton } from "@/components/SignInReviewButton";
import SongTable from "@/components/SongTable";
import { RatingInfo } from "@/components/ui/RatingInfo";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { queryClient } from "@/trpc/react";
import { Resource } from "@/types/rating";
import { formatMs } from "@/utils/date";
import { getQueryOptions } from "@/utils/deezer";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/_app/albums/$albumId/")({
	component: Album,
	pendingComponent: Pending,
	loader: ({ params: { albumId } }) => {
		queryClient.ensureQueryData(
			getQueryOptions({
				route: "/album/{id}",
				input: { id: albumId },
			})
		);
	},
});

function Album() {
	const { albumId } = Route.useParams();
	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id: albumId },
		})
	);
	const resource: Resource = {
		parentId: String(album.artist?.id),
		resourceId: String(album.id),
		category: "ALBUM",
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-6 sm:flex-row sm:items-start">
				<img
					width={250}
					height={250}
					alt={`${album.title} cover`}
					src={album.cover_big}
					className="w-[250px] self-center rounded-xl"
				/>
				<div className="flex flex-col items-center gap-4 sm:items-start">
					<p className="text-sm tracking-widest text-muted-foreground">
						{album.record_type?.toUpperCase()}
					</p>
					<h1 className="text-center sm:text-left">{album.title}</h1>
					<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
						<Tag variant="outline">{album.release_date}</Tag>
						{album.duration && (
							<Tag variant="outline">{formatMs(album.duration * 1000)}</Tag>
						)}
						{album.genres?.data.map((genre, index) => (
							<Tag variant="outline" key={index}>
								{genre.name}
							</Tag>
						))}
					</div>
					<Link
						to="/artists/$artistId"
						params={{
							artistId: String(album.artist?.id),
						}}
						className="text-muted-foreground hover:underline"
					>
						{album.artist?.name}
					</Link>
					<Suspense fallback={<Skeleton className="w-24 h-8" />}>
						<div className="flex items-center gap-4">
							<RatingInfo resource={resource} />
							<SignedIn>
								<RatingDialog resource={resource} />
							</SignedIn>
							<SignedOut>
								<SignInRateButton />
							</SignedOut>
						</div>
					</Suspense>
				</div>
			</div>
			<Tabs defaultValue="songs">
				<TabsList>
					<TabsTrigger value="songs">Songs</TabsTrigger>
					<TabsTrigger value="reviews">Reviews</TabsTrigger>
				</TabsList>
				<TabsContent value="songs">
					<SongTable songs={album.tracks?.data ?? []} />
				</TabsContent>
				<TabsContent value="reviews">
					<div className="flex w-full flex-col gap-4">
						<div className="flex w-full gap-2">
							<SignedIn>
								<ReviewDialog resource={resource} />
							</SignedIn>
							<SignedOut>
								<SignInReviewButton />
							</SignedOut>
						</div>
						<InfiniteCommunityReviews resource={resource} pageLimit={20} />
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
