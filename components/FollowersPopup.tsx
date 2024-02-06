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

type Props = {
	title: string;
	followerCount: number;
	profiles: Profile[];
};

const FollowersPopup = ({ title, followerCount, profiles }: Props) => {
	const profileList = profiles.map((profile, index) => {
		return (
			<div className="pt-4">
				<ProfileItem key={index} profile={profile} onClick={() => {}} />
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
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{profileList}</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default FollowersPopup;
