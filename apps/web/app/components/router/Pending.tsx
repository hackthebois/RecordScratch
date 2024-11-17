import { Loader2 } from "lucide-react";

export const PendingComponent = () => {
	return (
		<div className="mt-[15vh] flex h-full w-full flex-1 flex-col items-center justify-center">
			<Loader2 size={35} className="animate-spin" />
		</div>
	);
};
