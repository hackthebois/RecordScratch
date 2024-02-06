"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { cn } from "utils/utils";

export const PathnameTabs = ({
	tabs,
}: {
	tabs: {
		label: string;
		href: string;
	}[];
}) => {
	const pathname = usePathname();

	return (
		<div className="flex h-10 w-full items-center justify-center rounded-md bg-muted p-1 text-muted-foreground sm:w-auto sm:max-w-min">
			{tabs.map(({ href, label }) => (
				<Link
					key={href}
					href={href}
					className={cn(
						"inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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

export const QueryTabs = ({
	tabs,
	param,
}: {
	param: string;
	tabs: {
		label: string;
		value: string | null;
	}[];
}) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const createQueryString = useCallback(
		(name: string, value: string | null) => {
			const params = new URLSearchParams(searchParams.toString());

			if (value === null) params.delete(name);
			else params.set(name, value);

			return params.toString();
		},
		[searchParams]
	);

	console.log(searchParams.get(param));

	return (
		<div className="flex h-10 w-full items-center justify-center rounded-md bg-muted p-1 text-muted-foreground sm:w-auto sm:max-w-min">
			{tabs.map(({ value, label }) => (
				<Link
					key={value}
					href={pathname + "?" + createQueryString(param, value)}
					className={cn(
						"inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
						searchParams.get(param) === value &&
							"bg-background text-foreground shadow-sm"
					)}
				>
					{label}
				</Link>
			))}
		</div>
	);
};
