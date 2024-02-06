import { Button } from "./ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/Dialog";

type Props = {
	followerCount: number;
};

const FollowersPopup = ({ followerCount }: Props) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="text-md rounded-lg px-3 py-1">
					{followerCount}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Followers</DialogTitle>
					<DialogDescription>Fellow Scratchers</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default FollowersPopup;
