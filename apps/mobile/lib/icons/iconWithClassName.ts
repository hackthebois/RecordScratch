import { AlertCircle, CheckCircle, LucideIcon, XCircle } from "lucide-react-native";
import { cssInterop } from "nativewind";

export function iconWithClassName(icon: LucideIcon) {
	cssInterop(icon, {
		className: {
			target: "style",
			nativeStyleToProp: {
				color: true,
				opacity: true,
			},
		},
	});
}

iconWithClassName(AlertCircle);
iconWithClassName(CheckCircle);
iconWithClassName(XCircle);

export { AlertCircle, CheckCircle, XCircle };
