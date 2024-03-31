import { cn } from "@/utils/utils";
import React from "react";
import { Tag } from "./ui/Tag";

const Metadata = ({
	title,
	cover,
	type,
	tags,
	children,
	size = "base",
}: {
	title: string;
	cover?: string | React.ReactNode;
	type: string;
	tags?: (string | undefined)[];
	children: React.ReactNode;
	size?: "base" | "sm";
}) => {
	return (
		<>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start">
				{typeof cover === "string" ? (
					<img
						alt={`${title} cover`}
						src={cover}
						className={cn(
							"h-[200px] w-[200px] self-center rounded-xl sm:self-start",
							size === "sm" &&
								"h-[150px] w-[150px] sm:h-[200px] sm:w-[200px]"
						)}
					/>
				) : (
					<span className={"h-[150px] w-[150px] self-center"}>
						{cover}
					</span>
				)}
				<div className="flex flex-col items-center gap-4 sm:items-start">
					<p className="-mb-2 text-sm tracking-widest text-muted-foreground">
						{type.toUpperCase()}
					</p>
					<h1
						className={cn(
							"text-center sm:text-left",
							size === "sm" && "text-3xl sm:text-4xl"
						)}
					>
						{title}
					</h1>
					{tags && (
						<div className="flex flex-wrap justify-center gap-3 sm:justify-start">
							{tags
								.filter((tag) => Boolean(tag))
								.map((tag, index) => (
									<Tag variant="outline" key={index}>
										{tag}
									</Tag>
								))}
						</div>
					)}
					{children}
				</div>
			</div>
		</>
	);
};

export default Metadata;
