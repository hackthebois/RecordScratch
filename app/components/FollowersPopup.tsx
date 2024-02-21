import { api } from "@/trpc/react";
import { useState } from "react";
import { ProfileItem } from "./ProfileItem";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/Dialog";
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

	// gets the profiles in each follower
	const profileList = profiles?.map(({ profile }, index) => {
		return (
			<div key={index} className="py-1 pr-4">
				<ProfileItem
					profile={profile}
					onClick={() => {
						setOpen(false);
					}}
				/>
			</div>
		);
	});

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button className="text-md rounded-lg px-4 py-1">{followerCount}</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[20rem] sm:max-w-[24rem]  md:max-w-[28rem] lg:max-w-[28rem]">
				<DialogHeader className="items-center">
					<DialogTitle>{type[0].toUpperCase() + type.slice(1)}</DialogTitle>
				</DialogHeader>
				<ScrollArea className="flex max-h-[20rem] flex-col gap-4 overflow-visible px-2 md:max-h-[24rem]  lg:max-h-[28rem]">
					{profileList}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default FollowersPopup;
