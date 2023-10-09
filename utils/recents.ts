import { SpotifyAlbum, SpotifyArtist } from "@/types/spotify";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Recent = SpotifyArtist | SpotifyAlbum;

type RecentStore = {
	recents: Recent[];
	addRecent: (recent: Recent) => void;
};

export const useRecents = create<RecentStore>()(
	persist(
		(set, get) => ({
			recents: [],
			addRecent: (recent: Recent) => {
				set({
					recents: [
						recent,
						...get()
							.recents.filter(({ id }) => id !== recent.id)
							.slice(0, 5),
					],
				});
			},
		}),
		{
			name: "recents",
		}
	)
);
