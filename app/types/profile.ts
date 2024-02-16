import { profile } from "@/server/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const reserved = [
	"artists",
	"artist",
	"albums",
	"album",
	"songs",
	"song",
	"about",
	"terms",
	"onboard",
	"api",
	"list",
	"playlist",
	"support",
	"contact",
	"friends",
	"messages",
	"recommendations",
	"notifications",
	"settings",
	"search",
	"home",
];

export const ProfileNameSchema = z
	.string()
	.min(1, "Must be at least 1 character")
	.max(50, "Must be less than 50 characters");

export const handleRegex = /^[a-zA-Z0-9_]+$/i;
export const ProfileHandleSchema = z
	.string()
	.min(1, "Must be at least 1 character")
	.max(20, "Must be less than 20 characters")
	.regex(handleRegex, "Must be letters, numbers, or _")
	.refine((handle) => {
		if (reserved.includes(handle.toLowerCase())) {
			return "Handle is reserved";
		}
		return true;
	});
export const ProfileBioSchema = z.string().max(200, "Must be less than 200 characters");

export const ProfileSchema = createSelectSchema(profile, {
	name: ProfileNameSchema,
	handle: ProfileHandleSchema,
	bio: ProfileBioSchema.nullable(),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const CreateProfileSchema = ProfileSchema.pick({
	name: true,
	handle: true,
	imageUrl: true,
	bio: true,
});
export type CreateProfile = z.infer<typeof CreateProfileSchema>;

export const UpdateProfileSchema = CreateProfileSchema.extend({
	oldHandle: z.string().optional(),
});
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;
