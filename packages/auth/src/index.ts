import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { getDB, sessions, users } from "@recordscratch/db";
import { Lucia } from "lucia";

export const getLucia = () => {
	const db = getDB();
	const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

	return new Lucia(adapter, {
		sessionCookie: {
			attributes: {
				secure: process.env.NODE_ENV === "production",
			},
		},
	});
};

// declare module "lucia" {
// 	interface Register {
// 		Lucia: getLucia;
// 		DatabaseUserAttributes: {
// 			email: string;
// 			googleId: string;
// 		};
// 	}
// }
