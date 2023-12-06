"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";

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
	const router = useRouter();
	const pathname = usePathname();
	const onChange = (value: string) => {
		router.push(`${pathname}?${queryParam}=${value}`);
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
