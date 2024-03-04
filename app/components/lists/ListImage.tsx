const ListImage = ({ name, image }: { name: string; image?: string }) => {
	return (
		<div className="w-full overflow-hidden rounded-md">
			<img
				src={
					image ??
					"https://e-cdns-images.dzcdn.net/images/artist//500x500-000000-80-0-0.jpg"
				}
				alt={`${name} cover`}
				className="aspect-square h-auto w-auto overflow-hidden rounded-md object-cover transition-all hover:scale-105"
			/>
		</div>
	);
};

export default ListImage;
