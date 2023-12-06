import Reviews from "@/components/Reviews";

const Page = async ({
	params: { albumId },
}: {
	params: {
		albumId: string;
	};
}) => {
	return (
		<Reviews
			resource={{
				resourceId: albumId,
				category: "ALBUM",
			}}
		/>
	);
};

export default Page;
