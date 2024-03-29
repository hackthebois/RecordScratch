import { Category, UserListItem } from "@/types/list";
import React from "react";
import { Button } from "../ui/Button";

export const ResourcesList = ({
	category,
	resources,
	renderItem,
}: {
	category: Category;
	resources: UserListItem[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
	renderItem: (resource: UserListItem) => React.ReactNode;
}) => {
	return (
		<div className="-mb-2 mt-5 flex max-h-[67.5rem] flex-row flex-wrap gap-3 sm:max-h-[26rem]">
			{resources.map((resource) => (
				<div
					className="mb-1 h-auto max-h-[10rem] min-h-[10rem] w-[6.5rem] overflow-hidden sm:mr-2 sm:max-h-[11.25rem] sm:min-h-[11.25rem] sm:w-36"
					key={resource.resourceId}
				>
					{renderItem(resource)}
				</div>
			))}

			{resources.length < 6 && (
				<Button
					variant={"outline"}
					className="mb-1 h-[104px] overflow-hidden sm:mr-2 sm:h-36 sm:w-36"
				>
					Add {category.toLowerCase()}
				</Button>
			)}
		</div>
	);
};
