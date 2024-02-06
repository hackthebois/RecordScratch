import { Profile } from "@/types/profile";
import { Button } from "./ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/Dialog";
import { ProfileItem } from "./ProfileItem";
import { ScrollArea } from "./ui/ScrollArea";

type Props = {
	title: string;
	followerCount: number;
	profiles: Profile[];
};

const FollowersPopup = ({ title, followerCount, profiles }: Props) => {
	const profileList = profiles.map((profile, index) => {
		return (
			<div key={index} className="py-1">
				<ProfileItem profile={profile} onClick={() => {}} />
			</div>
		);
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="text-md rounded-lg px-3 py-1">
					{followerCount}
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[20rem] md:max-w-[26rem] lg:max-w-[26rem]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<ScrollArea className="flex max-h-[24rem] flex-col gap-4 overflow-visible px-4 md:max-h-[30rem] lg:max-h-[35rem]">
					{profileList}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default FollowersPopup;
