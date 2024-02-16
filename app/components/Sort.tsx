"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { usePathname } from "next/navigation";

const Sort = ({
	options,
	queryParam,
	name,
	defaultValue,
}: {
	options: {
		value: string;
		label: string;
	}[];
	queryParam: string;
	name: string;
	defaultValue?: string;
}) => {
	const navigate = useNavigate();
	const pathname = usePathname();
	const onChange = (value: string) => {
		navigate(`${pathname}?${queryParam}=${value}`);
	};

	return (
		<Select onValueChange={onChange} defaultValue={defaultValue}>
			<SelectTrigger className="w-[130px]">
				<SelectValue placeholder={name} />
			</SelectTrigger>
			<SelectContent>
				{options.map((value) => (
					<SelectItem key={value.value} value={value.value}>
						{value.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default Sort;
