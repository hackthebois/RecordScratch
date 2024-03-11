import { protectedProcedure, publicProcedure, router } from "@/server/trpc";
import {
	insertListSchema,
	insertListResourcesSchema,
	selectListSchema,
	selectListResourcesSchema,
	deleteListResourcesSchema,
	updateListSchema,
	filterUserListsSchema,
} from "@/types/list";
import { list_resources, lists, profile } from "../db/schema";
import { generateId } from "lucia";
import { and, desc, eq } from "drizzle-orm/sql";

export const listsRouter = router({
	getList: publicProcedure
		.input(selectListSchema)
		.query(async ({ ctx: { db }, input: { id } }) => {
			return (
				(await db.query.lists.findFirst({
					where: eq(lists.id, id),
					with: { profile: true },
				})) ?? null
			);
		}),

	getUserLists: publicProcedure
		.input(filterUserListsSchema)
		.query(async ({ ctx: { db }, input: { userId, category } }) => {
			let whereClause;
			if (category)
				whereClause = and(
					eq(lists.userId, userId),
					eq(lists.category, category)
				);
			else whereClause = and(eq(lists.userId, userId));

			return await db
				.select()
				.from(lists)
				.leftJoin(profile, eq(profile.userId, lists.userId))
				.where(whereClause);
		}),

	createList: protectedProcedure
		.input(insertListSchema)
		.mutation(async ({ ctx: { db, userId }, input: inputs }) => {
			const id = generateId(15);
			await db.insert(lists).values({ id, userId, ...inputs });
		}),

	updateList: protectedProcedure
		.input(updateListSchema)
		.mutation(
			async ({
				ctx: { db, userId },
				input: { id, name, description },
			}) => {
				const listExists: boolean = !!(await db.query.lists.findFirst({
					where: and(eq(lists.id, id), eq(lists.userId, userId)),
				}));

				if (listExists)
					await db
						.update(lists)
						.set({ name: name, description: description })
						.where(and(eq(lists.id, id), eq(lists.userId, userId)));
				else throw new Error("List Doesn't exist");
			}
		),

	deleteList: protectedProcedure
		.input(selectListSchema)
		.mutation(async ({ ctx: { db, userId }, input: { id } }) => {
			const listExists: boolean = !!(await db.query.lists.findFirst({
				where: and(eq(lists.id, id), eq(lists.userId, userId)),
			}));

			if (listExists)
				await db
					.delete(lists)
					.where(and(eq(lists.id, id), eq(lists.userId, userId)));
			else throw new Error("List Doesn't exist");
		}),

	resources: router({
		getTopFourResources: publicProcedure
			.input(selectListResourcesSchema)
			.query(async ({ ctx: { db }, input: { listId } }) => {
				return await db
					.select()
					.from(list_resources)
					.where(eq(list_resources.listId, listId))
					.orderBy(list_resources.position)
					.limit(4);
			}),
		getListResources: publicProcedure
			.input(selectListResourcesSchema)
			.query(async ({ ctx: { db }, input: { listId } }) => {
				return await db
					.select()
					.from(list_resources)
					.where(eq(list_resources.listId, listId))
					.orderBy(list_resources.position);
			}),

		createListResource: protectedProcedure
			.input(insertListResourcesSchema)
			.mutation(async ({ ctx: { db, userId }, input: inputs }) => {
				const listOwner = !!(await db.query.lists.findFirst({
					where: and(
						eq(lists.userId, userId),
						eq(lists.id, inputs.listId)
					),
				}));
				if (listOwner) {
					const lastPosition =
						(
							await db.query.list_resources.findFirst({
								where: eq(list_resources.listId, inputs.listId),
								orderBy: [desc(list_resources.position)],
							})
						)?.position ?? 0;

					await db
						.insert(list_resources)
						.values({ ...inputs, position: lastPosition + 1 });
				} else throw new Error("cannot add to list if not owner");
			}),

		deleteListResource: protectedProcedure
			.input(deleteListResourcesSchema)
			.mutation(async ({ ctx: { db, userId }, input: inputs }) => {
				const listOwner = !!(await db.query.lists.findFirst({
					where: and(
						eq(lists.userId, userId),
						eq(lists.id, inputs.listId)
					),
				}));
				if (listOwner) {
					await db
						.delete(list_resources)
						.where(
							and(
								eq(list_resources.listId, inputs.listId),
								eq(list_resources.resourceId, inputs.resourceId)
							)
						);
				} else throw new Error("cannot delete from list if not owner");
			}),
	}),
});
