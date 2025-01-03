import { cn } from "@recordscratch/lib";
import {
	AlertCircle as LucideAlertCircle,
	CheckCircle as LucideCheckCircle,
	XCircle as LucideXCircle,
	ArrowLeft as LucideArrowLeft,
	AtSign as LucideAtSign,
	Bell as LucideBell,
	BellOff as LucideBellOff,
	BellRing as LucideBellRing,
	Dot as LucideDot,
	Eraser as LucideEraser,
	Heart as LucideHeart,
	Home as LucideHome,
	HelpCircle as LucideHelpCircle,
	ListMusic as LucideListMusic,
	ListPlus as LucideListPlus,
	Loader2 as LucideLoader2,
	Mail as LucideMail,
	MessageCircle as LucideMessageCircle,
	MessageSquareText as LucideMessageSquareText,
	Moon as LucideMoon,
	MoonStar as LucideMoonStar,
	MoreHorizontal as LucideMoreHorizontal,
	Rows3 as LucideRows3,
	Reply as LucideReply,
	Search as LucideSearch,
	Send as LucideSend,
	Settings as LucideSettings,
	Square as LucideSquare,
	SquareCheck as LucideSquareCheck,
	Star as LucideStar,
	Sun as LucideSun,
	Trash as LucideTrash,
	Trash2 as LucideTrash2,
	User as LucideUser,
	UserMinus as LucideUserMinus,
	UserPen as LucideUserPen,
	X as LucideX,
	LucideProps,
	LucideIcon,
} from "lucide-react-native";
import { cssInterop } from "nativewind";
import React from "react";

function iconWithClassName(icon: LucideIcon) {
	return (props: LucideProps) => {
		// Apply cssInterop if necessary for styles
		cssInterop(icon, {
			className: {
				target: "style",
				nativeStyleToProp: {
					color: true,
					opacity: true,
				},
			},
		});

		// Return the icon component with the added "text-foreground" class
		return React.createElement(icon, {
			...props,
			className: cn(props.className, props.color ?? "text-foreground"), // Append "text-foreground" class
		});
	};
}

// Export all icons
export const AlertCircle = iconWithClassName(LucideAlertCircle);
export const CheckCircle = iconWithClassName(LucideCheckCircle);
export const XCircle = iconWithClassName(LucideXCircle);
export const ArrowLeft = iconWithClassName(LucideArrowLeft);
export const AtSign = iconWithClassName(LucideAtSign);
export const Bell = iconWithClassName(LucideBell);
export const BellOff = iconWithClassName(LucideBellOff);
export const BellRing = iconWithClassName(LucideBellRing);
export const Dot = iconWithClassName(LucideDot);
export const Eraser = iconWithClassName(LucideEraser);
export const Heart = iconWithClassName(LucideHeart);
export const HelpCircle = iconWithClassName(LucideHelpCircle);
export const Home = iconWithClassName(LucideHome);
export const ListMusic = iconWithClassName(LucideListMusic);
export const ListPlus = iconWithClassName(LucideListPlus);
export const Loader2 = iconWithClassName(LucideLoader2);
export const Mail = iconWithClassName(LucideMail);
export const MessageCircle = iconWithClassName(LucideMessageCircle);
export const MessageSquareText = iconWithClassName(LucideMessageSquareText);
export const Moon = iconWithClassName(LucideMoon);
export const MoonStar = iconWithClassName(LucideMoonStar);
export const MoreHorizontal = iconWithClassName(LucideMoreHorizontal);
export const Rows3 = iconWithClassName(LucideRows3);
export const Reply = iconWithClassName(LucideReply);
export const Search = iconWithClassName(LucideSearch);
export const Send = iconWithClassName(LucideSend);
export const Settings = iconWithClassName(LucideSettings);
export const Square = iconWithClassName(LucideSquare);
export const SquareCheck = iconWithClassName(LucideSquareCheck);
export const Star = iconWithClassName(LucideStar);
export const Sun = iconWithClassName(LucideSun);
export const Trash = iconWithClassName(LucideTrash);
export const Trash2 = iconWithClassName(LucideTrash2);
export const User = iconWithClassName(LucideUser);
export const UserMinus = iconWithClassName(LucideUserMinus);
export const UserPen = iconWithClassName(LucideUserPen);
export const X = iconWithClassName(LucideX);