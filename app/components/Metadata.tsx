import { Tag } from "./ui/Tag";

const Metadata = ({
	title,
	cover,
	type,
	tags,
	children,
}: {
	title: string;
	cover: string;
	type: string;
	tags: (string | undefined)[];
	children: React.ReactNode;
}) => {
	return (
		<div className="flex flex-col gap-6 sm:flex-row sm:items-start">
			<img
				width={200}
				height={200}
				alt={`${title} cover`}
				src={cover}
				className="h-[200px] w-[200px] self-center rounded-xl sm:self-start"
			/>
			<div className="flex flex-col items-center gap-4 sm:items-start">
				<p className="-mb-2 text-sm tracking-widest text-muted-foreground">
					{type.toUpperCase()}
				</p>
				<h1 className="text-center sm:text-left">{title}</h1>
				<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
					{tags
						.filter((tag) => Boolean(tag))
						.map((tag, index) => (
							<Tag variant="outline" key={index}>
								{tag}
							</Tag>
						))}
				</div>
				{children}
			</div>
		</div>
	);
};

export default Metadata;
