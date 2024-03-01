import { ListList } from "@/components/lists/ListList";
import { Button } from "@/components/ui/Button";
import { api } from "@/trpc/react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_app/test/")({
	component: Index,
});

function Index() {
	const { data: listData, refetch: refetchList } =
		api.lists.getUserLists.useQuery();
	const { mutate: createListMutate } =
		api.lists.resources.createListResource.useMutation();
	const { mutate: deleteListMutate } = api.lists.deleteList.useMutation();

	useEffect(() => {
		// Refetch the list when the component mounts
		refetchList();
	}, [refetchList]);

	return (
		<div className="flex flex-row">
			<div className="m-2">Testing lists router</div>
			<Button
				className="m-2"
				onClick={() =>
					createListMutate({
						listId: "fpvhrk0wnx4qbg5/",
						resourceId: "55",
					})
				}
			>
				Create List
			</Button>
			<Button
				className="m-2 bg-red-200"
				onClick={() =>
					deleteListMutate({
						id: "hs9hb2nlang2pqy",
					})
				}
			>
				Delete List
			</Button>
			{listData && (
				<div>
					<h2>List Data:</h2>
					{listData.map((list, index) => {
						return (
							<div
								key={index}
								className="m-2 border-2 border-solid"
							>
								<ListList
									name={list.lists.name}
									description={list.lists.description}
									category={list.lists.category}
								/>
								<h5>{list.profile!.name}</h5>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
