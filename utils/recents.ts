import { Album, Artist } from "@/app/_api/spotify";
import { Profile } from "@/types/profile";
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
