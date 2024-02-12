import { getSong } from "@/app/_api";
import { Ratings } from "@/components/Ratings";
import { buttonVariants } from "@/components/ui/Button";
import { PathnameTabs } from "@/components/ui/LinkTabs";
import { Tag } from "@/components/ui/Tag";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const formatTime = (milliseconds: number): string => {
	const seconds = Math.floor(milliseconds / 1000);
	const minutes = Math.floor(seconds / 60);

	if (minutes > 0) {
		return `${minutes}m ${seconds % 60}s`;
	} else {
		return `${seconds}s`;
	}
};

const Layout = async ({
	params: { songId },
	children,
}: {
	params: {
		songId: string;
	};
	children: React.ReactNode;
}) => {
	const song = await getSong(songId);
	const album = song.album;

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-6 sm:flex-row sm:items-start">
				{album.images && (
					<Image
						priority
						width={250}
						height={250}
						alt={`${album.name} cover`}
						src={album.images[0].url}
						className="w-[250px] self-center rounded-xl"
					/>
				)}
				<div className="flex flex-col items-center gap-4 sm:items-start">
					<p className="text-sm tracking-widest text-muted-foreground">
						SONG
					</p>
					<h1 className="text-center sm:text-left">{song.name}</h1>
					<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
						<Tag variant="outline">{album.release_date}</Tag>
						{song.explicit && <Tag variant="outline">Explicit</Tag>}
						<Tag variant="outline">
							{formatTime(song.duration_ms)}
						</Tag>
					</div>
					<Suspense fallback={<Skeleton className="h-10 w-40" />}>
						<Ratings
							resource={{
								resourceId: songId,
								category: "SONG",
							}}
						/>
					</Suspense>
					<Link
						href={`/albums/${album.id}`}
						className={buttonVariants({
							size: "sm",
							variant: "secondary",
						})}
					>
						Go to album
					</Link>
				</div>
			</div>
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
