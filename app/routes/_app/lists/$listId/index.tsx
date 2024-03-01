import { PendingComponent } from "@/components/router/Pending";
import {
	ErrorComponent,
	createFileRoute,
	useNavigate,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_app/lists/$listId/")({
	component: List,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
});

function List() {}
