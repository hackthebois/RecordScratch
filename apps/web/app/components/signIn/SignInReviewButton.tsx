import { Button } from "@/components/ui/Button";
import { Text } from "lucide-react";
import { SignInWrapper } from "./SignInWrapper";

export const SignInReviewButton = () => {
	return (
		<SignInWrapper>
			<Button variant="outline" className="gap-2 self-end">
				<Text size={18} color="#fb8500" />
				Review
			</Button>
		</SignInWrapper>
	);
};
