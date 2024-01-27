import { SignInWrapper } from "@/components/SignInWrapper";
import { UserAvatar } from "@/components/UserAvatar";
import { Button, buttonVariants } from "@/components/ui/Button";
import { auth } from "@clerk/nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { getMyProfile } from "../_api";

export const UserButton = async () => {
	cookies();
	const { userId } = auth();

	if (!userId) {
		return (
			<SignInWrapper>
				<Button>Sign In</Button>
			</SignInWrapper>
		);
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