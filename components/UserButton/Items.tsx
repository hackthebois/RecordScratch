"use client";

import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { revalidateUser } from "@/app/actions";
import { useClerk, useUser } from "@clerk/nextjs";
import { DropdownMenuItem } from "../ui/DropdownMenu";

export const ThemeItem = () => {
	const { theme, setTheme, systemTheme } = useTheme();

	const currentTheme = theme === "system" ? systemTheme : theme;

	return (
		<DropdownMenuItem
			onClick={(e) => {
				e.preventDefault();
				setTheme(theme === "light" ? "dark" : "light");
			}}
		>
			<Sun
				size={15}
				className="mr-1.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				size={15}
				className="absolute mr-1.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			{currentTheme === "dark" ? "Dark" : "Light"}
		</DropdownMenuItem>
	);
};

export const SignOutItem = () => {
	const { signOut } = useClerk();
	const { user } = useUser();
	return (
		<DropdownMenuItem
			onClick={() => {
				signOut();
				if (user) revalidateUser(user.id);
				user?.reload();
			}}
		>
			<LogOut size={15} className="mr-1.5" />
			Sign out
		</DropdownMenuItem>
	);
};
