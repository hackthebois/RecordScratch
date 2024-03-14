import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import {
	users,
	sessions,
	profile,
	ratings,
	followers,
	lists,
	listResources,
	sessionRelations,
	profileRelations,
	ratingsRelations,
	listResourcesRelations,
	listRelation,
} from "./schema";

const schema = {
	users,
	sessions,
	profile,
	ratings,
	followers,
	lists,
	listResources,
	sessionRelations,
	profileRelations,
	ratingsRelations,
	listResourcesRelations,
	listRelation,
};

// create the connection
const connection = new Client({
	url: process.env.DATABASE_URL,
});

export const db = drizzle(connection, { schema });
