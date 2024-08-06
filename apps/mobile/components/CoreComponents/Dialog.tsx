import { Button } from "./Button";
import React from "react";
import { cn } from "@recordscratch/lib";
import { Dialog as UILibDialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";

const Dialog = ({
	open,
	setOpen,
	onOpen,
	triggerOutline,
	children,
	className,
	contentClassName,
}: {
	open: boolean;
	setOpen: (_: boolean) => void;
	onOpen?: () => void;
	children: React.ReactNode;
	triggerOutline?: React.ReactNode;
	className?: string;
	contentClassName?: string;
}) => {
	const trigger = triggerOutline ? (
		triggerOutline
	) : (
		<Button className="h-10 gap-1 rounded pb-5 pr-3 pt-5" variant="secondary">
			<Text>Open</Text>
		</Button>
	);

	return (
		<UILibDialog
			onOpenChange={(open) => {
				if (onOpen) onOpen();
				setOpen(open);
			}}
			open={open}
			className={cn(className)}
		>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className={cn(contentClassName)}>{children}</DialogContent>
		</UILibDialog>
	);
};

export default Dialog;
