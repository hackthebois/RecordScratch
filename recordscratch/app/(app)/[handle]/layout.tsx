import { getProfile } from "@/recordscratch/app/_api";
import FollowerMenu from "@/recordscratch/components/FollowersMenu";
import { UserAvatar } from "@/recordscratch/components/UserAvatar";
import { PathnameTabs } from "@/recordscratch/components/ui/LinkTabs";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
	params: { handle },
}: {
	params: {
		handle: string;
	};
}): Promise<Metadata> {
	const profile = await getProfile(handle);

	if (!profile) return {};

	return {
		title: `${profile.name} (@${profile.handle})`,
		description: profile.bio,
		openGraph: {
			images: profile.imageUrl ? [profile.imageUrl] : undefined,
			siteName: "RecordScratch",
		},
	};
}

export const fetchCache = "force-cache";

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

	if (!profile) notFound();

	const isUser = profile.userId === auth().userId;

	const appendTabs = isUser
		? [
				{
					label: "Settings",
					href: `/${handle}/settings`,
				},
		  ]
		: [];

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
				<UserAvatar {...profile} size={160} />
				<div className="flex flex-col items-center sm:items-start">
					<p className="pb-4 text-sm tracking-widest text-muted-foreground">
						PROFILE
					</p>
					<h1 className="pb-2 text-center sm:text-left">
						{profile.name}
					</h1>
					<p className="pb-3 text-center text-muted-foreground">
						@{profile.handle}
					</p>
					<p className="pb-3 text-center text-sm sm:text-left sm:text-base">
						{profile.bio || "No bio yet"}
					</p>
					<FollowerMenu profileId={profile.userId} />
				</div>
			</div>
			<PathnameTabs
				tabs={[
					{
						label: "Ratings",
						href: `/${handle}`,
					},
					...appendTabs,
				]}
			/>
			{children}
		</div>
	);
};

export default Layout;
