import { Profile } from "@/types/profile";
import { Album, Artist, Track } from "@/utils/deezer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Recent =
	| {
			id: string;
			type: "ALBUM";
			data: Album;
	  }
	| {
			id: string;
			type: "ARTIST";
			data: Artist;
	  }
	| {
			id: string;
			type: "SONG";
			data: Track & { album: Album };
	  }
	| {
			id: string;
			type: "PROFILE";
			data: Profile;
	  };

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
