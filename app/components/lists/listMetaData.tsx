const ListMetadata = ({
	title,
	type,
	children,
	Image,
}: {
	title: string;
	type: string;
	children: React.ReactNode;
	Image: React.ReactNode;
}) => {
	return (
		<>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start">
				<div className="self-center">{Image}</div>
				<div className="flex flex-col items-center sm:items-start">
					<p className="mb-1 text-xs tracking-widest text-muted-foreground">
						{type.toUpperCase()}
					</p>

					<h3 className="mb-2 text-center sm:text-left">{title}</h3>
					{children}
				</div>
			</div>
		</>
	);
};

export default ListMetadata;
