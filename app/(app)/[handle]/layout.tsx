import { EditProfileButton } from "@/app/_auth/EditProfileButton";
import { getProfile } from "@/app/_trpc/cached";
import { UserAvatar } from "@/components/UserAvatar";
import { LinkTabs } from "@/components/ui/LinkTabs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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

	if (!profile) {
		notFound();
	}

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
					<p className="pb-4 text-center text-muted-foreground">
						@{profile.handle}
					</p>
					<p className="text-center text-sm sm:text-left sm:text-base">
						{profile.bio || "No bio yet"}
					</p>
					<Suspense fallback={null}>
						<EditProfileButton handle={handle} />
					</Suspense>
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
