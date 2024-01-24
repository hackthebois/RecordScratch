import AuthProvider from "@/app/AuthProvider";
import { getProfile } from "@/app/_api";
import { updateProfile } from "@/app/_api/actions";
import { Label } from "@/components/ui/Label";
import { auth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { EditProfile } from "../_components/EditProfile";
import { SignOutButton } from "../_components/SignOutButton";

const ThemeToggle = dynamic(() => import("./_components/ThemeToggle"), {
	ssr: false,
});

const Page = async ({
	params: { handle },
}: {
	params: {
		handle: string;
	};
}) => {
	const profile = await getProfile(handle);

	if (!profile) notFound();

	const isUser = profile.userId === auth().userId;

	if (!isUser) notFound();

	return (
		<AuthProvider>
			<div className="flex flex-col gap-8">
				<h3>Appearence</h3>
				<div className="flex items-center justify-between">
					<div className="flex flex-col items-start gap-2">
						<Label>Theme</Label>
						<p className="text-sm text-muted-foreground">
							Select a theme for your interface
						</p>
					</div>
					<ThemeToggle />
				</div>
				<h3>Account</h3>
				<div className="flex items-center justify-between">
					<div className="flex flex-col items-start gap-2">
						<Label>Edit Profile</Label>
						<p className="text-sm text-muted-foreground">
							Update your profile information and image
						</p>
					</div>
					<EditProfile
						profile={profile}
						updateProfile={updateProfile}
					/>
				</div>
				<SignOutButton />
			</div>
		</AuthProvider>
	);
};

export default Page;
