import { getProfile } from "@/app/_api";
import { Label } from "@/components/ui/Label";
import { auth } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { ThemeToggle } from "./_components/ThemeToggle";

type Props = {};

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
		<div className="py-4">
			<div className="flex items-center justify-between">
				<div className="flex flex-col items-start gap-2">
					<Label>Theme</Label>
					<p className="text-sm text-muted-foreground">
						Select a theme for your interface
					</p>
				</div>
				<ThemeToggle />
			</div>
		</div>
	);
};

export default Page;
