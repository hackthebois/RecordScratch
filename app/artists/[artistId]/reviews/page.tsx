import Reviews from "@/components/Reviews";

const Page = async ({
	params: { artistId },
}: {
	params: {
		artistId: string;
	};
}) => {
	return (
		<Reviews
			resource={{
				resourceId: artistId,
				category: "ARTIST",
			}}
		/>
	);
};

export default Page;
