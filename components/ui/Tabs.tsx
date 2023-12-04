"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "utils/utils";

export const Tabs = ({
	tabs,
}: {
	tabs: {
		label: string;
		href: string;
	}[];
}) => {
	const pathname = usePathname();

	return (
		<div className="inline-flex h-10 max-w-min items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
			{tabs.map(({ href, label }) => (
				<Link
					key={href}
					href={href}
					className={cn(
						"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
						pathname === href &&
							"bg-background text-foreground shadow-sm"
					)}
				>
					{label}
				</Link>
			))}
		</div>
	);
};
