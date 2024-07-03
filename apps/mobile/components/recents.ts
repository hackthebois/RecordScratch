import type { Profile } from "@recordscratch/types";
import { Album, Track, Artist } from "@recordscratch/lib";
import { create, UseBoundStore, StoreApi } from "zustand";

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

const createRecentStore = (): UseBoundStore<StoreApi<RecentStore>> => {
	return create<RecentStore>((set, get) => ({
		recents: [],
		addRecent: (recent: Recent) => {
			set({
				recents: [
					recent,
					...get()
						.recents.filter(({ id }) => id !== recent.id)
						.slice(0, 4),
				],
			});
		},
	}));
};

const stores: { [key: string]: UseBoundStore<StoreApi<RecentStore>> } = {};

export const useRecents = (type: string): UseBoundStore<StoreApi<RecentStore>> => {
	if (!stores[type]) {
		stores[type] = createRecentStore();
	}
	return stores[type]!;
};
