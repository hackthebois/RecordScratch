import SignInButton from "@/components/SignInButton";
import { UserAvatar } from "@/components/UserAvatar";
import { buttonVariants } from "@/components/ui/Button";
import { auth } from "@clerk/nextjs";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { getMyProfile } from "../_api";

export const UserButton = async () => {
	unstable_noStore();
	const { userId } = auth();

	if (!userId) {
		return <SignInButton />;
	}

	const profile = await getMyProfile(userId);

	if (!profile) {
		return null;
	}

	return (
		<Link
			href={`/${profile.handle}`}
			className={buttonVariants({
				variant: "link",
				className: "relative h-[36px] w-[36px] rounded-full",
			})}
		>
			<UserAvatar {...profile} size={36} />
		</Link>
	);
};

export default UserButton;
