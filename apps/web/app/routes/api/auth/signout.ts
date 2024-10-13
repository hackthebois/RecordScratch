import { getLucia } from "@recordscratch/auth";
import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { getCookie, getEvent, setCookie } from "vinxi/http";

export const Route = createAPIFileRoute("/api/auth/signout")({
	GET: async () => {
		const lucia = getLucia();

		const event = getEvent();
		const session = getCookie(event, "auth_session");

		if (!session)
			return json(
				{ message: "No session" },
				{
					status: 401,
				}
			);

		const blankCookie = lucia.createBlankSessionCookie();
		setCookie(
			event,
			blankCookie.name,
			blankCookie.value,
			blankCookie.attributes
		);
		await lucia.invalidateSession(session);

		return json({ message: "Success." });
	},
});
