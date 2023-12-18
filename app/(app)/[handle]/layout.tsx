import { getProfile } from "@/app/_trpc/cached";
import UserAvatar from "@/components/UserAvatar";
import { LinkTabs } from "@/components/ui/LinkTabs";
import { auth } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { ProfileDialog } from "./ProfileDialog";

const Layout = async ({
	params: { handle },
	children,
}: {
	params: {
		handle: string;
	};
	children: React.ReactNode;
}) => {
	const profile = await getProfile(handle);
	const { userId } = auth();

	if (!profile) {
		notFound();
	}

	return (
		<div className="flex flex-col gap-6 overflow-hidden">
			<div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
				<UserAvatar {...profile} size={160} />
				<div className="flex flex-col items-center sm:items-start">
					<p className="pb-4 text-sm tracking-widest text-muted-foreground">
						PROFILE
					</p>
					<h1 className="pb-2 text-center sm:text-left">
						{profile.name}
					</h1>
					<p className="pb-4 text-center text-muted-foreground">
						@{profile.handle}
					</p>
					<p className="text-center text-sm sm:text-left sm:text-base">
						{profile.bio || "No bio yet"}
					</p>
					{profile.userId === userId && (
						<ProfileDialog profile={profile} />
					)}
				</div>
			</div>
			<LinkTabs
				tabs={[
					{
						label: "Ratings",
						href: `/${handle}`,
					},
				]}
			/>
			{children}
		</div>
	);
};

export default Layout;
