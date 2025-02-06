import { commentsLikes, comments } from "@recordscratch/db";
import {
  CreateCommentSchema,
  DeleteCommentSchema,
  SelectCommentSchema,
} from "@recordscratch/types";
import { and, count, desc, eq, isNull } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { createCommentNotification } from "../notifications";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const commentsRouter = router({
  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx: { db }, input }) => {
      return await db.query.comments.findFirst({
        where: and(eq(comments.id, input.id)),
        with: {
          profile: true,
          parent: {
            with: {
              profile: true,
            },
          },
          replies: {
            with: {
              profile: true,
              parent: {
                with: {
                  profile: true,
                },
              },
            },
          },
        },
      });
    }),
  count: {
    rating: publicProcedure
      .input(SelectCommentSchema)
      .query(async ({ ctx: { db }, input: { resourceId, authorId } }) => {
        const countList = await db
          .select({
            count: count(),
          })
          .from(comments)
          .where(
            and(
              eq(comments.resourceId, resourceId),
              eq(comments.authorId, authorId),
            ),
          );
        return countList[0].count;
      }),
    reply: publicProcedure
      .input(
        z.object({
          id: z.string(),
        }),
      )
      .query(async ({ ctx: { db }, input: { id } }) => {
        const countList = await db
          .select({
            count: count(),
          })
          .from(comments)
          .where(eq(comments.rootId, id));
        return countList[0].count;
      }),
  },
  list: publicProcedure
    .input(SelectCommentSchema)
    .query(async ({ ctx: { db }, input }) => {
      return await db.query.comments.findMany({
        where: and(
          eq(comments.resourceId, input.resourceId),
          eq(comments.authorId, input.authorId),
          isNull(comments.rootId),
        ),
        with: {
          profile: true,
        },
        orderBy: (comments) => [desc(comments.createdAt)],
      });
    }),
  create: protectedProcedure
    .input(CreateCommentSchema)
    .mutation(async ({ ctx: { db, userId }, input: notification }) => {
      const id = uuidv4();
      await db.insert(comments).values({ ...notification, userId, id });
      await createCommentNotification(db, id);
    }),
  delete: protectedProcedure
    .input(DeleteCommentSchema)
    .mutation(async ({ ctx: { db, userId }, input: { id } }) => {
      await db
        .delete(comments)
        .where(and(eq(comments.id, id), eq(comments.userId, userId)));
    }),
  likes: {
    getLikes: publicProcedure
      .input(z.object({ commentId: z.string() }))
      .query(async ({ ctx: { db }, input: { commentId } }) => {
        const countList = await db
          .select({
            count: count(),
          })
          .from(commentsLikes)
          .where(eq(commentsLikes.commentId, commentId));
        return countList[0].count;
      }),
    get: protectedProcedure
      .input(z.object({ commentId: z.string() }))
      .query(async ({ ctx: { db, userId }, input: { commentId } }) => {
        const like = await db.query.commentsLikes.findFirst({
          where: and(
            eq(commentsLikes.commentId, commentId),
            eq(commentsLikes.authorId, userId),
          ),
        });
        return like ? like : null;
      }),
    like: protectedProcedure
      .input(z.object({ commentId: z.string() }))
      .mutation(async ({ ctx: { db, userId }, input: { commentId } }) => {
        await db.insert(commentsLikes).values({
          commentId,
          authorId: userId,
        });
      }),
    unlike: protectedProcedure
      .input(z.object({ commentId: z.string() }))
      .mutation(async ({ ctx: { db, userId }, input: { commentId } }) => {
        await db
          .delete(commentsLikes)
          .where(
            and(
              eq(commentsLikes.commentId, commentId),
              eq(commentsLikes.authorId, userId),
            ),
          );
      }),
  },
});
