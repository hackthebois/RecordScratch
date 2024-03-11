import { api } from "@/trpc/react";
import { useState } from "react";
import { ProfileItem } from "./ProfileItem";
import { Button } from "./ui/Button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/Dialog";
import { ScrollArea } from "./ui/ScrollArea";

const FollowersPopup = ({
	followerCount,
	type,
	profileId,
}: {
	followerCount: number;
	type: "followers" | "following";
	profileId: string;
}) => {
	const { data: profiles } = api.profiles.followProfiles.useQuery({
		profileId,
		type,
	});
	const [open, setOpen] = useState(false);

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button size="sm" className="h-8">
					{followerCount}
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[24rem] sm:max-w-[28rem]  md:max-w-[28rem] lg:max-w-[28rem]">
				<DialogHeader className="items-center">
					<DialogTitle>
						{type[0].toUpperCase() + type.slice(1)}
					</DialogTitle>
				</DialogHeader>
				<ScrollArea className="flex max-h-96 flex-col gap-3">
					<div className="flex flex-col gap-3 pb-4">
						{profiles?.map(({ profile }, index) => (
							<ProfileItem
								key={index}
								profile={profile}
								onClick={() => {
									setOpen(false);
								}}
							/>
						))}
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default FollowersPopup;
