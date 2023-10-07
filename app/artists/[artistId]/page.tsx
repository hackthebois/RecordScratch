import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

type Props = {
	params: {
		artistId: string;
	};
};

const Artist = async ({ params: { artistId } }: Props) => {
	// const artist = await serverTrpc.spotify.artist.getOne(artistId);
	// const discography = await serverTrpc.spotify.artist.getAlbums(artistId);

	return (
		<main className="mx-auto flex max-w-screen-lg flex-1 flex-col gap-6 overflow-hidden px-4 py-8 sm:px-8">
			{/* <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start"> */}
			{/* {artist.images && (
					<Image
						width={200}
						height={200}
						alt={`${artist.name} cover`}
						src={artist.images[0].url}
						className="rounded-xl"
					/>
				)}
				<div className="flex flex-col items-center gap-4 sm:items-start">
					<div className="flex flex-col gap-1">
						<p className="text-sm tracking-widest text-muted-foreground">
							ARTIST
						</p>
						<h1 className="text-center sm:text-left">
							{artist.name}
						</h1>
					</div>
					<div className="flex items-center gap-4">
						{artist.rating?.averageRating}
					</div> */}
			{/* </div>
			</div> */}
			<Tabs defaultValue="overview">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="discography">Discography</TabsTrigger>
				</TabsList>
				<TabsContent value="overview">
					<h3>Popular</h3>
				</TabsContent>
				<TabsContent value="discography">
					Change your password here.
				</TabsContent>
			</Tabs>
		</main>
	);
};

export default Artist;
