export const ListList = ({
	name,
	description,
	category,
}: {
	name: string;
	description: string | null;
	category: "ALBUM" | "SONG" | "ARTIST";
}) => {
	return (
		<div className="flex flex-row">
			<h2>{name}</h2>
			<h2>{description}</h2>
			<h2>{category}</h2>
		</div>
	);
};
