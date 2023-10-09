"use client";

import { trpc } from "@/app/_trpc/react";
import { Button, buttonVariants } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";
import { RatingCategory, UserRating } from "@/drizzle/db/schema";
import { Resource } from "@/types/ratings";

import { Star } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const RatingDialogProvider = () => {
	const searchParams = useSearchParams();

	const type =
		searchParams.get("type") === "SONG"
			? RatingCategory.SONG
			: searchParams.get("type") === "ALBUM"
			? RatingCategory.ALBUM
			: null;
	const resourceId = searchParams.get("resourceId");
	const name = searchParams.get("name");
	const initialRating = searchParams.get("rating") ?? undefined;

	if (!type || !resourceId || !name) {
		return null;
	}

	return (
		<RatingDialog
			resource={{ type, resourceId }}
			name={name}
			initialRating={initialRating}
		/>
	);
};

export const RatingDialog = ({
	resource,
	name,
	initialRating,
}: {
	resource: Resource;
	name: string;
	initialRating?: string;
}) => {
	const router = useRouter();
	const pathname = usePathname();
	const utils = trpc.useContext();
	const { mutate: invalidate } = trpc.rating.invalidateResource.useMutation();

	const { mutate } = trpc.rating.rate.useMutation({
		onSuccess: () => {
			invalidate({ ...resource });
			utils.rating.getAverage.invalidate(resource);
			utils.rating.getUserRating.invalidate(resource);
		},
	});

	const [starHover, setStarHover] = useState<number | null>(null);
	const [newRating, setNewRating] = useState<number | null>(null);
	const [open, setOpen] = useState(true);

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				setOpen(open);
				if (!open) {
					router.push(pathname);
				}
			}}
		>
			<DialogContent className="w-full sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Rate "{name}"</DialogTitle>
					<DialogDescription>Select a star amount</DialogDescription>
				</DialogHeader>
				<div className="flex justify-between">
					{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
						<div
							key={index}
							onClick={() => setNewRating(index)}
							onMouseOver={() => setStarHover(index)}
							onMouseLeave={() => setStarHover(null)}
							className="flex flex-1 justify-center py-2 hover:cursor-pointer"
						>
							<Star
								color="orange"
								fill={
									starHover
										? index <= starHover
											? "orange"
											: "none"
										: newRating
										? index <= newRating
											? "orange"
											: "none"
										: initialRating
										? index <= Number(initialRating)
											? "orange"
											: "none"
										: "none"
								}
							/>
						</div>
					))}
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						className="w-full"
						onClick={() => {
							if (newRating !== null) {
								mutate({
									...resource,
									rating: newRating,
									description: "",
								});
								setOpen(false);
							}
						}}
						disabled={newRating === null}
					>
						Rate
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export const RatingButton = ({
	name,
	resource,
	initialUserRating,
}: {
	resource: Resource;
	name: string;
	initialUserRating?: UserRating | null;
}) => {
	const { data: userRating } = trpc.rating.getUserRating.useQuery(resource, {
		initialData: initialUserRating,
		staleTime: Infinity,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	return (
		<Link
			href={{
				query: {
					...resource,
					name,
				},
			}}
			className={buttonVariants({
				variant: "outline",
			})}
		>
			<Star
				color="orange"
				fill={userRating ? "orange" : "none"}
				size={18}
				className="mr-2"
			/>
			{userRating?.rating ? userRating.rating : "Rate"}
		</Link>
	);
};
