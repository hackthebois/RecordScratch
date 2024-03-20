import { protectedProcedure, publicProcedure, router } from "@/server/trpc";
import {
	deleteListResourcesSchema,
	filterUserListsSchema,
	insertListResourcesSchema,
	insertListSchema,
	selectListResourcesSchema,
	selectListSchema,
	updateListSchema,
	listOfResourcesSchema,
} from "@/types/list";
import { listResources, lists } from "../db/schema";
import { generateId } from "lucia";
import { and, asc, desc, eq } from "drizzle-orm/sql";

export const listsRouter = router({
	get: publicProcedure
		.input(selectListSchema)
		.query(async ({ ctx: { db }, input: { id } }) => {
			return (
				(await db.query.lists.findFirst({
					where: eq(lists.id, id),
					with: { profile: true },
				})) ?? null
			);
		}),

	getUser: publicProcedure
		.input(filterUserListsSchema)
		.query(async ({ ctx: { db }, input: { userId, category } }) => {
			let whereClause;
			if (category)
				whereClause = and(
					eq(lists.userId, userId),
					eq(lists.category, category)
				);
			else whereClause = and(eq(lists.userId, userId));

			return await db.query.lists.findMany({
				with: {
					resources: {
						limit: 4,
						orderBy: [asc(listResources.position)],
					},
					profile: true,
				},
				where: whereClause,
				orderBy: [desc(lists.updatedAt)],
			});
		}),

	create: protectedProcedure
		.input(insertListSchema)
		.mutation(async ({ ctx: { db, userId }, input: inputs }) => {
			await db
				.insert(lists)
				.values({ id: generateId(15), userId, ...inputs });
		}),

	update: protectedProcedure
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

	delete: protectedProcedure
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
		get: publicProcedure
			.input(selectListResourcesSchema)
			.query(async ({ ctx: { db }, input: { listId } }) => {
				return await db
					.select()
					.from(listResources)
					.where(eq(listResources.listId, listId))
					.orderBy(listResources.position);
			}),

		create: protectedProcedure
			.input(insertListResourcesSchema)
			.mutation(async ({ ctx: { db, userId }, input: inputs }) => {
				const listOwner = !!(await db.query.lists.findFirst({
					where: and(
						eq(lists.userId, userId),
						eq(lists.id, inputs.listId)
					),
				}));
				const resourceExists =
					!!(await db.query.listResources.findFirst({
						where: and(
							eq(listResources.resourceId, inputs.resourceId),
							eq(listResources.listId, inputs.listId)
						),
					}));

				if (listOwner && !resourceExists) {
					const lastPosition =
						(
							await db.query.listResources.findFirst({
								where: eq(listResources.listId, inputs.listId),
								orderBy: [desc(listResources.position)],
							})
						)?.position ?? 0;

					await db
						.insert(listResources)
						.values({ ...inputs, position: lastPosition + 1 });

					await db
						.update(lists)
						.set({ updatedAt: new Date() })
						.where(eq(lists.id, inputs.listId));
				}
			}),

		delete: protectedProcedure
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
						.delete(listResources)
						.where(
							and(
								eq(listResources.listId, inputs.listId),
								eq(listResources.resourceId, inputs.resourceId)
							)
						);
				} else throw new Error("cannot delete from list if not owner");
			}),

		updatePositions: protectedProcedure
			.input(listOfResourcesSchema)
			.mutation(
				async ({
					ctx: { db, userId },
					input: { listId, resources },
				}) => {
					const listOwner = !!(await db.query.lists.findFirst({
						where: and(
							eq(lists.userId, userId),
							eq(lists.id, listId)
						),
					}));
					if (listOwner) await Promise;
					await db.transaction(async () => {
						await db
							.update(lists)
							.set({ updatedAt: new Date() })
							.where(eq(lists.id, listId)),
							await Promise.all(
								resources.map((item, index) => {
									return db
										.update(listResources)
										.set({ position: index + 1 })
										.where(
											eq(
												listResources.resourceId,
												item.resourceId
											)
										);
								})
							);
					});
				}
			),

		multipleDelete: protectedProcedure
			.input(listOfResourcesSchema)
			.mutation(
				async ({
					ctx: { db, userId },
					input: { listId, resources },
				}) => {
					const listOwner = !!(await db.query.lists.findFirst({
						where: and(
							eq(lists.userId, userId),
							eq(lists.id, listId)
						),
					}));

					if (listOwner)
						await db.transaction(async () => {
							await db
								.update(lists)
								.set({ updatedAt: new Date() })
								.where(eq(lists.id, listId));
							await Promise.all(
								resources.map((item) => {
									return db
										.delete(listResources)
										.where(
											eq(
												listResources.resourceId,
												item.resourceId
											)
										);
								})
							);
						});
				}
			),
	}),
});