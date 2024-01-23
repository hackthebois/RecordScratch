import AuthProvider from "@/app/AuthProvider";
import { getProfile } from "@/app/_api";
import { updateProfile } from "@/app/_api/actions";
import { UserAvatar } from "@/components/UserAvatar";
import { LinkTabs } from "@/components/ui/LinkTabs";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EditProfile } from "./_components/EditProfile";
import { SignOutButton } from "./_components/SignOutButton";

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
					<p className="pb-4 text-center text-muted-foreground">
						@{profile.handle}
					</p>
					<p className="text-center text-sm sm:text-left sm:text-base">
						{profile.bio || "No bio yet"}
					</p>
					{isUser && (
						<Suspense>
							<AuthProvider>
								<div className="flex gap-2 pt-4">
									<EditProfile
										profile={profile}
										updateProfile={updateProfile}
									/>
									<SignOutButton />
								</div>
							</AuthProvider>
						</Suspense>
					)}
				</div>
			</div>
			<LinkTabs
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
