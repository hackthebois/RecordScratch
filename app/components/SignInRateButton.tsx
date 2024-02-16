import { SignInWrapper } from "@/components/SignInWrapper";
import { Star } from "lucide-react";
import { Button } from "./ui/Button";

export const SignInRateButton = () => {
	return (
		<SignInWrapper>
			<Button variant="outline" size="sm">
				<Star color="#fb8500" fill="none" size={18} className="mr-2" />
				Rate
			</Button>
		</SignInWrapper>
	);
};
