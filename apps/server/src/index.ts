import { Context, Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "@recordscratch/api";
import { validateSessionToken } from "@recordscratch/auth";
import {
  commentNotifications,
  comments,
  followers,
  followNotifications,
  getDB,
  likeNotifications,
  likes,
  listResources,
  lists,
  profile,
  pushTokens,
  ratings,
  sessions,
  users,
} from "@recordscratch/db";
import { eq, inArray, or } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { handleUser, validateState } from "@recordscratch/auth";
import { Google, generateCodeVerifier, generateState } from "arctic";
import { z } from "zod";
import { getCookie, setCookie } from "hono/cookie";
import { contextStorage } from "hono/context-storage";
import type { ServerEnv } from "@recordscratch/types";
import { createTRPCContext } from "@recordscratch/api";

const app = new Hono<{ Bindings: ServerEnv }>();

app.use(contextStorage());

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_, c) => {
      return createTRPCContext({
        sessionId: c.req.header("Authorization") ?? getCookie(c, "session"),
        c,
      });
    },
  }),
);

// Proxy route for Deezer API
app.get("/music/**", async (c) => {
  const url = c.req.path.replace("/music/", "https://api.deezer.com/");
  return fetch(url, { ...c.req.raw });
});

app.get("/ingest/**", async (c) => {
  const url = c.req.path.replace("/ingest/", "https://app.posthog.com/");
  return fetch(url, { ...c.req.raw });
});

app.get("/api/auth/me", async (c) => {
  const db = getDB(c.env.DATABASE_URL);
  const query = c.req.query();
  const sessionId =
    (query.sessionId as string | undefined) ??
    c.req.header("Authorization") ??
    getCookie(c, "session");
  if (!sessionId) return c.json({ user: null });

  const { user } = await validateSessionToken(c, sessionId);

  if (!user) {
    return c.json({ user: null });
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    with: {
      profile: true,
      pushTokens: true,
    },
  });

  const expoPushToken = c.req.header("Expo-Push-Token");

  // Insert the expo push token
  if (
    expoPushToken &&
    // Only insert the token if the user exists
    existingUser &&
    // Don't insert the same token twice
    !existingUser?.pushTokens.find((token) => token.token === expoPushToken)
  ) {
    await db
      .insert(pushTokens)
      .values({ token: expoPushToken, userId: user.id });

    return c.json({
      user: {
        ...existingUser,
        pushTokens: [...existingUser.pushTokens, expoPushToken],
      },
    });
  }

  return c.json({ user: existingUser });
});

app.delete("/api/auth/delete", async (c) => {
  const session = c.req.header("Authorization");
  if (!session) throw new HTTPException(401, { message: "Unauthorized" });
  const { user } = await validateSessionToken(c, session);

  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  // Delete user ratings and comments
  const db = getDB(c.env.DATABASE_URL);
  await Promise.all([
    // Delete comments from user or to user
    db
      .delete(comments)
      .where(or(eq(comments.authorId, user.id), eq(comments.userId, user.id))),
    // Delete followers and following
    db
      .delete(followers)
      .where(
        or(eq(followers.userId, user.id), eq(followers.followingId, user.id)),
      ),
    // Delete list resources based on list owner
    async () => {
      const listsList = await db.query.lists.findMany({
        where: eq(lists.userId, user.id),
        with: {
          resources: true,
        },
      });
      const listIds = listsList.map(({ id }) => id);
      await db
        .delete(listResources)
        .where(inArray(listResources.listId, listIds));
    },
    // Delete likes from user or to user
    db
      .delete(likes)
      .where(or(eq(likes.userId, user.id), eq(likes.authorId, user.id))),
    // Delete notifications from user or to user
    db
      .delete(commentNotifications)
      .where(
        or(
          eq(commentNotifications.userId, user.id),
          eq(commentNotifications.fromId, user.id),
        ),
      ),
    db
      .delete(followNotifications)
      .where(
        or(
          eq(followNotifications.userId, user.id),
          eq(followNotifications.fromId, user.id),
        ),
      ),
    db
      .delete(likeNotifications)
      .where(
        or(
          eq(likeNotifications.userId, user.id),
          eq(likeNotifications.fromId, user.id),
        ),
      ),
    // Delete sessions
    db.delete(sessions).where(eq(sessions.userId, user.id)),
    // Delete push tokens
    db.delete(pushTokens).where(eq(pushTokens.userId, user.id)),
    // Delete profile
    db.delete(profile).where(eq(profile.userId, user.id)),
    // Delete lists
    db.delete(lists).where(eq(lists.userId, user.id)),
    // Delete ratings
    db.delete(ratings).where(eq(ratings.userId, user.id)),
    // Delete user
    db.delete(users).where(eq(users.id, user.id)),
  ]);

  return c.json({ success: true });
});

const getGoogle = (c: Context) => {
  const expoAddress = c.req.query("expoAddress");
  return new Google(
    c.env.GOOGLE_CLIENT_ID,
    c.env.GOOGLE_CLIENT_SECRET,
    `${c.env.SERVER_URL}/api/auth/google/callback${expoAddress ? `?expoAddress=${expoAddress}` : ""}`,
  );
};

app.get("/api/auth/google", async (c) => {
  const google = getGoogle(c);

  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url: URL = google.createAuthorizationURL(state, codeVerifier, [
    "profile",
    "email",
  ]);

  setCookie(c, "state", state, {
    secure: process.env.NODE_ENV === "production",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
  });
  setCookie(c, "codeVerifier", codeVerifier, {
    secure: process.env.NODE_ENV === "production",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
  });

  return c.redirect(url.toString());
});

app.get("/api/auth/google/callback", async (c) => {
  const google = getGoogle(c);

  const { code, codeVerifier } = await validateState(c, true);

  const tokens = await google.validateAuthorizationCode(code, codeVerifier);

  // Get user email and googleId
  const response = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    },
  );
  const user: unknown = await response.json();
  const { sub: googleId, email } = z
    .object({
      sub: z.string(),
      email: z.string(),
    })
    .parse(user);

  return handleUser(c, { googleId, email });
});
export default app;
