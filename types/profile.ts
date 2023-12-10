import { profile } from "@/server/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const handleRegex = /^[a-zA-Z0-9_]+$/i;

export const ProfileSchema = createSelectSchema(profile, {
	name: z
		.string()
		.min(1, "Must be at least 1 character")
		.max(50, "Must be less than 50 characters"),
	handle: z
		.string()
		.min(1, "Must be at least 1 character")
		.max(20, "Must be less than 20 characters")
		.regex(handleRegex, "Must be letters, numbers, or _"),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const CreateProfileSchema = ProfileSchema.pick({
	name: true,
	handle: true,
});
export type CreateProfile = z.infer<typeof CreateProfileSchema>;
