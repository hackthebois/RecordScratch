import { ScrollArea } from "@/components/ui/ScrollArea";
import { Artist } from "@/utils/deezer";
import { ArtistItem } from "./ArtistItem";

export const ArtistList = ({
	artists,
	type = "scroll",
	direction = "horizontal",
}: {
	artists: string[] | Artist[];
	type?: "wrap" | "scroll";
	direction?: "horizontal" | "vertical";
}) => {
	if (type === "scroll") {
		return (
			<ScrollArea orientation="horizontal" className="-mx-4 sm:-mx-8">
				<div className="mb-4 flex justify-between gap-4 px-4 sm:px-8">
					{artists.map((artist, index) => (
						<ArtistItem
							direction={direction}
							key={index}
							artistId={
								typeof artist === "string"
									? artist
									: String(artist.id)
							}
							initialArtist={
								typeof artist === "string" ? undefined : artist
							}
						/>
					))}
				</div>
			</ScrollArea>
		);
	} else {
		return (
			<div className="flex flex-wrap justify-around gap-4 sm:gap-6">
				{artists.map((artist, index) => (
					<ArtistItem
						key={index}
						direction={direction}
						artistId={
							typeof artist === "string"
								? artist
								: String(artist.id)
						}
						imageCss="h-32 w-32"
						initialArtist={
							typeof artist === "string" ? undefined : artist
						}
					/>
				))}
			</div>
		);
	}
};
