const ListMetadata = ({
	title,
	type,
	children,
	Image,
	lastUpdatedTime,
}: {
	title: string;
	type: string;
	children: React.ReactNode;
	Image: React.ReactNode;
	lastUpdatedTime: string;
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
					<p className="mt-2 text-base text-muted">
						Updated {lastUpdatedTime}
					</p>
				</div>
			</div>
		</>
	);
};

export default ListMetadata;
