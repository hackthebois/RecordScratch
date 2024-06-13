import { cn } from "@recordscratch/lib";
import { ScrollArea } from "../ui/ScrollArea";

export const ListMetaData = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => {
	return (
		<>
			<h4 className={cn("my-4 text-center sm:text-left")}>{title}</h4>
			<ScrollArea
				orientation="horizontal"
				className="flex flex-row gap-4"
			>
				<div className="flex flex-row">{children}</div>
			</ScrollArea>
		</>
	);
};
