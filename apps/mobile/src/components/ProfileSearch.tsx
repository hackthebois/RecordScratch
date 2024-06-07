import { ProfileItem } from "./ProfileItem";
import { api } from "../utils/api";
import { useRecents } from "@recordscratch/lib";
import SearchState from "./SearchState";

const ProfileSearch = ({ query, onNavigate }: { query: string; onNavigate: () => void }) => {
	const { addRecent } = useRecents("SEARCH");

	const { data, isLoading, isError } = api.profiles.search.useQuery(query, {
		gcTime: 0,
		refetchOnMount: false,
		enabled: query.length > 0,
	});

	return (
		<SearchState
			isError={isError}
			isLoading={isLoading}
			onNavigate={onNavigate}
			noResults={data?.length === 0}
			hide={{ artists: true, albums: true, songs: true }}
		>
			{data && (
				<>
					{data.map((profile, index) => (
						<ProfileItem
							profile={profile}
							key={index}
							onClick={() => {
								addRecent({
									id: profile.userId,
									type: "PROFILE",
									data: profile,
								});
								onNavigate();
							}}
						/>
					))}
				</>
			)}
		</SearchState>
	);
};

export default ProfileSearch;
