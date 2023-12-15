import { getProfile } from "@/app/_trpc/cached";
import UserAvatar from "@/components/UserAvatar";
import { Tabs } from "@/components/ui/Tabs";
import { Tag } from "@/components/ui/Tag";
import { notFound } from "next/navigation";

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
		<div className="flex flex-col gap-6 overflow-hidden">
			<div className="flex flex-col gap-6 sm:flex-row sm:items-start">
				<UserAvatar {...profile} size={160} />
				<div className="flex flex-col items-center gap-4 sm:items-start">
					<p className="text-sm tracking-widest text-muted-foreground">
						PROFILE
					</p>
					<h1 className="text-center sm:text-left">{profile.name}</h1>
					<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
						{["rock", "pop", "indie"].map((genre) => (
							<Tag key={genre} variant="outline">
								{genre}
							</Tag>
						))}
					</div>
					<p className="text-muted-foreground">
						21 | Reviewing music I like.
					</p>
				</div>
			</div>
			<Tabs
				tabs={[
					{
						label: "Recent",
						href: `/${handle}`,
					},
				]}
			/>
			{children}
		</div>
	);
};

export default Layout;