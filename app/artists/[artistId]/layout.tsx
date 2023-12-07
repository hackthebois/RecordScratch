import { getArtist } from "@/app/_trpc/cached";
import { serverTrpc } from "@/app/_trpc/server";
import { Tabs } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Star } from "lucide-react";
import Image from "next/image";

const Layout = async ({
	params: { artistId },
	children,
}: {
	params: {
		artistId: string;
	};
	children: React.ReactNode;
}) => {
	const artist = await getArtist(artistId);
	const rating = await serverTrpc.resource.artist.rating(artistId);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-6 sm:flex-row">
				{artist.images && (
					<Image
						priority
						width={250}
						height={250}
						alt={`${artist.name} cover`}
						src={artist.images[0].url}
						className="w-[250px] self-center rounded-xl"
					/>
				)}
				<div className="flex flex-col items-center gap-4 sm:items-start">
					<p className="text-sm tracking-widest text-muted-foreground">
						ARTIST
					</p>
					<h1 className="text-center sm:text-left">{artist.name}</h1>
					<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
						{artist.genres?.map((genre, index) => (
							<Tag variant="outline" key={index}>
								{genre}
							</Tag>
						))}
					</div>
					<div className="flex items-center gap-2">
						<Star
							color="#ffb703"
							fill={rating?.average ? "#ffb703" : "none"}
							size={30}
						/>
						<div>
							{rating?.average && (
								<p className="text-lg font-semibold">
									{Number(rating.average).toFixed(1)}
								</p>
							)}
							<p className="flex items-center gap-1 text-sm text-muted-foreground">
								{rating?.total && Number(rating.total) !== 0
									? rating.total
									: "No ratings yet"}
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger>
											<Info size={15} />
										</TooltipTrigger>
										<TooltipContent>
											<p>Average of albums</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</p>
						</div>
					</div>
				</div>
			</div>
			<Tabs
				tabs={[
					{
						label: "Top Songs",
						href: `/artists/${artistId}/top-songs`,
					},
					{
						label: "Discography",
						href: `/artists/${artistId}/discography`,
					},
				]}
			/>
			{children}
		</div>
	);
};

export default Layout;
