const Page = async () => {
	// const newReleases = await publicApi.resource.album.newReleases();
	// const trending = await publicApi.resource.album.trending();
	// const top = await publicApi.resource.album.top();

	return (
		<div className="w-full">
			{/* <div className="mt-[2vh] flex flex-col">
				<h2 className="mb-4">New Releases</h2>
				<AlbumList albums={newReleases.albums.items} />
			</div>
			<div className="mt-[2vh] flex flex-col">
				<h2 className="mb-4">Trending</h2>
				<AlbumList albums={trending} />
			</div>
			<div className="mt-[2vh] flex flex-col">
				<h2 className="mb-4">Top Rated</h2>
				<AlbumList albums={top} />
			</div>
			<h2 className="mb-2 mt-[2vh]">Feed</h2>
			<InfiniteReviews
				initialReviews={await getFeed({ page: 1, limit: 25 })}
				getReviews={getFeed}
				pageLimit={25}
			/> */}
		</div>
	);
};

export default Page;
