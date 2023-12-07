import { profile } from "@/server/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const ProfileSchema = createSelectSchema(profile, {
	handle: z
		.string()
		.min(1, "Must be at least 1 character")
		.max(20, "Must be less than 20 characters")
		.regex(/^[a-zA-Z0-9_]+$/i, "Can only contain letters, numbers, and _"),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const CreateProfileSchema = ProfileSchema.pick({
	name: true,
	handle: true,
	imageUrl: true,
});
export type CreateProfile = z.infer<typeof CreateProfileSchema>;
